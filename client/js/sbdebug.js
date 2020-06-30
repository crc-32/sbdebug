const sbdbgCmd = {
    "eval": 0,
    "refresh": 1,
    "devCon": 2,
    "devDis": 3,
    "devLog": 4,
    "devError": 5,
    "cssEdit": 6
};

if (window.sbdserver === undefined || window.sbdserver === null) {
    alert("Please define window.sbdserver with the ws://HOST:PORT value");
}

var socket = new WebSocket(window.sbdserver);

var cssEl = document.createElement('style');
cssEl.id = 'sbdebug-customcss'
document.getElementsByTagName('HEAD')[0].appendChild(cssEl);

function sendConsole(message, verbosity) {
    socket.send(JSON.stringify({"cmd": sbdbgCmd.devLog, "data": message, "verbosity": verbosity}));
}

console.log = function (message) {
    var outStr = "";
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === "object" && arguments[i] !== null) {
            outStr += "\n" + JSON.stringify(arguments[i], null, 2) + "\n";
        } else {
            outStr += arguments[i];
            if (arguments.length != i) {
                outStr += " ";
            }
        }
    }
    sendConsole(outStr, "log");
};
console.info = function (message) {
    var outStr = "";
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === "object" && arguments[i] !== null) {
            outStr += "\n" + JSON.stringify(arguments[i], null, 2);
        } else {
            outStr += arguments[i];
            if (arguments.length != i) {
                outStr += " ";
            }
        }
    }
    sendConsole(outStr, "info");
};
console.warn = function (message) {
    var outStr = "";
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === "object" && arguments[i] !== null) {
            outStr += "\n" + JSON.stringify(arguments[i], null, 2) + "\n";
        } else {
            outStr += arguments[i];
            if (arguments.length != i) {
                outStr += " ";
            }
        }
    }
    sendConsole(outStr, "warn");
};

socket.onmessage = function(ev) {
    var cmd = JSON.parse(ev.data);
    switch (cmd["cmd"]) {
        case sbdbgCmd.eval:
            sendConsole(eval(cmd["data"]), "return");
            break;
        case sbdbgCmd.refresh:
            document.location.reload();
            break;
        case sbdbgCmd.cssEdit:
            document.getElementById('sbdebug-customcss').innerHTML = cmd["data"];
    }
};

socket.onopen = function(ev) {
    console.log("Hello from device!");
    window.onerror = function (message, url, lineNumber, colNumber, er) {
        socket.send(JSON.stringify({"cmd": sbdbgCmd.devError, "data": message, "url": url, "line": lineNumber, "col": colNumber, "obj": er}));
        return false;
    };
};