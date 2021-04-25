import mongoose from 'mongoose'

var PlayerCreditsSchema = new mongoose.Schema(
    {
        "playerName": {
            "type": "String"
        },
        "playerCredit": {
            "type": "Number"
        }
    },
    {collection:"credits"}
)

const PlayerCredits = new mongoose.model("player",PlayerCreditsSchema);
export default PlayerCredits;