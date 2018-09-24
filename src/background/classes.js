class misc {
	static map2obj(map) {
		const obj = {};
		map.forEach((val, key) => { obj[key] = val });
		return obj;
	}
}

class Settings {
	constructor() {
		this.ignore = {};
		this.patterns = {};
		this.hpatterns = {};
		this.defaults = {
			'paEnabled': true,
			'heuristics': false,
			'lazy': false,
			'Akamai': true,
			'AmazonCloudfront': true,
			'Cloudflare': true,
			'GoogleProjectShield': true,
			'Incapsula': true,
			'KeyCDN': true,
			'Kinsta': true,
			'MyraCloud': true,
			'Sucuri': true
		};
		for (const i in this.defaults) this[i] = this.defaults[i];
	}

	get all() {
		const val = {};
		for (const i in this.defaults) {
			this.hasOwnProperty(i) ? val[i] = this[i] : val[i] = this.defaults[i];
		}
		return val;
	}

	set all(obj) {
		for (const i in obj) {
			this[i] = obj[i];
		}

		this.patterns = {};
		this.hpatterns = {};
		const reg = (h, func) => {
			if (!this.patterns[h]) this.patterns[h] = [];
			this.patterns[h].push(func);
		};

		if (this.Akamai) {
			const n = 'Akamai';
			reg('x-akamai-ssl-client-sid', () => {return n});
			reg('x-akamai-transformed', () => {return n});
			reg('x-cache-key', v => {if (v) return n});
			reg('x-check-cacheable', v => {if (v == 'yes' || v == 'no') return n});
			// reg('server', v => {if (~v.indexOf('akamai')) return n});
			reg('set-cookie', v => {if (~v.indexOf('akacd_') || ~v.indexOf('ak_bmsc')) return n});
		}
		if (this.AmazonCloudfront) {
			const n = 'AmazonCloudfront';
			reg('x-amz-cf-id', () => {return n});
			reg('x-amz-replication-status', () => {return n});
			reg('x-amz-version-id', () => {return n});
			reg('x-cache', v => {if (~v.indexOf('cloudfront')) return n});
			reg('set-cookie', v => {if (!v.indexOf('awsalb')) return n});
			reg('via', v => {if (~v.indexOf('cloudfront')) return n});
		}
		if (this.Cloudflare) {
			const n = 'Cloudflare';
			reg('cf-bgj', () => {return n});
			reg('cf-cache-status', () => {return n});
			reg('cf-polished', () => {return n});
			reg('cf-ray', () => {return n});
			reg('expect-ct', v => {if (~v.indexOf('report-uri.cloudflare.com')) return n});
			reg('server', v => {if (~v.indexOf('cloudflare')) return n});
			reg('set-cookie', v => {if (~v.indexOf('__cfduid')) return n});
		}
		if (this.GoogleProjectShield) {
			reg('server', v => {if (v == 'shield') return 'GoogleProjectShield'});
			reg('x-shield-request-id', () => {return 'GoogleProjectShield'});
		}
		if (this.Incapsula) {
			const n = 'Incapsula';
			reg('x-iinfo', () => {return n});
			reg('x-cdn', v => {if (~v.indexOf('incapsula')) return n});
			reg('set-cookie', v => {if (~v.indexOf('visid_incap_')) return n});
		}
		if (this.KeyCDN) {
			reg('server', v => {if (!v.indexOf('keycdn')) return 'KeyCDN'});
		}
		if (this.Kinsta) {
			const n = 'Kinsta';
			reg('x-cache', (v, obj) => {
				if (!obj.Kinsta) obj.Kinsta = 0;
				else return n;
			});
			reg('x-edge-location', (v, obj) => {
				if (!obj.Kinsta) obj.Kinsta = 0;
				else return n;
			});
			reg('x-kinsta-cache', () => {return n});
			reg('server', (v, obj) => {
				if (!v.indexOf('kinsta')) {
					if (obj.hasOwnProperty('Kinsta')) return n;
					else obj.Kinsta = 1;
				}
			});
		}
		if (this.MyraCloud) {
			reg('server', v => {if (~v.indexOf('myracloud')) return 'MyraCloud'});
		}
		if (this.Sucuri) {
			const n = 'Sucuri';
			reg('x-sucuri-cache', () => {return n});
			reg('x-sucuri-id', () => {return n});
			reg('server', v => {if (~v.indexOf('sucuri')) return n});
			reg('set-cookie', v => {if (~v.indexOf('sucuri-')) return n});
		}

		if (this.heuristics) {
			this.hpatterns = {
				'x-cache': 1,
				'x-cache-hits': 1,
				'x-cdn': 1,
				'x-edge-location': 1,
				'x-served-by': 1,
				'x-varnish': 1,
				'x-varnish-backend': 1,
				'x-varnish-cache': 1,
				'x-varnish-cache-hits': 1,
				'x-varnish-cacheable': 1,
				'x-varnish-host': 1
			};
		}

		tabs.togglePageActions(this.paEnabled);
	}
}

////////////////////// INFO classes //////////////////////////////

class CDNInfo {
	constructor(dom, count) {
		this.counters = new Map();
	}
	inc(url) {
		const domain = (new URL(url)).hostname;
		if (!this.counters.has(domain)) this.counters.set(domain, 1);
		else this.counters.set(domain, (this.counters.get(domain) + 1));
	}
}

class TabInfo {
	constructor(id) {
		this.badgeNum = 0;
		this.cdns = {};
		this.changed = false;
		this.docs = {};
		this.id = id;
		this.status = 0;
		this.total = 0;
	}
	set result(val) {
		if (this.status < val) {
			this.changed = true;
			return this.status = val;
		}
	}
	get result() { return this.status }
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
	getInfo(id) {
		if (this[id]) return this[id];
		else return this[id] = new TabInfo(id);
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
}
