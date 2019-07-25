const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// ATEM Control

const Atem = require('atem');
const ATEM = new Atem('192.168.2.15');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

// Broadcast to all
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};
let websockets = undefined;

wss.on('connection', function connection(ws) {

    websockets = ws;

    ws.on('message', function incoming(data) {
        wss.clients.forEach(function each(client) {
            try {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            } catch (e) {
            }
        });
    });

});

ATEM.on('previewBus', function (state) {
    notifyPreview(state)
});
ATEM.on('programBus', function (state) {
    notifyOnline(state)
});

ATEM.on('rawCommand', function (state) {
    if (state.name === 'AuxS') {
        const auxOutput = state.data[3];
        notifyAux(auxOutput);
    }
});

function notifyOnline(cam) {
    if (websockets) {
        websockets.send(cam + '+o');
    }
}

function notifyPreview(cam) {
    if (websockets) {
        websockets.send(cam + '+p');
    }
}

function notifyAux(cam) {
    if (websockets) {
        websockets.send(cam + '+a');
    }
}


module.exports = app;
