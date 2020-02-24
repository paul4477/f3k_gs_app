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

// Get single score
scoresRouter.put('/:pilotID', [check('pilotID').isInt({ gt: 0 })], async (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        return res.status(422).json({ errors: validationErrors.array() })
    }

    //console.log(req.body)
    //Data1 = { Data1: 50 }

    models.Score.findOneAndUpdate(
        { CompID: req.params.compID, RoundNo: req.params.roundID, PilotNo: req.params.pilotID },
        req.body, // Updated Data1...7 values
        { new: true }, // Get updated doc back
        (err, updatedScore) => {
            if (err) {
                res.json({
                    data: Data1,
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