var debugAddr = "http://" + window.location.hostname + ":" + debugPort;
var editor;
window.onload = function () {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", debugAddr + "/consoleContent", true);
	xmlHttp.onload = function (e) {
		if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
			document.getElementById("consolein").value = xmlHttp.responseText;
		}
	}
	xmlHttp.send(null);
	document.getElementById("consoleout").onkeypress = function(e) {
		var k = e.key
		if (k == "Enter") {
			e.preventDefault();
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST", debugAddr + "/consoleSend", true);
			xmlHttp.onload = function (e) {
				if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
					document.getElementById("consoleout").value = "";
				}
			}
			xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xmlHttp.send(JSON.stringify({ "msg": document.getElementById("consoleout").value }));
		}
	};
	setTimeout(getLatestConsole, 500);
	editor = ace.edit("liveedit");
	editor.setTheme("ace/theme/monokai");
	editor.session.setMode("ace/mode/html");
	editor.setValue(getRemoteHtml());
};

function getRemoteHtml() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", debugAddr + "/html", false);
	xmlHttp.send(null);
	if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
		return xmlHttp.responseText;
	}
}

function getLatestConsole() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", debugAddr + "/consoleContent", true);
	xmlHttp.onload = function (e) {
		if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
			document.getElementById("consolein").value = xmlHttp.responseText;
		}
	}
	xmlHttp.send(null);
	setTimeout(getLatestConsole, 500);
}

function diff(original, updated) {

	// Create arrays from our two node lists.
	var originalList = [].slice.call(original, 0),
		updatedList = [].slice.call(updated, 0),

		// Collection for our updated nodes
		updatedNodes = [],

		// Count to keep track of where we are looking at in the original DOM Tree
		count = 0,

		// Loop Counter
		i;

	// Go through all the nodes in our updated DOM Tree
	for (i = 0; i < updatedList.length; i++) {

		// Check for a mismatch in values
		if (updatedList[i] !== originalList[count]) {

			// Check if the value ever exists in our updated list
			if (updatedList.indexOf(originalList[count]) !== -1) {
				// The item exists somewhere in our updated list, we'll get there
				// eventually. For now just push up the additions we have until we get
				// to the node that exists in the original DOM Tree.
				updatedNodes.push(updatedList[i]);

			} else {
				// The node does not exist in our updated list, it has been deleted.
				// Need to increment our counter that we are using for original list
				// and redo the current iteration against the new position. Also, add
				// the deleted node to our list of affected nodes.
				updatedNodes.push(originalList[count]);
				count++;
				i--;
			}

		} else {
			// The value was found! Time to check the next ones.
			count++;
		}
	}

	return updatedNodes;
}

function refreshHtml() {

}