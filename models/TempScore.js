const Schema = require('mongoose').Schema;
const model = require('mongoose').model;

Schema.Types.Boolean.convertToFalse.add('False');
Schema.Types.Boolean.convertToTrue.add('True');

var tempScoreSchema = new Schema({
    group: Number,
    round: Number,
    pilot: String,
    times: []
});

const TempScore = model('TempScore', tempScoreSchema);

module.exports = TempScore;
