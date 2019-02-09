'use strict';
var debugPort = 3000
var sitePort = 8080


var express = require('express');
var bodyParser = require('body-parser');
var readline = require('readline');

var app = express();
var site = express();
var lastCmd = null;
var lastHtml = null;
var consBuf = "";
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function log(message) {
	var outStr = "";
	for (var i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] === 'object' && arguments[i] !== null) {
			console.log(arguments[i]);
			consBuf += JSON.stringify(arguments[i]) + "\n";
		} else {
			outStr += arguments[i];
			if (arguments.length != i) {
				outStr += " ";
			}
		}
	}
	console.log(outStr);
	consBuf += outStr + "\n";
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
site.set('view engine', 'pug');
site.use(express.static(__dirname));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post("/", function (req, res) {
	log(" ");
	switch (req.body.type) {
		case "Event":
			log("Event: " + req.body.event);
			res.sendStatus(200);
			break;
		case "ConsoleOutput":
			if (req.body.message == undefined) {
				log("Object Logged: (includes debug meta)");
				log(req.body);
			} else {
				switch (req.body.verbosity) {
					case "log":
						log(req.body.message);
						break;
					case "warn":
						log("[WARN] " + req.body.message);
						break;
					case "info":
						log("[INFO] " + req.body.message);
						break;
				}
			}
			break;
		case "Error":
			log("Error at " + req.body.line + ":" + req.body.col + " on url '" + req.body.url + "': '" + req.body.message + "'");
			break;
		case "ConsoleReturn":
			lastCmd = null;
			log("Return: " + req.body.message);
			break;
		default:
			log("Unknown debug message:");
			log(req.body);
			res.sendStatus(400);
			break;
	}
	rl.prompt();
});

site.get("/", function (req, res) {
	var title = "SbDebug on " + req.hostname;
	res.render("index", { "title": title, "debugPort": debugPort, "sitePort": sitePort});
});

app.get("/consoleContent", function (req, res) {
	res.send(consBuf);
});

app.post("/consoleSend", function (req, res) {
	consBuf += "js>" + req.body.msg + "\n";
	console.log(req.body.msg)
	lastCmd = req.body.msg;
	res.sendStatus(200);
});

site.listen(sitePort, function () {
	log("Site started on port", sitePort);
});

app.get("/cmd", function (req, res) {
	if (lastCmd == null) {
		res.send("_NOCMD");
	} else {
		res.send(lastCmd);
		lastCmd = null;
	}
});

app.get("/html", function (req, res) {
	res.send(lastHtml);
});

app.post("/setHtml", function (req, res) {
	lastHtml = req.body.htmlMsg;
	res.sendStatus(200);
});

app.listen(debugPort, function () {
	log("Debugger started on port", debugPort);
	rl.setPrompt('js>');
	rl.on('line', function (line) {
		if (line.trim() != "") {
			lastCmd = line;
			rl.prompt();
		}
	});
	rl.prompt();
});