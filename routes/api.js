var express = require('express');
var router = express.Router();

const logger = (res, req, next) => {
    console.log(req.url);
    next();
}

// timesync for server synchronisation
var timesyncServer = require('timesync/server');
router.use('/timesync', timesyncServer.requestHandler);

// slotInfo provided by serial port data
const serialSlot = require('./serial');
router.get('/slotInfo', (req, res) => {
    res.send(serialSlot);
});

const taskScorer = require('./tasks');
router.post('/tasks/score', (req, res) => {
    scoredResults = taskScorer.scoreTask(req.body, "k");
    res.send(scoredResults);
});

// Temp storage and retrieval of score data between pages
router.post('/slotScore', (req, res) => {
    const newResult = {
        id: recordedScores.length + 1,
        result: req.body,
    }
    recordedScores.push(newResult);
    console.log("Recorded ID:", newResult["id"]);
    res.send(newResult)
});

router.get('/slotScore/:id', (req, res) => {
    const result = recordedScores.find(r => r.id === parseInt(req.params.id));
    if (!result) res.status(404).send("result not found");
    res.send(result);
});

module.exports = router;
