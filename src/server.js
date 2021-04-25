var express = require("express");
var cors = require("cors")
var app = express();

var connection_string = "mongodb://127.0.0.1:27017/flipr";
const mongoose = require('mongoose');
const { default: MatchModel } = require("./schemas/match_schema");
const { default: TeamsModel } = require("./schemas/team_schema");
const { default: User } = require("./schemas/user");
const { UserPlayer } = require("./schemas/user_player");
const { default: CreditModel } = require("./schemas/player_schema");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

try {
    mongoose.connect(connection_string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    });
} catch (e) {
    console.log(e);
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DB: connected");
});


app.post("users/login", function (req, res) {

});

app.post("users/signup", function (req, res) {

})

app.get("/getBallData",  async function (req, res) {
    // console.log("gettingBallData")
    const matchId = req.query.matchId;
    const ballNo = req.query.ballNo;
    const innings = req.query.innings;
    var userTeam = req.query.userTeam;
    console.log("gettingBallData" + ballNo)
    // console.log("MatchId",matchId)
    // console.log("BallNo",ballNo)
    // console.log(innings)
    var match = await MatchModel.findById(matchId).lean();
    var matchInning = match.innings[innings]
    var matchOver = false
    if(innings == 0){
        var deliveries = matchInning['1st innings']
    }
    else{
        var deliveries = matchInning['2nd innings']
    }
    if(ballNo >= deliveries.deliveries.length-2){
        matchOver=true
    }
    var currBall =  deliveries.deliveries[ballNo]
    var overNo =  String(Object.keys(currBall)[0])
    var currBallData = currBall[String(Object.keys(currBall)[0])]
    var runs = currBallData.runs.total;
    var wickets = currBallData.wicket;
    const eventData  = {"caught" : 25, "bowled" : 33, "run out" : "25", "lbw" : 33, "retired hurt" : 0, "stumped" : 25, "caught and bowled" : 40, "hit wicket" : "25"}
    userTeam =  userTeam.map((player)=>{
        player = JSON.parse(player);
        player.playerName = player.playerName.trim().split('-')[0]
        // console.log(player)
        if(wickets!==undefined){
            if(player.playerName === wickets.player_out){
                player.battingData.out = true;
                player.battingData.outType = wickets.kind;
            }
            else if(player.playerName === currBallData.bowler){
                player.bowlingData.wickets = player.bowlingData.wickets + 1
                var eventPt = eventData[String(wickets.kind)]
                player.points = player.points + eventPt
            }
            }
        if(player.playerName  === currBallData.batsman){

                player.battingData.runs = player.battingData.runs + runs;
                if(currBallData.runs.batsman >= 6){
                    player.battingData["6s"] = player.battingData["6s"] + 1
                }
                else if(currBallData.runs.batsman >= 4){
                    player.battingData["4s"] = player.battingData["4s"] + 1
                }
                player.battingData.balls = player.battingData.balls + 1;
                var pts = runs*(1+(player.isCaptain*2))*(1+(player.isVCaptain*0.5))
                if((runs % 50 == 0)&  (runs%100!=0)){
                    pts = pts + 58
                }
                player.points = player.points + pts
            }
            if(player.isCaptain){
                player.playerName = player.playerName.trim().split('-')[0]+ "  -  (C)"
            }
            if(player.isVCaptain){
                player.playerName = player.playerName.trim().split('-')[0] + "  - (VC)"
            }
        return player;

    })


    // console.log(currBallData)
    // console.log(userTeam)
    var responseObj = {id : matchId, userTeam : userTeam, overNo:overNo, matchOver:matchOver}
    res.json(responseObj)


})

app.get("/startMatch", async function (req, res) {
    const matchId = req.query.id;
    const selectedPlayers = req.query.selectedPlayers;
    const captain = req.query.captain;
    const vcaptain = req.query.vcaptain;
    // console.log(selectedPlayers);
    // console.log(captain);
    // console.log(vcaptain);
    var userTeam = []
    var playerJson = selectedPlayers.map((player) => {
        player = JSON.parse(player);
        
        var playerJson = {  playerName : player.playerName, 
                        playerTeam : "",
                        isCaptain : player.playerName == captain,
                        isVCaptain : player.playerName == vcaptain, 
                        battingData: {
                            runs : 0,
                            balls : 0,
                            out : false,
                            outType : "",
                            "6s" : 0,
                            "4s" : 0,
                        },
                        bowlingData: {
                            overs : 0,
                            runs : 0,
                            wickets : 0,
                        },
                        points : 0,

                        }
                    return playerJson
                    })
        //userTeam.push(playerJson);
        // console.log(playerJson)
        var responseObj = {id : matchId, userTeam : playerJson}
        res.json(responseObj)
    // selectedPlayers.map()

    // try{
    //     var team = await TeamsModel.findById(matchId).lean();
    //     console.log(team.players)
    // }
    // catch(error){
    //     console.log(error);

    // }

});

