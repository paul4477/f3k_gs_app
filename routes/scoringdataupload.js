var express = require('express');

var router = express.Router();

const csv = require('csv-parser');
const fs = require('fs');

const models = require('../models/');

// Use schema definitions to create headers for csv parser
scoringData_headers = Object.keys(models.Score.schema.paths);
scoringData_headers = scoringData_headers.filter(item => item != "_id" && item != "__v");

compData_headers = Object.keys(models.Competition.schema.paths);
compData_headers = compData_headers.filter(item => item != "_id" && item != "__v");

f3kData_headers = Object.keys(models.F3kRound.schema.paths);
f3kData_headers = f3kData_headers.filter(item => item != "_id" && item != "__v");

function csvReader(fileName, headers) {
    return new Promise((resolve, reject) => {
        let results = []
        fs.createReadStream(fileName)
            .pipe(csv({ separator: '|', headers: headers }))
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', () => {
                reject(new Error('File reading error'))
            });
    });
}

async function parseCSV(fileName, headers) {
    try {
        const results = await csvReader(fileName, headers);
        //console.log(results.length, "rows read from", fileName)
        return results;
    }
    catch (err) {
        console.error('Error:', err.message);
    }
}

async function CheckForData(CompID, FromRound, ToRound, res) {

    const notDownloadedQuery = await models.Score
        .find({
            CompID: CompID,
            RoundNo: { $gte: FromRound },
            RoundNo: { $lte: ToRound },
            Updated: true,
            Downloaded: 0
        });
    //console.log(notDownloadedQuery.length)
    if (notDownloadedQuery.length > 0) {
        res.status(200).send("NeedsDownloading");
    }

    const scoreDataQuery = await models.Score
        .find({
            CompID: CompID,
            RoundNo: { $gte: FromRound },
            RoundNo: { $lte: ToRound },
        });
    //console.log(scoreDataQuery.length)
    if (scoreDataQuery.length > 0) {
        // data that has been updated but not yet downloaded
        res.status(200).send("ExistingDataFound");
    }
    else {
        res.status(200).send("NoDataFound");
    }

    // res.status(404).send("Not implemented");
    //res.status(200).send("NoDataFound");

    /*
    NotDownloadedCount = "SELECT Count(CompID) AS CountOfCompID FROM ScoringData WHERE CompID='" & CompID & "' And RoundNo>=" & FromRound & " And RoundNo<=" & ToRound & " And Updated='True' And Downloaded=0"
    ScoringDataCount = SELECT Count(CompID) AS CountOfCompID FROM ScoringData WHERE CompID='" & CompID & "' And RoundNo>=" & FromRound & " And RoundNo<=" & ToRound

    If NotDownloadedCount > 0 Then
        msg = "NeedsDownloading"
        Response.Write(msg)
    End If
    If ScoringDataCount > 0 Then
        msg = "ExistingDataFound" ' means data that has been updated but not yet downloaded
        Response.Write(msg)
    Else
        msg = "NoDataFound" ' means that no data found that needs protecting
        Response.Write(msg)
    End If
    */
}

async function RemoveData(CompID, FromRound, ToRound, res) {
    //res.status(404).send("Not implemented");
    /*
    try: DELETE FROM ScoringData WHERE CompID='" & CompID & "' And RoundNo>=" & FromRound & " And RoundNo<=" & ToRound
    except: Response.Write("RemovingExistingDataFailed")

    try: "DELETE FROM LandingData WHERE CompID='" & CompID & "'"
    except: Response.Write("RemovingExistingDataFailed")
            
    try: "DELETE FROM CompData WHERE CompID='" & CompID & "'"
    except: Response.Write("RemovingExistingDataFailed")

    try: "DELETE FROM F3KData WHERE CompID='" & CompID & "'"
    except: Response.Write("RemovingExistingDataFailed")

    Otherwise: Response.Write("RemovingExistingDataSucceeded")

    */

    try {
        await models.Score
            .deleteMany({
                CompID: CompID,
                RoundNo: { $gte: FromRound },
                RoundNo: { $lte: ToRound },
            });
        //console.log(CompID, FromRound, ToRound, r);
        await models.Competition
            .deleteMany({
                CompID: CompID,
            });
        // "F3KData" is stored as rounds list on Comp object so is removed as part of the comp above
    }
    catch(error){
        res.status(200).send("RemovingExistingDataFailed");
    }
    
    res.status(200).send("RemovingExistingDataSucceeded");

}

