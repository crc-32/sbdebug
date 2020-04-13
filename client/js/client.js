const sbdbgCmd = {
    "eval": 0,
    "refresh": 1,
    "devCon": 2,
    "devDis": 3,
    "devLog": 4,
    "devError": 5
};
var socket = null;

$(function() {
    socket = new WebSocket('ws://localhost:3001');
    socket.onmessage = function(ev) {
        const cmd = JSON.parse(ev.data);
        switch (cmd["cmd"]) {
            case sbdbgCmd.devCon:
                $('#conn-status').html("<span class=\"text-success\">Connected</span>");
                break;
            case sbdbgCmd.devDis:
                $('#conn-status').html("<span class=\"text-danger\">Disconnected</span>");
                break;
            case sbdbgCmd.devLog:
                $('#console-table').append(`<tr><th scope=\"row\">${cmd["verbosity"]}</th><td>${cmd["data"]}</td></tr>`);
                break;
            case sbdbgCmd.devError:
                $('#console-table').append(`<tr><th scope=\"row\">error</th><td>${cmd["url"]}:${cmd["line"]}:${cmd["col"]}: ${cmd["data"]}</td></tr>`);
                console.log(cmd["obj"]);
       }
   };

   $('#eval-submit').click(function(e) {
       e.preventDefault();
       const evt = $('#eval-text').val();
       $('#console-table').append(`<tr><th scope=\"row\">eval</th><td>${evt}</td></tr>`);
       socket.send(JSON.stringify({"cmd": sbdbgCmd.eval, "data": evt})); 
   });
});