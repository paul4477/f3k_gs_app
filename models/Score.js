const Schema = require('mongoose').Schema;
const model = require('mongoose').model;

Schema.Types.Boolean.convertToFalse.add('False');
Schema.Types.Boolean.convertToTrue.add('True');

var scoreSchema = new Schema({
    CompID: String,
    CompType: String,
    RoundNo: Number,
    GroupNo: Number,
    ReFlightNo: Number,
    PilotNo: Number,
    SeqNo: Number,
    Data1: Number,
    Data2: Number,
    Data3: Number,
    Data4: Number,
    Data5: Number,
    Data6: Number,
    Data7: Number,
    Penalty: Number,
    PilotName: String,
    StartNo: Number,
    DateCreated: Number,
    Updated: {type: Boolean, default: false},
    OriginalRoundNo: Number,
    LandingOver75m: Boolean,
    ProgressiveTotalScore: Number,
    ProgressiveRank: String,
    ProgressivePercent: Number,
    ResultsToRoundNo: Number,
    ProgressiveHiddenRank: Number,
    RawScore: Number,
    NormalisedScore: Number,
    TaskNo: Number,
    Country: String,
    HelperName: String,
    ModelIDList: String,
    ModelID: Number,

    Downloaded: {type: Number, default: 0}
});


const Score = model('Score', scoreSchema);

module.exports = Score;
