const compsRouter = require('express').Router({ mergeParams: true });
const models = require('../models/');

// Get competition list
compsRouter.get('/', async (req, res) => {

    models.Competition.find({}, "CompID CompName CompVenue", (err, docs) => {
        if (err) {
            res.status(404).send(`DB find error: ${err.message}`);
        }
        if (docs == null) {
            res.status(404).send(`No results found`);
        }
        else {
            res.send(docs);
        }
    });
});

// Get single competition
compsRouter.get('/:compID', 
    async (req, res) => {
        models.Competition.find({ CompID: req.params.compID }, "CompName CompVenue", (err, docs) => {
            if (err) {
                res.status(404).send(`DB find error: ${err.message}`);
            }
            if (docs == null) {
                res.status(404).send(`No results found`);
            }
            else {
                res.send(docs);
            }
        });
    });

// Rounds
const roundsRouter = require('./rounds');
compsRouter.use('/:compID/round', roundsRouter);

module.exports = compsRouter;