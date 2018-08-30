const iconColorAndDesc = [
	false,
	{ color: "orange", desc: "External resources on this page use Cloudflare." },
	{ color: "red",    desc: "This page uses Cloudflare!" }
];

function Counter() {
	this.counts = new Map();
	this.setCount = function(key,val) {
		this.counts.set(key, val);
	};
	this.getCount = function(key) {
		if (!this.counts.has(key)) { return 0; }
		else { return this.counts.get(key); }
	};
	this.incCount = function(key) {
		if (!this.counts.has(key)) { this.counts.set(key,1); }
		else { this.counts.set(key, this.counts.get(key)+1); }
	};
	this.delCount = function(key) {
		this.counts.delete(key);
	};
}

function mapToObject( map ) {
	obj = {};
	map.forEach( function(val,key) { obj[key]=val; } );
	return obj;
}

function CFInfo() {
	this.domainCounter = new Counter();
	this.result = 0;
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

function getDomainFromURL( urltxt ) {
	try {
		var url = new URL(urltxt);
		return url.hostname;
	} catch(err) {
		return null;
	}
}

function updateStatus( tabId ) {
	var info = cfInfo.getInfo(tabId);
	if (info) {
		if (info.result >= 2) return; // no need for further updates
		var counts = info.domainCounter.counts;
		if (counts.size) {
			browser.tabs.get(tabId).then( function(tab) {
				var domain = getDomainFromURL(tab.url);
				if (counts.has(domain)) {
					info.result = 2;
					updateIcon( tabId, 2 );
				} else {
					info.result = 1;
					updateIcon( tabId, 1 );
				}})
				.catch( onError );
				return
		}
	}
	updateIcon( tabId, 0 );
}

function updateIcon( tabId, result ) {
	var cd = iconColorAndDesc[result];
	if (!cd) {
		browser.pageAction.hide(tabId);
		return
	}
	browser.pageAction.show(tabId);
	browser.pageAction.setTitle({
		tabId: tabId,
		title: cd.desc
	});
	browser.pageAction.setIcon({
		tabId: tabId,
		path: {
			16: `icons/cf-${cd.color}-16.png` ,
			32: `icons/cf-${cd.color}-32.png` ,
			64: `icons/cf-${cd.color}-64.png`
		}
	});
}

function cfdetect( details ) {
	var headers = details.responseHeaders;
	var cf = false;
	for (var i=0; i<headers.length; i++) {
		var h = headers[i];
		var hname = h.name.toLowerCase();
		if ((hname === "cf-ray") ||
			(hname === "server" && h.value === "cloudflare-nginx")) {
			cf = true;
			break;
		}
	}
	var tabId = details.tabId;
	if (tabId == -1) return;
	var info = cfInfo.getOrCreate(tabId);
	if (cf) {
		var ctr = info.domainCounter;
		var domain = getDomainFromURL( details.url );
		ctr.incCount(domain);
	}
	updateStatus(tabId);
}

function handleBeforeNavigate( details ) {
	if (details.frameId == 0) {
		cfInfo.delInfo( details.tabId );
		updateStatus( details.tabId );
	}
}

function handleTabUpdate( tabId, changeInfo, tabInfo ) {
	if ("url" in changeInfo) {
		updateStatus( tabId );
	}
}

function handleTabClose( tabId, removeInfo ) {
	cfInfo.delInfo(tabId);
}

function handleTabReplace( newId, oldId ) {
	cfInfo.delInfo(oldId);
}

// triggered by popup script
function handleConnect(port) {
	port.onMessage.addListener( function(tabId) {
		var info = cfInfo.getInfo(tabId);
		var msg;
		if (info) {
			msg = {
				result: info.result,
				counts: mapToObject(info.domainCounter.counts)
			};
		} else {
			msg = null;
		}
		port.postMessage(msg);
	});
}

browser.webRequest.onResponseStarted.addListener(
	cfdetect,
	{ urls: [ "<all_urls>" ] },
	[ "responseHeaders" ]
);

browser.webNavigation.onBeforeNavigate.addListener( handleBeforeNavigate );

browser.tabs.onUpdated.addListener( handleTabUpdate );
browser.tabs.onRemoved.addListener( handleTabClose );
browser.tabs.onReplaced.addListener( handleTabReplace );

browser.runtime.onConnect.addListener( handleConnect );

// vim: set expandtab ts=4 sw=4 :
