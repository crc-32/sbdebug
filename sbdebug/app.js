'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var readline = require('readline');

var app = express();
var lastCmd = null;
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post("/", function (req, res) {
	console.log(" ");
	switch (req.body.type) {
		case "Event":
			console.log("Event: " + req.body.event);
			res.sendStatus(200);
			break;
		case "ConsoleOutput":
			if (req.body.message == undefined) {
				console.log("Object Logged: (includes debug meta)");
				console.log(req.body);
			} else {
				switch (req.body.verbosity) {
					case "log":
						console.log(req.body.message);
						break;
					case "warn":
						console.warn("[WARN] " + req.body.message);
						break;
					case "info":
						console.info("[INFO] " + req.body.message);
						break;
				}
			}
			break;
		case "Error":
			console.log("Error at " + req.body.line + ":" + req.body.col + " on url '" + req.body.url + "': '" + req.body.message + "'");
			break;
		case "ConsoleReturn":
			lastCmd = null;
			console.log("Return: " + req.body.message);
			break;
		default:
			console.log("Unknown debug message:");
			console.log(req.body);
			res.sendStatus(400);
			break;
	}
	rl.prompt();
});

app.get("/cmd", function (req, res) {
	if (lastCmd == null) {
		res.send("_NOCMD");
	} else {
		res.send(lastCmd);
		lastCmd = null;
	}
});

app.listen(3000, function () {
	console.log("Started on port 3000");
	rl.setPrompt('js>');
	rl.on('line', function (line) {
		if (line.trim() != "") {
			lastCmd = line;
			rl.prompt();
		}
	});
	rl.prompt();
});