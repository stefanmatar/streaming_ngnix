const express = require('express');
const router = express.Router();

const processSomething = callback => {
    setTimeout(callback, 20000);
};

router.post("/hook", (req, res) => {
    processSomething(() => {
        console.log('Client connected..');

        socket.on('auth',  (data) => {
            console.log(data);
        });
    });
    res.status(200).send('OK')
});

router.get('/projector', function(req, res) {
    res.sendFile(__dirname + '/projector.html');
});

var ATEM = require('applest-atem');

var atem2 = new ATEM();

atem2.connect('192.168.2.15');

router.get('/cam', function(req, res) {
    atem2.changeAuxInput(0,5);
    res.send('string');
});
router.get('/kran', function(req, res) {
    atem2.changeAuxInput(0,6);
    res.send('string');
});
router.get('/central', function(req, res) {
    atem2.changeAuxInput(0,7);
    res.send('string');
});
router.get('/projector', function(req, res) {
    atem2.changeAuxInput(0,8);
    res.send('string');
});

module.exports = router;
