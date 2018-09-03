browser.webRequest.onResponseStarted.addListener((d) => {
	if (d.tabId === -1) return;
	let isDoc = d.type === 'main_frame';
	if (isDoc) {
		cfInfo.delInfo(d.tabId);
	}
	let info = cfInfo.getOrCreate(d.tabId);
	let badgeNum = info.badgeNum;
	for (var i in d.responseHeaders) {
		var hname = d.responseHeaders[i].name.toLowerCase();
		if ((hname === 'cf-ray') || (hname === 'server' &&
		~d.responseHeaders[i].value.toLowerCase().indexOf('cloudflare'))) {
			info.domainCounter.incCount(getDomainFromURL(d.url));
			++info.badgeNum;
			break;
		}
	}
	if (badgeNum != info.badgeNum) {
		requestsByID[d.requestID] = 0;
		if (!info.result) {
			info.result = isDoc ? 2 : 1;
			requestsByID[d.requestID] = paEnabled ? info.result : 0;
		}
	}
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);

let respCallback = (d) => {
	if (d.requestID in requestsByID) {
		updateBadge(d.tabId);
		if (requestsByID[d.requestID]) {
			updateIcon(d.tabId, requestsByID[d.requestID]);
		}
		delete requestsByID[d.requestID];
	}
}

browser.webRequest.onErrorOccurred.addListener(
	respCallback,
	{ urls: ["<all_urls>"] }
);

browser.webRequest.onCompleted.addListener(
	respCallback,
	{ urls: ["<all_urls>"] }
);

browser.webRequest.onBeforeRedirect.addListener((d) => {
	if (d.requestID in requestsByID) {
		if (0 === d.redirectURL.indexOf('data://')){
			updateBadge(d.tabId);
			if (requestsByID[d.requestID]) {
				updateIcon(d.tabId, requestsByID[d.requestID]);
			}
			delete requestsByID[d.requestID];
		}
	}
}, { urls: ["<all_urls>"] });
