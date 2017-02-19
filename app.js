"use strict";

const koa        = require('koa');
const bodyParser = require('koa-body-parser');
const router     = require('./routes');
const serve      = require('koa-static');
const http       = require('http');
const https      = require('https');
const favicon    = require('koa-favicon');

const socketIO   = require('socket.io');
const config     = require('./config/config')();

let app = koa();
let server;

app.use(bodyParser());
app.use(serve(__dirname + '/'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(function *(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  console.log('%s %s - %s ms', this.method, this.url, ms);
});

if (config.environment === 'dev') {
    console.log('DEV:', config.environment);
    server = http.createServer(app.callback());
} else {
    server = https.createServer(app.callback());
}

const io = socketIO(server);

router(app, io);

server.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port %s', process.env.PORT || "3000");
});

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err, err.stack);
});
