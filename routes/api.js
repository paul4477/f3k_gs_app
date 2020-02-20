var express = require('express');
var router = express.Router();

const models = require('../models/');

// timesync for server synchronisation
var timesyncServer = require('timesync/server');
router.use('/timesync', timesyncServer.requestHandler);

// slotInfo provided by serial port data
const serialSlot = require('./serial');
router.get('/slotInfo', (req, res) => {
    res.send(serialSlot);
});

router.get('/clock/:timerString', (req, res) => {
    serialSlot.update(req.params.timerString);
});


const taskScorer = require('./tasks');
router.post('/tasks/score', async (req, res) => {
    
    
    // Get round definiton in order to pass task to scorer
    //console.log("Here")
    //console.log(parseInt(req.body.round));
    
    const comp = await models.Competition.findById("5e4e58443e8f260a046f8f99");
    
    // Database record is upper case with brackets
    let task = comp.rounds[parseInt(req.body.round)-1]
    task = task.F3KTask.toLowerCase().replace('(', '').replace(')', '')
    //console.log(task);
    scoredResults = taskScorer.scoreTask(req.body.times, task);
    res.send(scoredResults);
});

// Temp storage and retrieval of score data between pages
router.post('/slotScore', (req, res) => {
    //console.log(req.body);
    let tempScore = new models.TempScore(req.body);
    
    tempScore.save();
    res.send(tempScore);
});

router.get('/slotScore/:id', async (req, res) => {
    const result = await models.TempScore.findById(req.params.id);
    //const result = recordedScores.find(r => r.id === parseInt(req.params.id));
    
    if (!result) res.status(404).send("result not found");

    res.send(result);
});

module.exports = router;