app.post("/users/team/set", async function (req, res) {
    const data = req.body;
    console.log(req.body);
    if (!data["team"]) {
        res.status(400).send({ "message": "Bad request" });
    }
    if (data["team"].length != 11) {
        res.status(400).send({ "message": "Number of players not 11" });
        return;
    }
    console.log(data["team"]);
    try {
        var user = await User.findById(data["id"]);
        var team = data["team"].map((player) => new UserPlayer(player));
        if (user == null) {
            var doc = await User.create({_id:data['id'],"team": team });
            res.json(doc);
        }else{
            await user.updateOne({"team":team});
            user = await User.findById(data["id"]);
            res.json(user);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ "message": "An error occurred" });
    }

})

app.get("/matches", async function (req, res) {
    const skippedPages = parseInt(req.query.page) ? parseInt(req.query.page) : 0 * 20;
    try {
        var results = await MatchModel.find({}, { "info.teams": 1 }, { skip: skippedPages, limit: 230 }).lean();
        console.log(results.length)
        var final_response = results.map(function (result) {
            return {
                "_id": result._id,
                "team1": result.info.teams[0],
                "team2": result.info.teams[1]
            }
        });
        res.json(results);
    } catch (e) {
        console.log(e);
    }
});

app.get("/matches/:id/players", async function (req, res) {
    const matchId = req.query.id;
    // console.log(matchId);
    try {
        var teams = await TeamsModel.findById(matchId).lean();
        var playerNames = []
        teams.players.map((player) => playerNames.push(player.playerName))
        var credits = await CreditModel.find({"playerName" : {"$in" : playerNames}})
        // console.log(playerNames);
        // console.log(credits);
        // console.log(teams.players)
        teams.players.map((playerDet) => playerDet["playerCredit"] = credits.find((o) => o.playerName === playerDet.playerName).playerCredit);
        // console.log(teams)
        res.json(teams);
        
    }catch(e){
        console.log(e);
    }
})

app.get("/matches/generateplayerlist", async function (req, res) {
    try {
        var matches = await MatchModel.find({}, { "info.teams": 1, innings: 1 }).lean();
        // var credits = await MatchModel.find()
        console.log(matches.length)
        var player_list = matches.map(function (match) {
            var players = [];
            var team1 = match.innings[0]["1st innings"]["team"];
            var team2 = match.innings[1]["2nd innings"]["team"];
            // console.log(match.innings[0]["1st innings"]["deliveries"]);
            match.innings[0]["1st innings"]["deliveries"].map(function (ball) {
                var key = Object.keys(ball)[0];
                // console.log(ball);
                if (players.findIndex((element) => element.playerName == ball[key]["batsman"]) == -1) {
                    players.push({ "playerName": ball[key]["batsman"], "playerTeam": team1 });
                }
                if (players.findIndex((element) => element.playerName == ball[key]["bowler"]) == -1) {
                    players.push({ "playerName": ball[key]["bowler"], "playerTeam": team2 });
                }
                if (players.findIndex((element) => element.playerName == ball[key]["non_striker"]) == -1) {
                    players.push({ "playerName": ball[key]["non_striker"], "playerTeam": team1 });
                }
            });
            match.innings[1]["2nd innings"]["deliveries"].map(function (ball) {
                var key = Object.keys(ball)[0];
                if (players.findIndex((element) => element.playerName == ball[key]["batsman"]) == -1) {
                    players.push({ "playerName": ball[key]["batsman"], "playerTeam": team2 });
                }
                if (players.findIndex((element) => element.playerName == ball[key]["bowler"]) == -1) {
                    players.push({ "playerName": ball[key]["bowler"], "playerTeam": team1 });
                }
                if (players.findIndex((element) => element.playerName == ball[key]["non_striker"]) == -1) {
                    players.push({ "playerName": ball[key]["non_striker"], "playerTeam": team2 });
                }
            });
            return { "_id": match._id, "players": players };
        });
        res.json(player_list);

    } catch (e) {
        console.log(e);
    }
})

app.get("/", function (req, res) {
    res.send("Working");
});

process.on('uncaughtException', function (exception) {
    console.log(exception);
});
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
