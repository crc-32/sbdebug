# sbdebug
Simple remote JS debugging library

## Installation
Place the files in the `client` folder into your web app and add the following lines to html:
```html
<script type="text/javascript" src="sbdebug.js"></script>
<script type="text/javascript">window.debug = new Debug("<IP HERE>:3000", <CONSOLE ENABLED>);</script>
```
Replacing `<IP HERE>` with your debug server's IP and `<CONSOLE ENABLED>` with a bool depending on whether you want full console functionality or just error reporting.

Then, use `npm install` in the repository dir to install the required libraries and `node app.js` to launch the debug server

## Current Features
Currently, you can:
 - Run javascript on the client via the built-in console
 - View error messages as they arrive, complete with line and column numbers
 - Recieve all console log/warn/info calls
 - More to come!
