/**
 * node-spotilocal v1.0.4 (2018-05-30)
 * Copyright 2018 Oliver Findl
 * @license MIT
 */

"use strict";

const { sampleSize } = require("lodash");
const { get } = require("axios");

const DEFAULT_OPTIONS = Object.freeze({ verbose: false });

class Spotilocal {

	constructor(options = {}) {
		this.options = Object.assign({}, DEFAULT_OPTIONS, options);
		this.ssl = false;
		this.protocol = "";
		this.hostname = "";
		this.port = 0;
		this.csrf = "";
		this.oauth = "";
	}

	_ssl() {
		// 4370 - 4379 = ssl
		// 4380 - 4389 = no ssl
		return this.ssl = parseInt(this.port) < 4380;
	}

	_protocol() {
		return this.protocol = "http" + (this._ssl() ? "s" : "");
	}

	_hostname() {
		if(this._ssl()) {
			let str = "";
			for(let i = 97; i <= 122; i++) str += String.fromCharCode(i);
			this.hostname = sampleSize(str, 10).join("") + ".spotilocal.com";
		} else this.hostname = "localhost";
		return this.hostname;
	}

	async _port(port = 0) {
		const limit = Object.freeze({
			min: 4370,
			max: 4389
		});

		port = parseInt(port);
		if(!port || port < limit.min) port = limit.min;
		else if(port > limit.max) port = limit.max;

		for(this.port = port; this.port <= limit.max; this.port++) {
			try {
				if(this.options.verbose) console.log(`Testing port: ${this.port}`);
				await this._version();
				if(this.options.verbose) console.log(`Port found: ${this.port}`);
				return this.port;
			} catch(err) {
				// throw err;
				if(this.port >= limit.max) throw new Error("Port not found! Please make sure, that Spotify app is running.");
			}
		}	
	}

	_url(path = "") {
		return `${this._protocol()}://${this._hostname()}:${this.port}${path}`;
	}

	async _json(url = "", params = {}) {
		try {
			const res = await get(url, {
				params,
				headers: {
					origin: "https://open.spotify.com"
				}
			});
			if(res.hasOwnProperty("status") && [200, 304].indexOf(res.status) > -1 && res.hasOwnProperty("data")) return res.data;
			else throw new Error("Bad response!");
		} catch(err) {
			throw err;
		}
	}

	async _version() {
		try {
			return await this._json(this._url("/service/version.json"), {
				service: "remote"
			});
		} catch(err) {
			throw err;
		}
	}

	async _open() {
		try {
			return await this._json(this._url("/remote/open.json"));
		} catch(err) {
			throw err;
		}
	}

	async _csrf() {
		try {
			const res = await this._json(this._url("/simplecsrf/token.json"));
			if(res.hasOwnProperty("token")) return this.csrf = res.token;
			else throw new Error("Missing CSRF token!");
		} catch(err) {
			throw err;
		}
	}

	async _oauth() {
		try {
			const res = await this._json("https://open.spotify.com/token");
			if(res.hasOwnProperty("t")) return this.oauth = res.t;
			else throw new Error("Missing OAuth token!");
		} catch(err) {
			throw err;
		}
	}

	async _auth() {
		if(this.csrf && this.oauth) return {
			csrf: this.csrf,
			oauth: this.oauth
		};

		try {
			return await this._port() && await this._open() && await this._csrf() && await this._oauth() && {
				csrf: this.csrf,
				oauth: this.oauth
			};
		} catch(err) {
			throw err;
		}
	}

	_revoke() {
		this.csrf = "";
		this.oauth = "";
		return;
	}

	async status(returnOn = ["login", "logout", "play", "pause", "error", "ap"], returnAfter = 0) {
		try {
			return await this._auth() && await this._json(this._url("/remote/status.json"), {
				csrf: this.csrf,
				oauth: this.oauth,
				returnon: (!Array.isArray(returnOn) ? [].push(returnOn) : returnOn).join(","),
				returnafter: !isNaN(returnAfter) ? parseInt(returnAfter) : 0
			});
		} catch(err) {
			throw err;
		}
	}

	async play(spotifyUri = "") {
		if(!/^spotify:track:[\w\d]+$/.test(spotifyUri)) throw new Error("Bad Spotify track URI!");
		try {
			return await this._auth() && await this._json(this._url("/remote/play.json"), {
				csrf: this.csrf,
				oauth: this.oauth,
				uri: spotifyUri,
				context: spotifyUri
			});
		} catch(err) {
			throw err;
		}
	}

	async pause(pause = true) {
		try {
			return await this._auth() && await this._json(this._url("/remote/pause.json"), {
				csrf: this.csrf,
				oauth: this.oauth,
				pause: pause ? true : false
			});
		} catch(err) {
			throw err;
		}
	}

	async unpause() {
		return this.pause(false);
	}

}

module.exports = Spotilocal;
