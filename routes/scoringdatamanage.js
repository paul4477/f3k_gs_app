var express = require('express');
var router = express.Router();


function BackupScoresCheckForData(CompID, res) {
    res.status(404).send("Not implemented");
}
function BackupScoresDelete(CompID, res) {
    res.status(404).send("Not implemented");
}
function BackupScores(CompID, res) {
    res.status(404).send("Not implemented");
}
function MakeScoresZero(CompID, res) {
    res.status(404).send("Not implemented");
}
function getBackupDateTime(CompID, res) {
    res.status(404).send("Not implemented");
}
function RestoreScoresCheckForData(CompID, res) {
    res.status(404).send("Not implemented");
}
function RestoreScoresCheckForData(CompID, res) {
    res.status(404).send("Not implemented");
}
function RestoreScores(CompID, res) {
    res.status(404).send("Not implemented");
}
function ScoreEntryOpen(CompID, res) {
    res.status(404).send("Not implemented");
}
function ScoreEntryClose(CompID, res) {
    res.status(404).send("Not implemented");
}
function ValidateCompID(CompID, res) {
    res.status(404).send("Not implemented");
}
function DeleteComp(CompID, res) {
    res.status(404).send("Not implemented");
}
// Duplicate ScoringDataUpload.aspx implementation
router.get('/scoringdatamanage.aspx', (req, res) => {
    /*     
    Action = Request.QueryString("ACTION")
    CompID = Request.QueryString("ID")
    RoundNo = Request.QueryString("RD")
    GroupNo = Request.QueryString("GR")
    CompTypeString = Request.QueryString("TK")
    
    Select Case Action
        Case "ScoresBackupCheckForData" : BackupScoresCheckForData(CompID)
        Case "ScoresBackupDelete" : BackupScoresDelete(CompID)
        Case "ScoresBackup"
            DateTimeString = Request.QueryString("DT")
            Dim provider As CultureInfo = CultureInfo.InvariantCulture
            BackupDateTime = DateTime.ParseExact(Request.QueryString("DT"), "yyyyMMddHHmmss", provider)
            BackupScores(CompID, BackupDateTime)
    
        Case "MakeScoresZero" : MakeScoresZero(CompID, RoundNo, GroupNo, CompTypeString)
    
        Case "getBackupDateTime" : getBackupDateTime(CompID)
    
        Case "ScoresRestoreCheckForData" : RestoreScoresCheckForData(CompID)
        Case "ScoresRestoreDelete" : RestoreScoresDelete(CompID)
        Case "ScoresRestore" : RestoreScores(CompID)
    
        Case "ScoreEntryOpen" : ScoreEntryOpen(CompID)
        Case "ScoreEntryClose" : ScoreEntryClose(CompID)
    
        Case "ValidateCompID" : ValidateCompID(CompID)
    
        Case "DeleteComp" : DeleteComp(CompID)
    
    End Select */


    const CompID = req.query.ID;
    const RoundNo = req.query.RD;
    const GroupNo = req.query.GR;
    const CompTypeString = req.query.TK

    switch (req.query.ACTION) {
        case "ScoresBackupCheckForData":
            return BackupScoresCheckForData(CompID, FromRound, ToRound, res);
            break;
        case "ScoresBackupDelete":
            return BackupScoresDelete(CompID, FromRound, ToRound, res);
            break;
        case "ScoresBackup":
            return BackupScores(CompID, BackupDateTime, res);
            break;
        case "MakeScoresZero":
            return MakeScoresZero(CompID, RoundNo, GroupNo, CompTypeString, res);
            break;
        case "getBackupDateTime":
            return getBackupDateTime(CompID, res);
            break;
        case "ScoresRestoreCheckForData":
            return RestoreScoresCheckForData(CompID, res);
            break;
        case "ScoresRestoreDelete":
            return RestoreScoresCheckForData(CompID, res);
            break;
        case "ScoresRestore":
            return RestoreScores(CompID, res);
            break;
        case "ScoreEntryOpen":
            return ScoreEntryOpen(CompID, res);
            break;
        case "ScoreEntryClose":
            return ScoreEntryClose(CompID, res);
            break;
        case "ValidateCompID":
            return ValidateCompID(CompID, res);
            break;
        case "DeleteComp":
            return DeleteComp(CompID, res);
            break;
    }
    res.status(404).send("Not going to be implemented");
});

module.exports = router;
