const scoresRouter = require('express').Router({ mergeParams: true });
const models = require('../models/');

const { check, validationResult } = require('express-validator');

// Get scores list (compID is from outer router)
scoresRouter.get('/', async (req, res) => {
    //console.log(!req.params.roundID);
    if (!req.params.roundID) {
        models.Score.find({ CompID: req.params.compID }, (err, docs) => {
            if (err) {
                res.status(404).send(`DB find error: ${err.message}`);
            }
            if (docs == null || docs.length == 0) {
                res.status(404).send(`No results found`);
            }
            else {
                res.send(docs)
            }
        });
    }
    else {
        models.Score.find({ CompID: req.params.compID, RoundNo: req.params.roundID }, (err, docs) => {
            if (err) {
                res.status(404).send(`DB find error: ${err.message}`);
            }
            if (docs == null || docs.length == 0) {
                res.status(404).send(`No results found`);
            }
            else {
                res.send(docs)
            }
        });
    }
});

const taskScorer = require('./tasks');
// Filter raw scores based on task (compID and roundid is from outer router)
scoresRouter.post('/', [check('roundID').isInt({ gt: 0 })], async (req, res) => {

    models.Competition.find({ CompID: req.params.compID }, (err, docs) => {
        const validationErrors = validationResult(req)
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({ errors: validationErrors.array() })
        }
        if (err) {
            res.status(404).send(`DB find error: ${err.message}`);
        }
        if (docs == null || docs.length == 0) {
            res.status(404).send(`No results found`);
        }
        else {
            if (docs.length > 1) {
                res.status(409).send(`Multiple competitions found.`);
            }
            else {
                let roundIndex = req.params.roundID;
                if (roundIndex < 1 || roundIndex > docs[0].rounds.length) {
                    return res.status(422).json({ errors: [{ "value": roundIndex, "msg": "Invalid value", "param": "roundID", "location": "params" }] });
                }
                else {
                    let task = docs[0].rounds[roundIndex - 1].F3KTask.toLowerCase().replace('(', '').replace(')', '')
                    console.log(req.params.compID, req.params.roundID, req.body, task)
                    scoredResults = taskScorer.scoreTask(req.body, task);
                    res.send(scoredResults);
                }
            }
        }
    })
})        

// Get single score
scoresRouter.get('/:pilotID', [check('pilotID').isInt({ gt: 0 })], async (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        return res.status(422).json({ errors: validationErrors.array() })
    }

    if (!req.params.roundID) {
        models.Score.find({ CompID: req.params.compID, PilotNo: req.params.pilotID }, (err, docs) => {
            if (err) {
                res.status(404).send(`DB find error: ${err.message}`);
            }
            if (docs == null || docs.length == 0) {
                res.status(404).send(`No results found`);
            }
            else {
                res.send(docs)
            }
        });
    }
    else {
        models.Score.find({ CompID: req.params.compID, RoundNo: req.params.roundID, PilotNo: req.params.pilotID }, (err, docs) => {
            if (err) {
                res.status(404).send(`DB find error: ${err.message}`);
            }
            if (docs == null || docs.length == 0) {
                res.status(404).send(`No results found`);
            }
            else {
                if (docs.length > 1) {
                    res.status(404).send(`Multiple scores found.`);
                }
                else {
                    res.send(docs)
                }
            }
        });
    }
});

// Update single score
scoresRouter.put('/:pilotID', [check('pilotID').isInt({ gt: 0 })], async (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        return res.status(422).json({ errors: validationErrors.array() })
    }

    console.log(req.body)
    // { times: [30, 45, 60], penalty: 100 }
    let scoreUpdate = {};
    for (i = 0; i < req.body.times.length; i += 1) {
        scoreUpdate['Data' + (i + 1)] = req.body.times[i]
    }
    scoreUpdate.Updated = true
    scoreUpdate.Downloaded = false
    scoreUpdate.Penalty = req.body.penalty

    // Transform array of ordered scores to Data1, Data2 etc

    models.Score.findOneAndUpdate(
        { CompID: req.params.compID, RoundNo: req.params.roundID, PilotNo: req.params.pilotID },
        scoreUpdate, // Updated Data1...7 values etc
        { new: true }, // Get updated doc back
        (err, updatedScore) => {
            if (err) {
                res.json({
                    data: scoreUpdate,
                    success: false,
                    msg: 'Failed to update score'
                })
            } else {
                res.json({ updatedScore, success: true, msg: 'Score updated' })
            }
        }
    )


});

module.exports = scoresRouter;