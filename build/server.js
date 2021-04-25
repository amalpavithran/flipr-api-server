"use strict";

require("core-js/stable");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var dotenv = require('dotenv');

dotenv.config();

var express = require("express");

var cors = require("cors");

var app = express();
var connection_string = process.env.DB_CONNECTION_STRING;

var mongoose = require('mongoose');

var _require = require("./schemas/match_schema"),
    MatchModel = _require["default"];

var _require2 = require("./schemas/team_schema"),
    TeamsModel = _require2["default"];

var _require3 = require("./schemas/user"),
    User = _require3["default"];

var _require4 = require("./schemas/user_player"),
    UserPlayer = _require4.UserPlayer;

var _require5 = require("./schemas/player_schema"),
    CreditModel = _require5["default"];

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(cors());
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

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("DB: connected");
});
app.post("users/login", function (req, res) {});
app.post("users/signup", function (req, res) {});
app.post("/users/team/set", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var data, user, team, doc;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = req.body;
            console.log(req.body);

            if (!data["team"]) {
              res.status(400).send({
                "message": "Bad request"
              });
            }

            if (!(data["team"].length != 11)) {
              _context.next = 6;
              break;
            }

            res.status(400).send({
              "message": "Number of players not 11"
            });
            return _context.abrupt("return");

          case 6:
            console.log(data["team"]);
            _context.prev = 7;
            _context.next = 10;
            return User.findById(data["id"]);

          case 10:
            user = _context.sent;
            team = data["team"].map(function (player) {
              return new UserPlayer(player);
            });

            if (!(user == null)) {
              _context.next = 19;
              break;
            }

            _context.next = 15;
            return User.create({
              _id: data['id'],
              "team": team
            });

          case 15:
            doc = _context.sent;
            res.json(doc);
            _context.next = 25;
            break;

          case 19:
            _context.next = 21;
            return user.updateOne({
              "team": team
            });

          case 21:
            _context.next = 23;
            return User.findById(data["id"]);

          case 23:
            user = _context.sent;
            res.json(user);

          case 25:
            _context.next = 31;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](7);
            console.log(_context.t0);
            res.status(500).send({
              "message": "An error occurred"
            });

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 27]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.get("/matches", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var skippedPages, results, final_response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            skippedPages = parseInt(req.query.page) ? parseInt(req.query.page) : 0 * 20;
            _context2.prev = 1;
            _context2.next = 4;
            return MatchModel.find({}, {
              "info.teams": 1
            }, {
              skip: skippedPages,
              limit: 20
            }).lean();

          case 4:
            results = _context2.sent;
            final_response = results.map(function (result) {
              return {
                "_id": result._id,
                "team1": result.info.teams[0],
                "team2": result.info.teams[1]
              };
            });
            res.json(results);
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](1);
            console.log(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 9]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.get("/matches/:id/players", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var matchId, teams, playerNames, credits;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            matchId = req.params.id; // console.log(matchId);

            _context3.prev = 1;
            _context3.next = 4;
            return TeamsModel.findById(matchId).lean();

          case 4:
            teams = _context3.sent;
            playerNames = [];
            teams.players.map(function (player) {
              return playerNames.push(player.playerName);
            });
            _context3.next = 9;
            return CreditModel.find({
              "playerName": {
                "$in": playerNames
              }
            });

          case 9:
            credits = _context3.sent;
            // console.log(playerNames);
            // console.log(credits);
            // console.log(teams.players)
            teams.players.map(function (playerDet) {
              return playerDet["playerCredit"] = credits.find(function (o) {
                return o.playerName === playerDet.playerName;
              }).playerCredit;
            }); // console.log(teams)

            res.json(teams);
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](1);
            console.log(_context3.t0);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 14]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
app.get("/matches/generateplayerlist", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var matches, player_list;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return MatchModel.find({}, {
              "info.teams": 1,
              innings: 1
            }).lean();

          case 3:
            matches = _context4.sent;
            // var credits = await MatchModel.find()
            console.log(matches.length);
            player_list = matches.map(function (match) {
              var players = [];
              var team1 = match.innings[0]["1st innings"]["team"];
              var team2 = match.innings[1]["2nd innings"]["team"]; // console.log(match.innings[0]["1st innings"]["deliveries"]);

              match.innings[0]["1st innings"]["deliveries"].map(function (ball) {
                var key = Object.keys(ball)[0]; // console.log(ball);

                if (players.findIndex(function (element) {
                  return element.playerName == ball[key]["batsman"];
                }) == -1) {
                  players.push({
                    "playerName": ball[key]["batsman"],
                    "playerTeam": team1
                  });
                }

                if (players.findIndex(function (element) {
                  return element.playerName == ball[key]["bowler"];
                }) == -1) {
                  players.push({
                    "playerName": ball[key]["bowler"],
                    "playerTeam": team2
                  });
                }

                if (players.findIndex(function (element) {
                  return element.playerName == ball[key]["non_striker"];
                }) == -1) {
                  players.push({
                    "playerName": ball[key]["non_striker"],
                    "playerTeam": team1
                  });
                }
              });
              match.innings[1]["2nd innings"]["deliveries"].map(function (ball) {
                var key = Object.keys(ball)[0];

                if (players.findIndex(function (element) {
                  return element.playerName == ball[key]["batsman"];
                }) == -1) {
                  players.push({
                    "playerName": ball[key]["batsman"],
                    "playerTeam": team2
                  });
                }

                if (players.findIndex(function (element) {
                  return element.playerName == ball[key]["bowler"];
                }) == -1) {
                  players.push({
                    "playerName": ball[key]["bowler"],
                    "playerTeam": team1
                  });
                }

                if (players.findIndex(function (element) {
                  return element.playerName == ball[key]["non_striker"];
                }) == -1) {
                  players.push({
                    "playerName": ball[key]["non_striker"],
                    "playerTeam": team2
                  });
                }
              });
              return {
                "_id": match._id,
                "players": players
              };
            });
            res.json(player_list);
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 9]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
app.get("/", function (req, res) {
  res.send("Working");
});
process.on('uncaughtException', function (exception) {
  console.log(exception);
});
var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});
//# sourceMappingURL=server.js.map