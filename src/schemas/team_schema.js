import mongoose, { Collection } from 'mongoose'

var PlayerSchema = new mongoose.Schema(
    {
        "playerName": {
            "type": "String"
        },
        "playerTeam": {
            "type": "String"
        }
    },
);

var TeamsSchema = new mongoose.Schema(
    {
        "_id": {
            "type": "ObjectId"
        },
        "players": {
            "type": [
                PlayerSchema
            ]
        }
    }
);

var TeamsModel = mongoose.model("teams", TeamsSchema);
export default TeamsModel;