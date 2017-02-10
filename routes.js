"use strict";

const router = require("koa-router")();
const views  = require('co-views');
let config   = require('./config/config')();

config = JSON.stringify({
    baseUrl: config.baseUrl
});

const render = views('views/', {
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

    app.use(router.routes());
    app.use(router.allowedMethods());
};
