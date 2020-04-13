'use strict';
const debugPort = 3000;
const siteCmdPort = 3001;
const sitePort = 8080;

const express = require('express');
const WebSocket = require('ws');
var app = express();

const wssSite = new WebSocket.Server({
    port: siteCmdPort
});

const wssDevice = new WebSocket.Server({
    port: debugPort
});

let wsDevice = null;
let wsSite = null;

wssSite.on('connection', function connection(ws) {
    wsSite = ws;
    console.log("Site connected");
    ws.on('message', function incoming(message) {
      if (wsDevice !== null) {
          wsDevice.send(message);
      }
    });
    ws.on('close', function(d) {
        console.log("Site disconnected");
        wsSite = null;
    });
});

wssDevice.on('connection', function connection(ws) {
    wsDevice = ws;
    console.log("Device connected");
    if (wsSite !== null) {
        wsSite.send(JSON.stringify({"cmd": 2})); // Tell site we are connected
    }
    ws.on('message', function incoming(message) {
        console.log(message);
      if (wsSite !== null) {
          wsSite.send(message);
      }
    });
    ws.on('close', function(d) {
        wsDevice = null;
        console.log("Device disconnected");
        wsSite.send(JSON.stringify({"cmd": 3})); // Tell site we aren't connected
    });
});

app.use(express.static("client"));
app.listen(sitePort, () => console.log(`UI is at http://localhost:${sitePort}`));