var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/timer', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'timer-iphone.html'))
});

router.get('/slotinfo', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'just_slot_info.html'))
});


router.get('/scoring', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'submitScores.html'))
});

router.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'settings.html'))
});

router.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'results.html'))
});


module.exports = router;
