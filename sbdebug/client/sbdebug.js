class Debug {
	constructor(host, enableConsole) {
		this.host = host;
		this.failed = false;
		this.att = 0;
		window.debug = this;
		this.send({ type: "Event", event: "onAttach" }, function (resp, status) { if (status != "success") { alert("Could not attach!"); } });
		if (enableConsole) {
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
				window.debug.send({ type: "ConsoleOutput", verbosity: "log", message: outStr });
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
				window.debug.send({ type: "ConsoleOutput", verbosity: "info", message: outStr });
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
				window.debug.send({ type: "ConsoleOutput", verbosity: "warn", message: outStr });
			};

			this.worker = new Worker("js/sbdebug-console.js");
			this.worker.addEventListener('message', function (e) {
				if (e.data.ret == true) {
					var r = eval(e.data.resp);
					window.debug.send({ type: "ConsoleReturn", message: r });
				}
			});
			this.worker.postMessage(host);

		}

		window.onerror = function (message, url, lineNumber, colNumber, er) {
			window.debug.send({ type: "Error", message: message, url: url, line: lineNumber, col: colNumber, obj: er });
			return false;
		};
	}

	startHtmlSync() {
		var Http = new XMLHttpRequest();
		var url = 'http://' + this.host + '/setHtml';
		Http.open("POST", url);
		Http.onreadystatechange = function (e) {
			if (Http.readyState == 4) {
				this.att = 0;
			}
		};
		Http.onerror = function (e) {
			this.att += 1;
			if (this.att > 3) return;
		};
		Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		var content = { "htmlMsg": document.documentElement.innerHTML };
		Http.send(JSON.stringify(content));
	}

	send(msg, callback) {
		try {
			if (!window.debug.failed) {
				$.post("http://" + this.host + "/", msg, callback);
			}
		}
		catch (e) {
			window.debug.failed = true;
		}
	}
}