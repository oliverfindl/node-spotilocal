# [DEPRECATED] node-spotilocal

[![npm](https://img.shields.io/npm/v/node-spotilocal.svg?style=flat)](https://www.npmjs.com/package/node-spotilocal)
[![npm](https://img.shields.io/npm/dt/node-spotilocal.svg?style=flat)](https://www.npmjs.com/package/node-spotilocal)
[![npm](https://img.shields.io/npm/l/node-spotilocal.svg?style=flat)](https://www.npmjs.com/package/node-spotilocal)
[![paypal](https://img.shields.io/badge/donate-paypal-blue.svg?colorB=0070ba&style=flat)](https://paypal.me/oliverfindl)

Simple wrapper class for [Spotify](https://www.spotify.com/) app local webserver.

---

## Install

Via [npm](https://npmjs.com/) [[package](https://www.npmjs.com/package/node-spotilocal)]:
```bash
$ npm install node-spotilocal
```

Via [yarn](https://yarnpkg.com/en/) [[package](https://yarnpkg.com/en/package/node-spotilocal)]:
```bash
$ yarn add node-spotilocal
```

## Usage

```javascript
// require lib
const Spotilocal = require("node-spotilocal");

// init lib
const spotify = new Spotilocal();

// [optional] get auth tokens from Spotify app or auth process will execute with first request
spotify._auth().then(tokens => {
	// ...
}).catch(console.error);

// play track
spotify.play("spotify:track:1qCQTy0fTXerET4x8VHyr9").then(console.log).catch(console.error);

// pause track
spotify.pause().then(console.log).catch(console.error);

// unpause track
spotify.unpause().then(console.log).catch(console.error);

// get app status on particular events (default: ["login", "logout", "play", "pause", "error", "ap"]) or after X seconds (default: 0; 0 = disabled)
spotify.status(["login", "logout", "play", "pause", "error", "ap"], 0).then(console.log).catch(console.error);

// [optional] revoke auth tokens
spotify._revoke();
```

---

## License

[MIT](http://opensource.org/licenses/MIT)
