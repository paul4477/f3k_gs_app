
const Schema = require('mongoose').Schema;
const model = require('mongoose').model;

Schema.Types.Boolean.convertToFalse.add('False');
Schema.Types.Boolean.convertToTrue.add('True');

var competitionSchema = new Schema({
    CompID: { type: String, unique: true },
    CompType: String,
    TimingDecimalPlaces: Number,
    DateCreated: Number,
    UseLanes: Boolean,
    GroupScoreOption: Number,
    GroupScoreDecimals: Number,
    RoundOrTruncate: Number,
    Drop1At: Number,
    Drop2At: Number,
    Drop3At: Number,
    Drop4At: Number,
    Drop5At: Number,
    F5JRefHeight: Number,
    F5JPenaltyUpTo: Number,
    F5JPenaltyOver: Number,
    F5BPointsPerLap: Number,
    F5BWattMinPenaltyPoints: Number,
    F5BWattMinPerQuantity: Number,
    F5BWattMinRoundingIdx: Number,
    SpeedDecimals: Number,
    CompHasLandings: Boolean,
    CompName: String,
    CompVenue: String,
    CompDate: String, // Date?? '2020-02-18 00:00:00'
    IsPublic: Boolean,
    DropScoreOption: Number,
    durPointsPerSecond: Number,
    durNoOfTimekeepers: Number,
    spdNoOfTimeKeepers: Number,
    f5bNoOfTimekeepers: Number,
    AssignHelpers: Boolean,
    F5BWattMinBaseQuantity: Number,
    F5BMotorRunPenaltyPerSecond: Number,
    UseModels: Boolean,

    rounds: []
});

const Competition = model('Competition', competitionSchema);

module.exports = Competition;
