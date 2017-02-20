"use strict";

const router = require("koa-router")();
const views  = require('co-views');
const _      = require('lodash');
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
        const match = _.find(activeRooms, {id: roomId});

        if (!match) {
            let newRoom = {
                id: roomId,
                status: {
                    time: 0,
                    songIndex: 0,
                    state: 1
                }
            };

            activeRooms.push(newRoom);

            setInterval(() => {
                newRoom.status.time += 10000;
                Socket.emit('roomStatus', newRoom);
            }, 1000);
        }

        this.body = yield render('index', {
            config: config
        });

    });

    app.use(router.routes());
    app.use(router.allowedMethods());
};
