# sbdebug

Simple remote JS debugging library

## Installation

Place the sbdebug.js file from the `client/js` folder into your web app and add the following lines to html:

```html
<script>window.sbdserver = "ws://<HOST>:3000";</script>
<script type="text/javascript" src="sbdebug.js"></script>
```

Then, use `npm install` in the repository dir to install the required libraries and `node .` to launch the debug server, the UI by default is at `localhost:8080`

## Current Features

Currently, you can:

- Run javascript on the client via the built-in console
- View error messages as they arrive, complete with line and column numbers
- Recieve all console log/warn/info calls
- Live test CSS
- More to come!
