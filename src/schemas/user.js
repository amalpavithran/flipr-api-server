import mongoose from 'mongoose'
const { UserPlayerSchema } = require("./user_player");
var UserSchema = new mongoose.Schema(
    {
        "username": {
            "type": "String"
        },
        "password": {
            "type": "String"
        },
        "team": {
            "type": [UserPlayerSchema]
        }
    },
    {collection:"users"}
)


const User = mongoose.model("user",UserSchema);
export default User;