const iconColorAndDesc = [
	{ color: "orange", desc: "External resources on this page use Cloudflare." },
	{ color: "red", desc: "This page uses Cloudflare!" }
];

function Counter() {
	this.counts = new Map();
	this.setCount = function(key, val) {
		this.counts.set(key, val);
	};
	this.getCount = function(key) {
		return !this.counts.has(key) ? 0 : this.counts.get(key);
	};
	this.incCount = function(key) {
		!this.counts.has(key) ? this.counts.set(key, 1) : this.counts.set(key, this.counts.get(key) + 1);
	};
	this.delCount = function(key) {
		this.counts.delete(key);
	};
}

function mapToObject(map) {
	obj = {};
	map.forEach((val, key) => { obj[key] = val; });
	return obj;
}

function CFInfo() {
	this.domainCounter = new Counter();
	this.result = null;
	// maybe more in the future
}

function CFInfoByTab() {
	this.info = new Map();
	this.getInfo = function(id) {
		return this.info.get(id);
	}
	this.getOrCreate = function(id) {
		if (!this.info.has(id)) { this.info.set(id, new CFInfo()); }
		return this.info.get(id);
	};
	this.delInfo = function(id) {
		this.info.delete(id);
	};
}

var cfInfo = new CFInfoByTab();

function onError(e) {
	console.log(`CF-Detect-Background: ${e}`);
}

function getDomainFromURL(urltxt) {
	try {
		let url = new URL(urltxt);
		return url.hostname;
	} catch (err) {
		return null;
	}
}

function updateStatus(tabId) {
	let info = cfInfo.getInfo(tabId);
	if (info) {
		if (info.result >= 1) return; // no need for further updates
		if (info.domainCounter.counts.size) {
			browser.tabs.get(tabId).then((tab) => {
					if (info.domainCounter.counts.has(getDomainFromURL(tab.url))) {
						info.result = 1;
						updateIcon(tabId, 1);
					} else if (info.result !== 0) {
						info.result = 0;
						updateIcon(tabId, 0);
					}
				})
				.catch(onError);
			return
		}
	}
	browser.pageAction.hide(tabId);
}

function updateIcon(tabId, result) {
	let cd = iconColorAndDesc[result];
	browser.pageAction.show(tabId);
	browser.pageAction.setTitle({
		tabId: tabId,
		title: cd.desc
	});
	browser.pageAction.setIcon({
		tabId: tabId,
		path: {
			16: `icons/cf-${cd.color}-16.png`,
			32: `icons/cf-${cd.color}-32.png`,
			64: `icons/cf-${cd.color}-64.png`
		}
	});
}

browser.webRequest.onCompleted.addListener((d) => {
	if (d.tabId === -1) return;
	if (d.type === 'main_frame' && cfInfo.getInfo(d.tabId)) {
		cfInfo.delInfo(d.tabId);
	}
	let info = cfInfo.getOrCreate(d.tabId);
	for (var i in d.responseHeaders) {
		var hname = d.responseHeaders[i].name.toLowerCase();
		if ((hname === "cf-ray") || (hname === "server" && d.responseHeaders[i].value.toLowerCase() === "cloudflare-nginx")) {
			info.domainCounter.incCount(getDomainFromURL(d.url));
			break;
		}
	}
	updateStatus(d.tabId);
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
	cfInfo.delInfo(tabId);
});

browser.tabs.onReplaced.addListener((newId, oldId) => {
	cfInfo.delInfo(oldId);
});

browser.runtime.onConnect.addListener((port) => {
	// triggered by popup script
	port.onMessage.addListener((tabId) => {
		let info = cfInfo.getInfo(tabId);
		let msg = null;
		if (info) {
			msg = {
				result: info.result,
				counts: mapToObject(info.domainCounter.counts)
			};
		}
		port.postMessage(msg);
	});
});
