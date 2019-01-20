class Debug {
	constructor(host, enableConsole) {
		this.host = host;
		this.failed = false;
		window.debug = this;
		this.send({ type: "Event", event: "onAttach" }, function (resp, status) { if (status != "success") { alert("Could not attach!") } });
		if (enableConsole) {

			console.log = function (message) {
				window.debug.send({ type: "ConsoleOutput", verbosity: "log", message: message });
			}
			console.info = function (message) {
				window.debug.send({ type: "ConsoleOutput", verbosity: "info", message: message });
			}
			console.warn = function (message) {
				window.debug.send({ type: "ConsoleOutput", verbosity: "warn", message: message });
			}

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
				window.debug.send({ type: "Error", message: message, url: url, line: lineNumber, col: colNumber, obj: er});
			return false;
		};
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