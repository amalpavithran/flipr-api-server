import mongoose from "mongoose";
const UserPlayerSchema = new mongoose.Schema(
    {
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
    },
);

const UserPlayer = mongoose.model("user-player", UserPlayerSchema)

module.exports = {
    UserPlayer: UserPlayer,
    UserPlayerSchema: UserPlayerSchema
}