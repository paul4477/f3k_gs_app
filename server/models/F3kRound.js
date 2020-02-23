const Schema = require('mongoose').Schema;
const model = require('mongoose').model;

Schema.Types.Boolean.convertToFalse.add('False');
Schema.Types.Boolean.convertToTrue.add('True');

var f3kRoundSchema = new Schema({
    CompID: String,
    RoundNo: Number,
    F3KTask: String,
    F3KTaskAbbreviation: String,
    F3KTaskDescription: String,
    F3KTaskMaxScores: Number,
    F3KTaskMaxFlights: Number,
    DateCreated: Number
});

const F3kRoundSchema = model('F3kRound', f3kRoundSchema);

module.exports = F3kRoundSchema;
