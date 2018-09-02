function mapToObject(map) {
	obj = {};
	map.forEach((val, key) => { obj[key] = val; });
	return obj;
}

function getDomainFromURL(urltxt) {
	try {
		let url = new URL(urltxt);
		return url.hostname;
	} catch (err) {
		return null;
	}
}

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

function CFInfo() {
	this.domainCounter = new Counter();
	this.result = 0;
	this.badgeNum = 0;
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

function updateIcon(tabId, result) {
	if (!result) {
		browser.pageAction.hide(tabId);
		return;
	}
	browser.pageAction.show(tabId);
	browser.pageAction.setTitle({
		tabId: tabId,
		title: iconColorAndDesc[result].desc
	});
	browser.pageAction.setIcon({
		tabId: tabId,
		path: {
			16: `icons/cf-${iconColorAndDesc[result].color}-16.png`,
			32: `icons/cf-${iconColorAndDesc[result].color}-32.png`,
			64: `icons/cf-${iconColorAndDesc[result].color}-64.png`
		}
	});
}

function updateBadge(tabId, result, badgeNum) {
	browser.browserAction.setBadgeBackgroundColor({
		color: iconColorAndDesc[result].color,
		tabId: tabId
	});
	browser.browserAction.setBadgeText({
		text: badgeNum,
		tabId: tabId
	});
	browser.browserAction.setTitle({
		tabId: tabId,
		title: iconColorAndDesc[result].desc
	});
}
