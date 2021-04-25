const dotenv = require('dotenv');
dotenv.config();
var express = require("express");
var cors = require("cors")
var app = express();

var connection_string = process.env.DB_CONNECTION_STRING;
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
        var results = await MatchModel.find({}, { "info.teams": 1 }, { skip: skippedPages, limit: 20 }).lean();
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
    const matchId = req.params.id;
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
