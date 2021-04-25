"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var UserPlayerSchema = new _mongoose["default"].Schema({
  "name": {
    "type": "String"
  },
  "credit": {
    "type": "Number"
  },
  "role": {
    "type": "String",
    "enum": ['captain', 'vice-captain', 'player']
  }
});

var UserPlayer = _mongoose["default"].model("user-player", UserPlayerSchema);

module.exports = {
  UserPlayer: UserPlayer,
  UserPlayerSchema: UserPlayerSchema
};
//# sourceMappingURL=user_player.js.map