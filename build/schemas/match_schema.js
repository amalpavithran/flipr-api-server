"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var MatchSchema = new _mongoose["default"].Schema({
  "meta": {
    "data_version": {
      "type": "Number"
    },
    "created": {
      "type": "Date"
    },
    "revision": {
      "type": "Number"
    }
  },
  "info": {
    "city": {
      "type": "String"
    },
    "competition": {
      "type": "String"
    },
    "dates": {
      "type": ["String"]
    },
    "gender": {
      "type": "String"
    },
    "match_type": {
      "type": "String"
    },
    "outcome": {
      "by": {
        "runs": {
          "type": "Number"
        }
      },
      "winner": {
        "type": "String"
      }
    },
    "overs": {
      "type": "Number"
    },
    "player_of_match": {
      "type": ["String"]
    },
    "teams": {
      "type": ["String"]
    },
    "toss": {
      "decision": {
        "type": "String"
      },
      "winner": {
        "type": "String"
      }
    },
    "umpires": {
      "type": ["String"]
    },
    "venue": {
      "type": "String"
    }
  },
  "innings": {
    "type": ["Mixed"]
  }
}, {
  collection: 'matches'
});

var MatchModel = _mongoose["default"].model('match', MatchSchema);

var _default = MatchModel;
exports["default"] = _default;
//# sourceMappingURL=match_schema.js.map