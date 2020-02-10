var express = require('express');
var router = express.Router();

function CheckScoresExist(CompID, FromRound, ToRound, res) {
    res.status(404).send("Not implemented");
}

function DownloadScoringData(CompID, FromRound, ToRound,res) {
    res.status(404).send("Not implemented");
}

function DeleteDownloadFile(CompID, res) {
    res.status(404).send("Not implemented");
}

// Duplicate ScoringDataUpload.aspx implementation
router.get('/scoringdatadownload.aspx', (req, res) => {
/*
    Dim Action As String = Request.QueryString("ACTION")
    Dim CompID As String = Request.QueryString("ID") ' compID
    Dim FromRound As Integer = Request.QueryString("FR") ' From round
    Dim ToRound As Integer = Request.QueryString("TR") ' To round
    Select Case Action
        Case "CheckScoresExist" : CheckScoresExist(CompID, FromRound, ToRound)
        Case "DownloadScoringData" : DownloadScoringData(CompID, FromRound, ToRound)
        Case "DeleteDownloadFile" : DeleteDownloadFile(CompID)
        Case Else
    End Select
*/

    const CompID = req.query.ID;
    const FromRound = req.query.FR;
    const ToRound = req.query.TR;

    switch (req.query.ACTION) {
        case "CheckScoresExist":
            return CheckScoresExist(CompID, FromRound, ToRound, res);
            break;
        case "DownloadScoringData":
            return DownloadScoringData(CompID, FromRound, ToRound, res);
            break;
        case "DeleteDownloadFile":
            return DeleteDownloadFile(CompID, res);
            break;
    }
    res.status(404).send("Not going to be implemented");
});

module.exports = router;
