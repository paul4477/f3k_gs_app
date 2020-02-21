const roundsRouter = require('express').Router({ mergeParams: true });
const models = require('../models/');

// Get rounds list (compID is from outer router)
roundsRouter.get('/', async (req, res) => {


    models.Competition.find({ CompID: req.params.compID }, (err, docs) => {

        if (err) {
            res.status(404).send(`DB find error: ${err.message}`);
        }
        if (docs == null || docs.length == 0) {
            res.status(404).send(`No results found`);
        }
        else {
            if (docs.length > 1) {
                res.status(404).send(`Multiple competitions found.`);
            }
            else {
                res.send(docs[0].rounds)
            }

        }
    });

});



// Get single competition
roundsRouter.get('/:roundID', async (req, res) => {

    models.Competition.find({ CompID: req.params.compID }, (err, docs) => {

        if (err) {
            res.status(404).send(`DB find error: ${err.message}`);
        }
        if (docs == null || docs.length == 0) {
            res.status(404).send(`No results found`);
        }
        else {
            if (docs.length > 1) {
                res.status(404).send(`Multiple competitions found.`);
            }
            else {

                let roundIndex = parseInt(req.params.roundID);
                if (Number.isNaN(roundIndex)) { res.status(404).send(`Bad round number`) }
                else {

                    if (roundIndex < 1 || roundIndex > docs[0].rounds.length) {
                        res.status(404).send(`Round number out of range`)
                    }
                    else {
                        res.send(docs[0].rounds[parseInt(req.params.roundID) - 1])
                    }
                }
            }

        }
    });
});


/* api.get('/competition/:id', async (req, res) => {
    const comp = await models.Competition.findById(req.params.id);
    if (!result) res.status(404).send("result not found");
    res.send()
}); */

module.exports = roundsRouter;