async function UploadScoringData(CompID, FromRound, ToRound, res) {
    //res.status(200).send("Scoring_DBUpdatedOK");
    /*
    Try to load csv scoring data
    except: data error
    try to update database with new data
    except connection or update error
    else updateok
    */

    let index = 0;


    const scoringRows = await parseCSV(`scoreupload/${CompID}_ScoringData.csv`, scoringData_headers);

    //Get comp object

    index = 0;
    while (index < scoringRows.length) {
        score = new models.Score(scoringRows[index]);
        score.save();
        //console.log(test.CompID);
        index++;
    }


    res.status(200).send("Scoring_DBUpdatedOK");
    /*
    On client side:
    Select Case ResponseFromServer
        Case "Scoring_DBUpdatedOK"  ' just move on because this is the result that we want
        Case "Scoring_ConnectionToDBFailed" : Msg = "ScoringData - Unable to connect to database. Please try again later."
        Case "Scoring_UnableToReadUploadedData" : Msg = "Unable to read all uploaded Scoring Data records. Please try again later."
        Case "Scoring_UnableToUpdateDatabase" : Msg = "Unable to update database with new Scoring Data. Please try again later."
    End Select
    */


}

async function UploadCompData(CompID, res) {


    const compRows = await parseCSV(`scoreupload/${CompID}_CompData.csv`, compData_headers);
    let comp = new models.Competition(compRows[0]);
    comp.save()
    res.status(200).send("CompData_DBUpdatedOK");

    //res.status(404).send("Not implemented");
    /*
    try: DELETE FROM CompData WHERE CompID='" & CompID & "'"
    except: Response.Write("CompData_UnableToRemoveOldData")

    Open CSV file: ~/ScoreUpload/<COMPID>_CompData.csv
    Loop over rows making a new "drNew" each time:
            drNew("CompID") = CurrentRow(0)
            drNew("CompType") = CurrentRow(1)
            drNew("TimingDecimalPlaces") = CurrentRow(2).ToString.Replace(",", ".")
            drNew("DateCreated") = CurrentRow(3)
            drNew("UseLanes") = CurrentRow(4)
            drNew("GroupScoreOption") = CurrentRow(5)
            drNew("GroupScoreDecimals") = CurrentRow(6).ToString.Replace(",", ".")
            drNew("RoundOrTruncate") = CurrentRow(7)
            drNew("Drop1At") = CurrentRow(8).ToString.Replace(",", ".")
            drNew("Drop2At") = CurrentRow(9).ToString.Replace(",", ".")
            drNew("Drop3At") = CurrentRow(10).ToString.Replace(",", ".")
            drNew("Drop4At") = CurrentRow(11).ToString.Replace(",", ".")
            drNew("Drop5At") = CurrentRow(12).ToString.Replace(",", ".")
            drNew("F5JRefHeight") = CurrentRow(13).ToString.Replace(",", ".")
            drNew("F5JPenaltyUpTo") = CurrentRow(14).ToString.Replace(",", ".")
            drNew("F5JPenaltyOver") = CurrentRow(15).ToString.Replace(",", ".")
            drNew("F5BPointsPerLap") = CurrentRow(16).ToString.Replace(",", ".")
            drNew("F5BWattMinPenaltyPoints") = CurrentRow(17).ToString.Replace(",", ".")
            drNew("F5BWattMinPerQuantity") = CurrentRow(18).ToString.Replace(",", ".")
            drNew("F5BWattMinRoundingIdx") = CurrentRow(19).ToString.Replace(",", ".")
            drNew("SpeedDecimals") = CurrentRow(20).ToString.Replace(",", ".")

            If CurrentRow(21) = "True" Then drNew("CompHasLandings") = True
            If CurrentRow(21) = "False" Then drNew("CompHasLandings") = False

            drNew("CompName") = CurrentRow(22)
            drNew("CompVenue") = CurrentRow(23)

            Dim strDate As Date = CurrentRow(24)
            drNew("CompDate") = strDate

            ' new fields added in version 6.53
            Try
                If CurrentRow(25) = "True" Then
                    drNew("IsPublic") = True
                Else
                    drNew("IsPublic") = False
                End If
                drNew("DropScoreOption") = CurrentRow(26).ToString.Replace(",", ".")
                drNew("durPointsPerSecond") = CurrentRow(27).ToString.Replace(",", ".")
                drNew("durNoOfTimekeepers") = CurrentRow(28).ToString.Replace(",", ".")
                drNew("spdNoOfTimeKeepers") = CurrentRow(29).ToString.Replace(",", ".")
                drNew("f5bNoOfTimekeepers") = CurrentRow(30).ToString.Replace(",", ".")
            Catch ex As Exception
                drNew("IsPublic") = False
                drNew("DropScoreOption") = 0
                drNew("durPointsPerSecond") = 1
                drNew("durNoOfTimekeepers") = 1
                drNew("spdNoOfTimeKeepers") = 1
                drNew("f5bNoOfTimekeepers") = 1
            End Try

            ' new field added in version 6.54
            Try
                drNew("AssignHelpers") = CurrentRow(31)
            Catch ex As Exception
                drNew("AssignHelpers") = False
            End Try

            ' new fields added in version 6.55
            Try
                drNew("F5BWattMinBaseQuantity") = CurrentRow(32)
                drNew("F5BMotorRunPenaltyPerSecond") = CurrentRow(33)
            Catch ex As Exception
                drNew("F5BWattMinBaseQuantity") = 1750
                drNew("F5BMotorRunPenaltyPerSecond") = 3
            End Try

            ' new field added in version 6.59
            Try
                drNew("UseModels") = CurrentRow(34)
            Catch ex As Exception
                drNew("UseModels") = False
            End Try
    On failure to read data:
        Response.Write("CompData_UnableToReadUploadedData")
    
    try: Update Database, Response.Write("CompData_DBUpdatedOK")
    except: Response.Write("CompData_UnableToUpdateDatabase")        
  


    */


}

