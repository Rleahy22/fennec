"use strict";

const router = require("koa-router")();
const views  = require('co-views');
let config   = require('./config/config')();

let activeRooms = [];
let timer;

config = JSON.stringify({
    baseUrl: config.baseUrl
});

const render = views('src/', {
    map: {
        html: 'hogan'
    }
});

module.exports = function(app, io) {
    let Socket;

    io.on('connection', function (socket) {
        console.log('connection established');
        Socket = socket;
    });

    router.get('/', function *(next) {
        yield next;
        this.body = yield render('index', {
            config: config
        });
    });

    router.get('/room/:id', function *(next) {
        yield next;

        const roomId = this.params.id;

        if (activeRooms.indexOf(roomId) < 0) {
            timer = 0;
            setInterval(() => {
                timer += 5000;
                Socket.emit('timer', {
                    time: timer
                });
            }, 500);
            activeRooms.push(roomId);
        }

        this.body = yield render('index', {
            config: config
        });

    });

    app.use(router.routes());
    app.use(router.allowedMethods());
};
