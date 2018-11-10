class misc {
	static map2obj(map) {
		const obj = {};
		map.forEach((val, key) => { obj[key] = val });
		return obj;
	}
}

class Settings {
	constructor() {
		this.defaults = {
			'paEnabled': true,
			'heuristics': false,
			'lazy': false,
			'sync': false,

			'Akamai': true,
			'AlibabaCloud': true,
			'AmazonCloudfront': true,
			'AmazonOther': true,
			'Baidu': true,
			'BelugaCDN': true,
			'BootstrapCDN': true,
			'BunnyCDN': true,
			'CDN77': true,
			'CDNetworks': true,
			'ChinaCache': true,
			'Cloudflare': true,
			'Fastly': true,
			'fly.io': true,
			'Flywheel': true,
			'G-CDN': true,
			'GitHub': true,
			'GoCache': true,
			'GoogleCloud': true,
			'GoogleProjectShield': true,
			'Highwinds': true,
			'IPFS': true,
			'Incapsula': true,
			'Instart': true,
			'KeyCDN': true,
			'Kinsta': true,
			'Leaseweb': true,
			'MyraCloud': true,
			'Netlify': true,
			'QiHU': true,
			'Quantil': true,
			'section.io': true,
			'SingularCDN': true,
			'StackpathNetDNA': true,
			'Sucuri': true,
			'Tor2web': true,
			'TransparentCDN': true,
			'Variti': true,
			'VerizonEdgecast': true,
			'Zenedge': true
		};
		this.loading = (async () => {
			let saved = await browser.storage.local.get(this.defaults);
			saved = await browser.storage.sync.get(saved);
			this.all = saved;
			if (this.sync) await browser.storage.sync.set(saved);
			else await browser.storage.sync.clear();
			await browser.storage.local.set(saved);
			browser.storage.onChanged.addListener((changes, area) => {
				console.log(`True Sight: ${area} storage changed`);
				if (area === 'sync') {
					if (this.sync) {
						const obj = {};
						for (const i in changes) {
							if (changes[i].hasOwnProperty('newValue')) {
								obj[i] = changes[i].newValue;
							}
						}
						browser.storage.local.set(obj);
					}
				} else {
					const obj = {};
					for (const i in changes) {
						if (changes[i].hasOwnProperty('newValue')) obj[i] = changes[i].newValue;
					}
					this.all = obj;
				}
			});
			console.log('True Sight: settings loaded');
			delete this.loading;
		})();
	}

