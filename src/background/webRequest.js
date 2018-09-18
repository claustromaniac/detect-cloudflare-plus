browser.webRequest.onResponseStarted.addListener(d => {
	'use strict';
	if (d.tabId === -1) return;
	let isDoc = d.type === 'main_frame';
	if (isDoc) tabs.newInfo(d.tabId);
	isDoc = isDoc ? 2 : 1;
	top:
		for (const i in d.responseHeaders) {
			const hn = d.responseHeaders[i].name.toLowerCase();
			if (settings.ignore[hn]) continue;
			for (const p in settings.patterns) {
				if (settings.patterns[p][hn] &&
					settings.patterns[p][hn](d.responseHeaders[i])) {
					tabs[d.tabId].badgeNum++
					tabs[d.tabId].result = isDoc;
					tabs[d.tabId].cdn(p).inc(d.url);
					tabs[d.tabId].cdn(p).result = isDoc;
					requestIDs[d.requestID] = tabs[d.tabId];
					break top;
				}
			}
			if (settings.hpatterns[hn] &&
				settings.hpatterns[hn](d.responseHeaders[i])) {
				tabs[d.tabId].badgeNum++
				tabs[d.tabId].result = isDoc;
				tabs[d.tabId].cdn('Heuristic Detection').inc(d.url);
				tabs[d.tabId].cdn('Heuristic Detection').result = isDoc;
				requestIDs[d.requestID] = tabs[d.tabId];
			}
		}
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);

browser.webRequest.onErrorOccurred.addListener(d => {
	'use strict';
	if (requestIDs[d.requestID]) {
		requestIDs[d.requestID].updateUI();
		delete requestIDs[d.requestID];
	}
}, { urls: ["<all_urls>"] });

browser.webRequest.onCompleted.addListener(d => {
	'use strict';
	if (requestIDs[d.requestID]) {
		requestIDs[d.requestID].updateUI();
		delete requestIDs[d.requestID];
	}
}, { urls: ["<all_urls>"] });

browser.webRequest.onBeforeRedirect.addListener(d => {
	'use strict';
	if (requestIDs[d.requestID]) {
		if (!d.redirectUrl.indexOf('data://')) {
			requestIDs[d.requestID].updateUI();
			delete requestIDs[d.requestID];
		}
	}
}, { urls: ["<all_urls>"] });
