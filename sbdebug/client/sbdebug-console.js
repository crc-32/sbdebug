host = "";
att = 0;
function poll() {
	if (host != "") {
		var Http = new XMLHttpRequest();
		const url = 'http://' + host + '/cmd';
		Http.open("GET", url);
		Http.onreadystatechange = function (e) {
			if (Http.readyState == 4 && !Http.response.includes("_NOCMD")) {
				self.postMessage({ ret: true, resp: Http.response });
				att = 0;
			}
		}
		Http.onerror = function (e) {
			att += 1;
			if (att > 3) return;
		}
		Http.send();
	}
	self.setTimeout(poll, 1500);
}

self.addEventListener('message', function (e) {
	host = e.data;
});

poll();