const cb = d => {
	'use strict';
	if (d.tabId === -1) return;
	let isDoc = d.type === 'main_frame';
	if (isDoc) {
		if (requestIDs[d.requestId]) delete requestIDs[d.requestId];
		else delete tabs[d.tabId];
		if (d.redirectUrl && d.redirectUrl.indexOf('data://')) requestIDs[d.requestId] = 1;
	}
	tabs.getInfo(d.tabId).total++;
	const result = isDoc ? 2 : 1;
	const cObj = {}; // for complex patterns involving multiple headers
	const matched = {};
	top:
		for (const i in d.responseHeaders) {
			const n = d.responseHeaders[i].name.toLowerCase();
			if (settings.patterns[n]) {
				const v = d.responseHeaders[i].value.toLowerCase();
				for (const func of settings.patterns[n]) {
					const match = func(v, cObj);
					if (match && !matched[match]) {
						matched[match] = 1;
						if (isDoc) {
							tabs[d.tabId].docs[(new URL(d.url)).hostname] = requestIDs[d.requestId] ? 2 : 1;
						}
						tabs[d.tabId].cdn(match).inc(d.url);
						tabs[d.tabId].result = result;
						if (settings.lazy) break top;
					}
				}
			}
			if (settings.hpatterns[n] && !matched['heuristics']) {
				matched['heuristics'] = 1
				if (isDoc) {
					tabs[d.tabId].docs[(new URL(d.url)).hostname] = requestIDs[d.requestId] ? 2 : 1;
				}
				tabs[d.tabId].cdn('Heuristic Detection').inc(d.url);
				tabs[d.tabId].result = result;
			}
		}
	if (Object.keys(matched).length) {
		tabs[d.tabId].badgeNum++;
		if (!requestIDs[d.requestId]) tabs[d.tabId].updateUI();
	}
};

browser.webRequest.onErrorOccurred.addListener(d => {
	if (requestIDs[d.requestId]) delete requestIDs[d.requestId];
}, filter);
browser.webRequest.onCompleted.addListener(cb, filter, extraInfo);
browser.webRequest.onBeforeRedirect.addListener(cb, filter, extraInfo);