function UploadTargetTimeByRound(CompID, res) {
    // F5B or Duration
    res.status(404).send("Not implemented");
}

async function UploadF3KData(CompID, res) {
    

    //console.log(CompID);    
    //console.log("row", scoringRows[--index]);    

    const f3kRows = await parseCSV(`scoreupload/${CompID}_F3KData.csv`, f3kData_headers);

    const comp = await models.Competition
    .findOne({
        CompID: CompID,
    });
    //console.log(CompID, comp);    
    index = 0;
    while (index < f3kRows.length) {
        test = new models.F3kRound(f3kRows[index]);
        comp.rounds.push(test);
        //console.log(test.CompID);
        index++;
    }
    //console.log(f3kRows[7]);
    //test = new models.F3k(f3kRows[0]);
    //test.save();
    comp.save();
    //console.log(comp);
    //console.log(db.disconnect);
    //mongoose.disconnect();
res.status(200).send("");


    /*
    On client side:
    Select Case ResponseFromServer
        Case "F3KData_ConnectionToDBFailed" : Msg = "F3KData - Unable to connect to database. Please try again later."
        Case "F3KData_UnableToRemoveOldData" : Msg = "F3KData - Unable to remove old data. Please try again later. "
        Case "F3KData_UnableToReadUploadedData" : Msg = "Unable to read all uploaded F3KData records. Please try again later."
        Case "F3KData_UnableToUpdateDatabase" : Msg = "Unable to update database with new F3KData. Please try again later."
    End Select

    try: DELETE FROM F3KData WHERE CompID='" & CompID & "'"
    except: Response.Write("F3KData_UnableToRemoveOldData")  

    Open CSV file: ~/ScoreUpload/<COMPID>_F3KData.csv
    Delimiter = "|"

    try: Update database
    except: Response.Write("F3KData_UnableToUpdateDatabase")

    */
}

function UploadLandingData(CompID, res) {
    // F5B or Duration
    res.status(404).send("Not implemented");
}

// Duplicate ScoringDataUpload.aspx implementation
router.get('/scoringdataupload.aspx', (req, res) => {
    //Dim Action As String = Request.QueryString("ACTION")
    //Dim CompID As String = Request.QueryString("ID") ' compID
    //Dim FromRound As Integer = Request.QueryString("FR") ' From round
    //Dim ToRound As Integer = Request.QueryString("TR") ' To round

    /*Select Case Action
        Case "CheckForData" : CheckForData(CompID, FromRound, ToRound)
        Case "RemoveData" : RemoveData(CompID, FromRound, ToRound)
        Case "UploadScoringData" : UploadScoringData(CompID, FromRound, ToRound)
        Case "UploadCompData" : UploadCompData(CompID)
        Case "UploadTargetTimeByRound" : UploadTargetTimeByRound(CompID)
        Case "UploadF3KData" : UploadF3KData(CompID)
        Case "UploadLandingData" : UploadLandingData(CompID)    */

    const CompID = req.query.ID;
    const FromRound = req.query.FR;
    const ToRound = req.query.TR;

    switch (req.query.ACTION) {
        case "CheckForData":
            return CheckForData(CompID, FromRound, ToRound, res);
            break;
        case "RemoveData":
            return RemoveData(CompID, FromRound, ToRound, res);
            break;
        case "UploadScoringData":
            return UploadScoringData(CompID, FromRound, ToRound, res);
            break;
        case "UploadCompData":
            return UploadCompData(CompID, res);
            break;
        case "UploadTargetTimeByRound":
            return UploadTargetTimeByRound(CompID, res);
            break;
        case "UploadF3KData":
            return UploadF3KData(CompID, res);
            break;
        case "UploadLandingData":
            return UploadLandingData(CompID, res);
            break;
    }
    res.status(404).send("Not going to be implemented");
});

module.exports = router;
