var express = require('express');
var router = express.Router();

const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');

const models = require('../models/');

function CheckScoresExist(CompID, FromRound, ToRound, res) {
    //try {
    console.log(FromRound, ToRound)
    models.Score.find({
        CompID: CompID,
        Updated: true,
        $and: [{ RoundNo: { $gte: FromRound } }, { RoundNo: { $lte: ToRound } }]
    }, (err, docs) => {
        if (err) {
            res.status(200).send(`NoScoringDataFound`);
        }
        //console.log(docs[0])
        if (docs == null) {
            res.status(200).send(`NoScoringDataFound`);
        }
        else {
            res.status(200).send(`ScoringDataFound`);
        }
    });
    //}
    //catch (error) {
    //     res.status(200).send("NoScoringDataFound");
    //}
};


function DownloadScoringData(CompID, FromRound, ToRound, res) {

    const downloadDataHeaders = [
        "CompID",
        "CompType",
        "RoundNo",
        "GroupNo",
        "ReFlightNo",
        "PilotNo",
        "Data1",
        "Data2",
        "Data3",
        "Data4",
        "Data5",
        "Data6",
        "Data7",
        "LandingOver75m",
        "Penalty",
        "PilotName",
        "ModelID"
    ]

    //Operate on Scores for this CompID with Updated set to True.
    models.Score.find({
        CompID: CompID,
        Updated: true,
        $and: [{ RoundNo: { $gte: FromRound } }, { RoundNo: { $lte: ToRound } }]
    }, (err, docs) => {
        if (err) {
            res.status(404).send(`DownloadFileCreationFailed`);
        }
        if (docs == null || docs.length == 0) {
            res.status(200).send(`NoScoringInformationFound`);
        }
        else {
            // docs is list of scores
            let csvData = stringify(docs, {
                header: false,
                columns: downloadDataHeaders,
                delimiter: '|',
                record_delimiter: 'windows',
                cast: {
                    boolean: value => { if (value) { return "True" } else { return "False" } }
                }
            });
            for (i = 0; i < docs.length; i++) {
                docs[i].Downloaded = true;
                docs[i].save()
            }
            fs.writeFileSync(`public/scoredownload/${CompID}_DownloadData.csv`, csvData, 'utf-8')
            res.status(200).send(`DownloadFileCreationSuccess`);
        }
    });
}

function DeleteDownloadFile(CompID, res) {
    try {
        fs.unlinkSync(`public/scoredownload/${CompID}_DownloadData.csv`)
        res.status(200).send(`DownloadFileDeleteSuccess`);
    }
    catch {
        res.status(200).send(`DownloadFileDeleteFailed`);
    }
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
    const FromRound = parseInt(req.query.FR);
    const ToRound = parseInt(req.query.TR);

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