	get all() {
		return (async () => {
			if (this.loading) await this.loading;
			const val = {};
			for (const i in this.defaults) {
				val[i] = this[i];
			}
			return val;
		})();
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
			const simple = () => {return n};
			reg('edge-cache-tag', v => {if (~v.indexOf('akamai')) return n}); //not supposed to reach clients, but I've seen it.
			reg('server', v => {if (~v.indexOf('akamai')) return n});
			reg('set-cookie', v => {if (!v.indexOf('akacd_') || !v.indexOf('aka_a2')) return n});
			reg('x-akamai-edgescape', simple); //not supposed to reach clients either.
			reg('x-akamai-session-info', simple);
			reg('x-akamai-ssl-client-sid', simple);
			reg('x-akamai-transformed', simple);
			reg('x-cache-key', v => {if (v) return n});
			reg('x-check-cacheable', v => {if (v == 'yes' || v == 'no') return n});
		}
		if (this.AlibabaCloud) {
			const n = 'Alibaba Cloud';
			const simple = () => {return n};
			// reg('server', v => {if (!v.indexOf('tengine')) return n});
			reg('ali-swift-global-savetime', simple);
			reg('content-security-policy', v => {if (~v.indexOf('alibaba.com/csp')) return n});
			reg('content-security-policy-report-only', v => {if (~v.indexOf('alibaba.com/csp')) return n});
			reg('eagleeye-traceid', simple);
			reg('eagleid', simple);
			reg('vary', v => {if (~v.indexOf('ali-detector-type') || ~v.indexOf('ali-hng')) return n});
			reg('x-swift-cachetime', simple);
			reg('x-swift-savetime', simple);
		}
		if (this.AmazonCloudfront) {
			const n = 'Amazon Cloudfront';
			const simple = () => {return n};
			reg('server', v => {if (!v.indexOf('cloudfront')) return n});
			reg('via', v => {if (~v.indexOf('cloudfront')) return n});
			reg('x-amz-cf-id', simple);
			reg('x-cache', v => {if (~v.indexOf('cloudfront')) return n});
		}
		if (this.AmazonOther) {
			const n = 'Amazon (other)';
			const simple = () => {return n};
			reg('server', v => {if (!v.indexOf('amazons3')) return n});
			reg('set-cookie', v => {if (!v.indexOf('awsalb')) return n});
			reg('x-amz-delete-marker', simple);
			reg('x-amz-id-2', simple);
			reg('x-amz-replication-status', simple);
			reg('x-amz-request-id', simple);
			reg('x-amz-version-id', simple);
			reg('x-amzn-errortype', simple);
			reg('x-amzn-requestid', simple);
		}
		if (this.Baidu) {
			const n = 'Baidu';
			const simple = () => {return n};
			reg('server', v => {if (v === 'jsp3/2.0.14') return n});
			reg('set-cookie', v => {if (!v.indexOf('baiduid')) return n});
			reg('x-bce-content-crc32', simple);
			reg('x-bce-date', simple);
			reg('x-bce-debug-id', simple);
			reg('x-bce-generate-date', simple);
			reg('x-bce-request-id', simple);
			reg('x-bce-security-token', simple);
			reg('x-bce-storage-class', simple);
		}
		if (this.BelugaCDN) {
			const n = 'BelugaCDN';
			const simple = () => {return n};
			reg('server', v => {if (!v.indexOf('beluga')) return n});
			reg('x-beluga-cache-status', simple);
			reg('x-beluga-node', simple);
			reg('x-beluga-record', simple);
			reg('x-beluga-response-time', simple);
			reg('x-beluga-response-time-x', simple);
			reg('x-beluga-status', simple);
			reg('x-beluga-trace', simple);
		}
		if (this.BootstrapCDN) {
			const n = 'BootstrapCDN (Stackpath)';
			reg('x-hello-human', v => {if (~v.indexOf('bootstrap')) return n});
		}
		if (this.BunnyCDN) {
			const n = 'BunnyCDN';
			const rx = /^\d+$/;
			reg('cdn-cachedat', v => {if (v) return n});
			reg('cdn-pullzone', v => {if (rx.test(v)) return n});
			reg('server', v => {if (!v.indexOf('bunnycdn')) return n});
		}
		if (this.Cloudflare) {
			const n = 'Cloudflare';
			const simple = () => {return n};
			reg('cf-bgj', simple);
			reg('cf-cache-status', simple);
			reg('cf-polished', simple);
			reg('cf-railgun', simple);
			reg('cf-ray', simple);
			reg('expect-ct', v => {if (~v.indexOf('report-uri.cloudflare.com')) return n});
			reg('server', v => {if (~v.indexOf('cloudflare')) return n});
			reg('set-cookie', v => {if (!v.indexOf('__cfduid') || !v.indexOf('__cflb')) return n});
		}
		if (this.CDN77) {
			reg('server', v => {if (!v.indexOf('cdn77')) return 'CDN77'});
		}
		if (this.CDNetworks) {
			const n = 'CDNetworks';
			reg('x-px', () => {return n});
			reg('x-hello-human', v => {if (~v.indexOf('cdnetworks')) return n});
		}
		if (this.ChinaCache) {
			reg('powered-by-chinacache', v => {return 'ChinaCache'});
		}
		if (this.Fastly) {
			const n = 'Fastly';
			const simple = () => {return n};
			const rx = /^s\d+\.\d+,vs0,ve\d+$/;
			reg('fastly-io-info', simple);
			reg('fastly-restarts', simple);
			reg('fastly-stats', simple);
			reg('server', v => {if (v === 'artisanal bits') return n});
			reg('vary', v => {if (~v.indexOf('fastly-ssl')) return n});
			reg('x-timer', v => {if (rx.test(v)) return n});
		}
		if (this.Flywheel) {
			const n = 'Flywheel';
			const simple = () => {return n};
			reg('server', v => {if (!v.indexOf('flywheel')) return n});
			reg('x-fw-hash', simple);
			reg('x-fw-serve', simple);
			reg('x-fw-server', simple);
			reg('x-fw-static', simple);
			reg('x-fw-type', simple);
		}
		if (this['fly.io']) {
			const n = 'fly.io';
			reg('fly-request-id', () => {return n});
			reg('server', v => {if (!v.indexOf(n)) return n});
		}
		if (this['G-CDN']) {
			const n = 'G-CDN';
			const rx = /^[\w\d]+-[\w\d]+-[\w\d]+$/;
			reg('x-id', v => {if (rx.test(v)) return n});
		}
		if (this.GitHub) {
			const n = 'GitHub';
			reg('expect-ct', v => {if (~v.indexOf('github.com')) return n});
			reg('server', v => {if (v === 'github.com') return n});
			reg('set-cookie', v => {if (!v.indexOf('__gh_sess')) return n});
			reg('x-github-request-id', () => {return n});
		}
		if (this.GoCache) {
			const n = 'GoCache';
			reg('server', v => {if (v === 'gocache') return n});
			reg('x-gocache-cachestatus', () => {return n});
		}
		if (this.GoogleCloud) {
			const n = 'Google Cloud';
			const simple = () => {return n};
			reg('server', v => {if (v === 'google frontend') return n});
			reg('via', v => {if (~v.indexOf('google')) return n});
			reg('x-cloud-trace-context', simple);
			reg('x-goog-component-count', simple);
			reg('x-goog-encryption-algorithm', simple);
			reg('x-goog-encryption-key-sha256', simple);
			reg('x-goog-expiration', simple);
			reg('x-goog-generation', simple);
			reg('x-goog-hash', simple);
			reg('x-goog-metageneration', simple);
			reg('x-goog-storage-class', simple);
			reg('x-goog-stored-content-encoding', simple);
			reg('x-goog-stored-content-length', simple);
			reg('x-guploader-uploadid', simple);
		}
		if (this.GoogleProjectShield) {
			const n = 'Google Project Shield';
			reg('server', v => {if (v === 'shield') return n});
			reg('x-shield-request-id', () => {return n});
		}
		if (this.Highwinds) {
			reg('x-hw', () => {return 'Highwinds (Stackpath)'});
		}
		if (this.Incapsula) {
			const n = 'Incapsula';
			reg('set-cookie', v => {
				if (!v.indexOf('visid_incap_') || !v.indexOf('incap_ses_')) return n;
			});
			reg('x-cdn', v => {if (~v.indexOf('incapsula')) return n});
			reg('x-iinfo', () => {return n});
		}
		if (this.Instart) {
			const simple = () => {return 'Instart Logic'};
			reg('x-instart-cache-id', simple);
			reg('x-instart-ip-classification', simple);
			reg('x-instart-ip-score', simple);
			reg('x-instart-network-lists', simple);
			reg('x-instart-request-id', simple);
			reg('x-instart-streaming', simple);
		}
		if (this.IPFS) {
			const simple = () => {return 'IPFS'};
			reg('x-ipfs-path', simple);
			reg('x-ipfs-pop', simple);
		}
		if (this.KeyCDN) {
			const n = 'KeyCDN';
			reg('server', v => {if (!v.indexOf('keycdn')) return n});
			reg('server', (v, obj) => {
				if (!v.indexOf('kinsta')) {
					if (obj[n]) return n;
					obj.kinsta = true;
				}
			});
			reg('x-cache', (v, obj) => {
				if (obj.kinsta) return n;
				obj[n] = true;
			});
			reg('x-edge-location', (v, obj) => {
				if (obj.kinsta) return n;
				obj[n] = true;
			});
			reg('x-kinsta-cache', (v, obj) => {
				if (obj[n]) return n;
				obj.kinsta = true;
			});
		}
		if (this.Kinsta) {
			const n = 'Kinsta';
			reg('server', v => { if (!v.indexOf('kinsta')) return n});
			reg('x-kinsta-cache', () => {return n});
		}
		if (this.Leaseweb) {
			const n = 'Leaseweb';
			const simple = () => {return n};
			const rx = /^web\d+/;
			reg('server', v => {if (!v.indexOf('leasewebcdn')) return n});
			reg('lswcdn-country-code', simple);
			reg('x-served-by', v => {if (rx.test(v)) return n});
		}
		if (this.MyraCloud) {
			reg('server', v => {if (~v.indexOf('myracloud')) return 'MyraCloud'});
		}
		if (this.Netlify) {
			reg('server', v => {if (!v.indexOf('netlify')) return 'Netlify'});
			reg('x-nf-request-id', () => { return 'Netlify'});
		}
		if (this.Quantil) {
			const n = 'Quantil';
			const rx = /^\d\.\d\s+[^:]+:\d+\s+\(cdn cache server v\d\.\d\)/;
			reg('server', v => {if (!v.indexOf('cdn cache server v')) return n});
			reg('x-via', v => {if (rx.test(v)) return n});
		}
		if (this.QiHU) {
			const simple = () => {return 'QiHU'};
			reg('x-qhcdn', simple);
			reg('x-qstatic-hit', simple);
		}
		if (this['section.io']) {
			reg('section-io-id', () => {return 'section.io'});
		}
		if (this.SingularCDN) {
			reg('server', v => {if (!v.indexOf('singularcdn')) return 'SingularCDN'});
		}
		if (this.StackpathNetDNA) {
			reg('server', v => {if (!v.indexOf('netdna')) return 'NetDNA (Stackpath)'});
		}
		if (this.Sucuri) {
			const n = 'Sucuri';
			const simple = () => {return n};
			reg('server', v => {if (~v.indexOf('sucuri')) return n});
			reg('set-cookie', v => {if (!v.indexOf('sucuri-')) return n});
			reg('x-sucuri-cache', simple);
			reg('x-sucuri-id', simple);
		}
		if (this.Tor2web) {
			reg('x-check-tor', () => {return 'Tor2web'});
		}
		if (this.TransparentCDN) {
			const n = 'TransparentCDN';
			const simple = () => {return n};
			reg('content-security-policy', v => {if (~v.indexOf('transparentcdn.com')) return n});
			reg('content-security-policy-report-only', v => {if (~v.indexOf('transparentcdn.com')) return n});
			reg('tp-cache', simple);
			reg('tp-l2-cache', simple);
		}
		if (this.Varity) {
			reg('x-variti-ccr', () => {return 'Varity'});
		}
		if (this.VerizonEdgecast) {
			const rx = /^ec[sd] \([^\/]+\/[^\/]+\)/;
			reg('server', v => {if (rx.test(v)) return 'Edgecast (Verizon)'});
			reg('x-human', v => {if (~v.indexOf('verizon')) return n});
		}
		if (this.Zenedge) {
			const n = 'Zenedge';
			const simple = () => {return n};
			reg('server', v => {if (v === 'zenedge') return n});
			reg('x-cdn', v => {if (v === 'served-by-zenedge') return n});
			reg('x-zen-fury', simple);
		}

