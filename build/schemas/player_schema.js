"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PlayerCreditsSchema = new _mongoose["default"].Schema({
  "playerName": {
    "type": "String"
  },
  "playerCredit": {
    "type": "Number"
  }
}, {
  collection: "credits"
});
var PlayerCredits = new _mongoose["default"].model("player", PlayerCreditsSchema);
var _default = PlayerCredits;
exports["default"] = _default;
//# sourceMappingURL=player_schema.js.map