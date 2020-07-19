const roundsRouter = require('express').Router({ mergeParams: true });
const models = require('../models/');

const { check, validationResult } = require('express-validator');

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
roundsRouter.get('/:roundID', [check('roundID').isInt({ gt: 0 })], async (req, res) => {

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
                res.status(404).send(`Multiple competitions found.`);
            }
            else {

                let roundIndex = req.params.roundID;
                if (roundIndex < 1 || roundIndex > docs[0].rounds.length) {
                    return res.status(422).json({ errors: [{ "value": "d", "msg": "Invalid value", "param": "roundID", "location": "params" }] });
                }
                else {
                    res.send(docs[0].rounds[roundIndex - 1])
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