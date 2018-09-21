const filter = { urls: ["<all_urls>"] };
const callback = d => {
	'use strict';
	if (requestIDs[d.requestID]) {
		requestIDs[d.requestID].updateUI();
		delete requestIDs[d.requestID];
	}
};

browser.webRequest.onResponseStarted.addListener(d => {
	'use strict';
	if (d.tabId === -1) return;
	let isDoc = d.type === 'main_frame';
	if (isDoc) tabs.newInfo(d.tabId);
	isDoc = isDoc ? 2 : 1;
	const cObj = {}; // for complex patterns involving multiple headers
	top:
		for (const i in d.responseHeaders) {
			const n = d.responseHeaders[i].name.toLowerCase();
			if (settings.ignore[n]) continue;
			const v = d.responseHeaders[i].value.toLowerCase();
			for (const p in settings.patterns) {
				if (settings.patterns[p][n] && settings.patterns[p][n](v, cObj)) {
					tabs[d.tabId].badgeNum++
					tabs[d.tabId].result = isDoc;
					tabs[d.tabId].cdn(p).inc(d.url);
					tabs[d.tabId].cdn(p).result = isDoc;
					requestIDs[d.requestID] = tabs[d.tabId];
					break top;
				}
			}
			if (settings.hpatterns[n] /* &&	settings.hpatterns[n](v, cObj)*/ ) {
				tabs[d.tabId].badgeNum++
				tabs[d.tabId].result = isDoc;
				tabs[d.tabId].cdn('Heuristic Detection').inc(d.url);
				tabs[d.tabId].cdn('Heuristic Detection').result = isDoc;
				requestIDs[d.requestID] = tabs[d.tabId];
			}
		}
}, filter, ["responseHeaders"]);

browser.webRequest.onErrorOccurred.addListener(callback(d), filter);
browser.webRequest.onCompleted.addListener(callback(d), filter);
browser.webRequest.onBeforeRedirect.addListener(d => {
	'use strict';
	if (requestIDs[d.requestID] && !d.redirectUrl.indexOf('data://')) {
		requestIDs[d.requestID].updateUI();
		delete requestIDs[d.requestID];
	}
}, filter);
