class misc {
	static map2obj(map) {
		const obj = {};
		map.forEach((val, key) => { obj[key] = val; });
		return obj;
	}
}

class Settings {
	constructor() {
		this.ignore = {
			'access-control-allow-credentials': 1,
			'access-control-allow-headers': 1,
			'access-control-allow-methods': 1,
			'access-control-allow-origin': 1,
			'access-control-expose-headers': 1,
			'access-control-max-age': 1,
			'accept-ranges': 1,
			'age': 1,
			'allow': 1,
			'alternate-protocol': 1,
			'cache-control': 1,
			'client-date': 1,
			'client-peer': 1,
			'client-response-num': 1,
			'connection': 1,
			'content-disposition': 1,
			'content-encoding': 1,
			'content-language': 1,
			'content-length': 1,
			'content-location': 1,
			'content-md5': 1,
			'content-range': 1,
			'content-security-policy': 1,
			'content-security-policy-report-only': 1,
			'content-type': 1,
			'date': 1,
			'etag': 1,
			'expires': 1,
			'http': 1,
			'keep-alive': 1,
			'last-modified': 1,
			'link': 1,
			'location': 1,
			'p3p': 1,
			'pragma': 1,
			'proxy-authenticate': 1,
			'proxy-connection': 1,
			'refresh': 1,
			'retry-after': 1,
			'server': 1,
			'set-cookie': 1,
			'status': 1,
			'strict-transport-security': 1,
			'timing-allow-origin': 1,
			'trailer': 1,
			'transfer-encoding': 1,
			'upgrade': 1,
			'vary': 1,
			'via': 1,
			'warning': 1,
			'x-content-type-options': 1,
			'x-frame-options': 1,
			'x-pingback': 1,
			'x-powered-by': 1,
			'x-robots-tag': 1,
			'x-xss-protection': 1
		};
		this.patterns = {};
		this.options = [
			'paEnabled',
			'heuristics',
			'Cloudflare',
			'Google Project Shield',
			'Incapsula',
			'KeyCDN',
			'Sucuri'
		];
		this.paEnabled = true;
		this.heuristics = false;
		this.Cloudflare = true;
		this.GoogleProjectShield = true;
		this.Incapsula = true;
		this.KeyCDN = true;
		this.Sucuri = true;
	}

	registerPattern(cdn, pattern) {
		if (!this[cdn]) return;
		this.patterns[cdn] = pattern;
	}

	init() {
		this.patterns = {};

		this.registerPattern('Cloudflare', {
				'cf-bgj': () => { return 1 },
				'cf-cache-status': () => { return 1 },
				'cf-polished': () => { return 1 },
				'cf-ray': () => { return 1 },
				'server': h => { return ~h.value.toLowerCase().indexOf('cloudflare') }
			});
		this.registerPattern('GoogleProjectShield', {
				'server': h => { return h.value.toLowerCase() === 'shield' },
				'x-shield-request-id': () => { return 1 }
			});
		this.registerPattern('Incapsula', {
				'x-iinfo': () => { return 1 },
				'x-cdn': h => { return ~h.value.toLowerCase().indexOf('incapsula') },
				'set-cookie': h => { return ~h.value.toLowerCase().indexOf('visid_incap_') }
			});
		this.registerPattern('KeyCDN', {
				'server': h => { return !h.value.toLowerCase().indexOf('keycdn') }
			});
		this.registerPattern('Sucuri', {
				'x-sucuri-cache': () => { return 1 },
				'x-sucuri-id': () => { return 1 },
				'server': h => { return ~h.value.toLowerCase().indexOf('sucuri') },
				'set-cookie': h => { return ~h.value.toLowerCase().indexOf('sucuri-') }
			});


		if (this.heuristics) {
			this.hpatterns = {
				// 'cache-control': () => { return 1 },
				// ^ for testing only
				'x-cache': () => { return 1 },
				'x-cache-hits': () => { return 1 },
				'x-served-by': () => { return 1 },
				'x-edge-location': () => { return 1 }
			};
		} else this.hpatterns = {};

		for (const cdn in this.patterns) {
			for (const h in this.patterns[cdn]) {
				delete this.ignore[h];
			}
		}
		for (const h in this.hpatterns) { delete this.ignore[h]; }
		tabs.togglePageActions(this.paEnabled);
	}

	get all() {
		const val = {};
		for (const i in this.options) {
			const opt = this.options[i];
			val[opt] = this[opt];
		}
		return val;
	}
	set all(obj) {
		for (const p in obj) {
			this[p] = obj[p];
		}
	}
	update(changes) {
		for (const i in changes) {
			changes[i].newValue ? this[i] = changes[i].newValue : delete this[i];
		}
	}
}

////////////////////// INFO classes //////////////////////////////

class CDNInfo {
	constructor(dom, count) {
		this.counters = new Map();
		this.status = 0;
	}
	inc(url) {
		const domain = (new URL(url)).hostname;
		if (!this.counters.has(domain)) this.counters.set(domain, 1);
		else this.counters.set(domain, (this.counters.get(domain) + 1));
	}
	set result(val) {
		if (this.status < val) return this.status = val;
	}
	get result() { return this.status; }
}

class TabInfo {
	constructor(id) {
		this.badgeNum = 0;
		this.cdns = {};
		this.changed = false;
		this.id = id;
		this.status = 0;
		// this.windowID = winID;
	}
	set result(val) {
		if (this.status < val) {
			this.changed = true;
			return this.status = val;
		}
	}
	get result() { return this.status; }
	cdn(str) {
		if (!this.cdns[str]) {
			this.cdns[str] = new CDNInfo();
			if (Object.keys(this.cdns).length > 1) this.result = 3;
		}
		return this.cdns[str];
	}
	updatePageAction() {
		if (!settings.paEnabled) return;
		browser.pageAction.show(this.id);
		browser.pageAction.setTitle({
			tabId: this.id,
			title: iconColorAndDesc[this.result].desc
		});
		browser.pageAction.setIcon({
			tabId: this.id,
			path: {
				16: `icons/eye-${iconColorAndDesc[this.result].color}.svg`,
				32: `icons/eye-${iconColorAndDesc[this.result].color}.svg`,
				64: `icons/eye-${iconColorAndDesc[this.result].color}.svg`
			}
		});
	}
	updateUI() {
		if (this.changed) {
			this.changed = false;
			this.updatePageAction();
			browser.browserAction.setBadgeBackgroundColor({
				color: iconColorAndDesc[this.result].color,
				tabId: this.id
			});
			browser.browserAction.setTitle({
				tabId: this.id,
				title: iconColorAndDesc[this.result].desc
			});
		}
		browser.browserAction.setBadgeText({
			text: this.badgeNum.toString(),
			tabId: this.id
		});
	}
}

class Tabs {
	newInfo(id) {
		return this[id] = new TabInfo(id);
	}
	togglePageActions(bool) {
		for (const i in this) {
			bool ? this[i].updatePageAction() : browser.pageAction.hide(+i);
		}
	}
	getTabCounters(id) {
		// get all individual counters for a given tab
		if (!this[id]) return;
		const result = {};
		for (const i in this[id].cdns) {
			result[i] = misc.map2obj(this[id].cdns[i].counters);
		}
		return result;
	}
	getTabResults(id) {
		// get all individual results for a given tab
		if (!this[id]) return;
		const result = {};
		for (const i in this[id].cdns) {
			result[i] = this[id].cdns[i].result;
		}
		return result;
	}
}
