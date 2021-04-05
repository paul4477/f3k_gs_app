var express = require('express');
var api = express.Router();

const models = require('../models/');

// timesync for server synchronisation
var timesyncServer = require('timesync/server');
api.use('/timesync', timesyncServer.requestHandler);

// slotInfo provided by serial port data
const { runningSlot, eventsRouter } = require('./serial');
api.get('/slotInfo', (req, res) => {
    res.send(runningSlot);
});

api.get('/clock/:timerString', (req, res) => {
    runningSlot.update(req.params.timerString);
    res.status(200).send(runningSlot);
});


const taskScorer = require('./tasks');
api.post('/tasks/score', async (req, res) => {

    // Get round definiton in order to pass task to scorer
    //console.log("Here")
    //console.log(parseInt(req.body.round));

    const comp = await models.Competition.findById("5e555e26692f9563383002a7");

    // Database record is upper case with brackets
    let task = comp.rounds[parseInt(req.body.round) - 1]
    task = task.F3KTask.toLowerCase().replace('(', '').replace(')', '')
    //console.log(task);
    scoredResults = taskScorer.scoreTask(req.body.times, task);
    res.send(scoredResults);
});

// Temp storage and retrieval of score data between pages
api.post('/slotScore', (req, res) => {
    //console.log(req.body);
    let tempScore = new models.TempScore(req.body);

    tempScore.save();
    res.send(tempScore);
});

api.get('/slotScore/:id', async (req, res) => {
    try {
        const result = await models.TempScore.findById(req.params.id);
        res.send(result);
    }
    catch{
        res.status(404).send("result not found");
    }
});

// /api/comp/[:compid/]
// /api/comp/:compid/round/[:roundid]
// /api/comp/:compid/score/[:pilotid]
// /api/comp/:compid/round/:roundid/score/[:pilotid]

// Comps (and underneath that, rounds)
const comps = require('./comps');
api.use('/comp', comps);

const events = require('./events');
api.use('/events', eventsRouter);



module.exports = api;
