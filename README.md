# node-spotilocal

![license](https://img.shields.io/github/license/oliverfindl/node-spotilocal.svg?style=flat)
[![paypal](https://img.shields.io/badge/donate-paypal-blue.svg?colorB=0070ba&style=flat)](https://paypal.me/oliverfindl)

Simple wrapper for [Spotify](https://www.spotify.com/) app local webserver.

---

## Install

Via [npm](https://npmjs.com/) [[package](https://www.npmjs.com/package/node-spotilocal)]:
> `npm install node-spotilocal`

Via [yarn](https://yarnpkg.com/en/) [[package](https://yarnpkg.com/en/package/node-spotilocal)]:
> `yarn add node-spotilocal`

## Usage

``` javascript
// import lib
import * from "node-spotilocal";

// init lib
const spotify = new Spotilocal();

// play track
spotify.play("spotify:track:1qCQTy0fTXerET4x8VHyr9").then(console.log).catch(console.error);

// pause track
spotify.pause().then(console.log).catch(console.error);

// unpause track
spotify.unpause().then(console.log).catch(console.error);

// get current status
spotify.status().then(console.log).catch(console.error);
```

---

## License

[MIT](http://opensource.org/licenses/MIT)
