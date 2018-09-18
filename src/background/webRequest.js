browser.webRequest.onResponseStarted.addListener(d => {
	if (d.tabId === -1) return;
	let isDoc = d.type === 'main_frame';
	if (isDoc) {
		cfInfo.delInfo(d.tabId);
	}
	let info = cfInfo.getOrCreate(d.tabId);
	for (var i in d.responseHeaders) {
		var h = d.responseHeaders[i].name.toLowerCase();
		if (cfHeaders[h] || (h === 'server' &&
				~d.responseHeaders[i].value.toLowerCase().indexOf('cloudflare'))) {
			info.domainCounter.incCount(getDomainFromURL(d.url));
			++info.badgeNum;
			requestsByID[d.requestID] = isDoc ? 2 : 1;
			break;
		}
	}
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);

browser.webRequest.onErrorOccurred.addListener(d => {
	if (requestsByID[d.requestID]) {
		respCallback(d);
	}
}, { urls: ["<all_urls>"] });

browser.webRequest.onCompleted.addListener(d => {
	if (requestsByID[d.requestID]) {
		respCallback(d);
	}
}, { urls: ["<all_urls>"] });

browser.webRequest.onBeforeRedirect.addListener(d => {
	if (requestsByID[d.requestID]) {
		if (!d.redirectUrl.indexOf('data://')) {
			respCallback(d);
		}
	}
}, { urls: ["<all_urls>"] });
