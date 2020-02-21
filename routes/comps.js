const compsRouter = require('express').Router({ mergeParams: true });
const models = require('../models/');



// Rounds
const roundsRouter = require('./rounds');



//const models = require('../models/');

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

compsRouter.use('/:compID/round', roundsRouter);




/* api.get('/competition/:id', async (req, res) => {
    const comp = await models.Competition.findById(req.params.id);
    if (!result) res.status(404).send("result not found");
    res.send()
}); */

module.exports = compsRouter;