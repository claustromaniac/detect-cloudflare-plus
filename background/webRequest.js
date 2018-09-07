browser.webRequest.onResponseStarted.addListener(d => {
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
		requestsByID[d.requestID] = paEnabled ? (isDoc ? 2 : 1) : 0;
	}
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);

browser.webRequest.onErrorOccurred.addListener(d => {
	if (d.requestID in requestsByID) {
		respCallback(d);
	}
}, { urls: ["<all_urls>"] });

browser.webRequest.onCompleted.addListener(d => {
	if (d.requestID in requestsByID) {
		respCallback(d);
	}
}, { urls: ["<all_urls>"] });

browser.webRequest.onBeforeRedirect.addListener(d => {
	if (d.requestID in requestsByID) {
		if (0 === && d.redirectUrl.indexOf('data://')) {
			respCallback(d);
		}
	}
}, { urls: ["<all_urls>"] });