		if (this.heuristics) {
			const simple = () => {return true};
			this.hpatterns = {
				'age': simple,
				'cache': simple,
				'cache-control': v => {
						return (
							~v.indexOf('s-maxage') || ~v.indexOf('proxy-revalidate')
						);
					},
				'cache-tag': simple,
				'cdn-cache': simple,
				'cdn-cache-hit': simple,
				'cdn-cachedat': simple,
				'cdn-node': simple,
				'cdn-pullzone': simple,
				'cdn-requestid': simple,
				'cdn-uid': simple,
				'edge-control': simple,
				'source-age': simple,
				'via': simple,
				'x-age': simple,
				'x-backend': simple,
				'x-cache': simple,
				'x-cache-age': simple,
				'x-cache-enabled': simple,
				'x-cache-hit': simple,
				'x-cache-hits': simple,
				'x-cache-lookup': simple,
				'x-cache-main': simple,
				'x-cache-node': simple,
				'x-cache-status': simple,
				'x-cacheable': simple,
				'x-cached': simple,
				'x-cached-by': simple,
				'x-cached-since': simple,
				'x-cached-until': simple,
				'x-cacheserver': simple,
				'x-cdn': simple,
				'x-datacenter': simple,
				'x-device': simple,
				'x-edge-cache': simple,
				'x-edge-cache-key': simple,
				'x-edge-ip': simple,
				'x-edge-location': simple,
				'x-geo-city': simple,
				'x-geo-country': simple,
				'x-geo-ip': simple,
				'x-geo-ipaddr': simple,
				'x-geo-lat': simple,
				'x-geo-lon': simple,
				'x-hits': simple,
				'x-proxy-bypass': simple,
				'x-proxy-cache': simple,
				'x-served-by': simple,
				'x-served-from': simple,
				'x-storage': simple,
				'x-varnish': simple,
				'x-varnish-backend': simple,
				'x-varnish-cache': simple,
				'x-varnish-cache-control': simple,
				'x-varnish-cache-hits': simple,
				'x-varnish-cacheable': simple,
				'x-varnish-hits': simple,
				'x-varnish-host': simple,
				'x-varnish-seen-by': simple,
				'x-via': simple
			};
		}

		tabs.togglePageActions(this.paEnabled);
	}
}

////////////////////// INFO classes //////////////////////////////

class CDNInfo {
	constructor() {
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
		this.hmatch = 0;
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
			if (Object.keys(this.cdns).length > 1 + this.hmatch) this.result = 3;
		}
		return this.cdns[str];
	}
	updatePageAction() {
		if (!settings.paEnabled) return;
		browser.pageAction.show(this.id);
		browser.pageAction.setTitle({
			tabId: this.id,
			title: iconData[this.result].desc
		});
		browser.pageAction.setIcon({
			tabId: this.id,
			path: iconData[this.result].path
		});
	}
	updateUI() {
		if (this.changed) {
			this.changed = false;
			this.updatePageAction();
			browser.browserAction.setBadgeBackgroundColor({
				color: iconData[this.result].color,
				tabId: this.id
			});
			browser.browserAction.setTitle({
				tabId: this.id,
				title: iconData[this.result].desc
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
		if (!this[id]) this[id] = new TabInfo(id);
		return this[id];
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
