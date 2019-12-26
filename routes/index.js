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
    res.status(200).send()
});

router.get('/beamer', function(req, res) {
    res.sendFile(__dirname + '/projector.html');
});

router.get('/songtext', function(req, res) {
    res.sendFile(__dirname + '/songtext.html');
});

const atem = require('applest-atem');

const ATEM = new atem();

ATEM.connect('192.168.2.15');

router.post('/cam',function(req,res){
    ATEM.changeAuxInput(0, req.body.cam);
    console.log('set AUX to CAM ' + req.body.cam);
    res.status(200).end();
});

module.exports = router;
