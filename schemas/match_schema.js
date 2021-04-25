import mongoose from 'mongoose'
const MatchSchema = new mongoose.Schema({
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
            "type": [
                "String"
            ]
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
            "type": [
                "String"
            ]
        },
        "teams": {
            "type": [
                "String"
            ]
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
            "type": [
                "String"
            ]
        },
        "venue": {
            "type": "String"
        }
    },
    "innings": {
        "type": [
            "Mixed"
        ]
    },
},
    { collection: 'matches' }
)

const MatchModel = mongoose.model('match', MatchSchema);
export default MatchModel;