"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _require = require("./user_player"),
    UserPlayerSchema = _require.UserPlayerSchema;

var UserSchema = new _mongoose["default"].Schema({
  "username": {
    "type": "String"
  },
  "password": {
    "type": "String"
  },
  "team": {
    "type": [UserPlayerSchema]
  }
}, {
  collection: "users"
});

var User = _mongoose["default"].model("user", UserSchema);

var _default = User;
exports["default"] = _default;
//# sourceMappingURL=user.js.map