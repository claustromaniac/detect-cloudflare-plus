const extraInfo = ["responseHeaders"];
const filter = {urls: ["<all_urls>"]};
const requestIDs = {};
const cb = d => {
	'use strict';
	if (d.tabId === -1) return;
	const isDoc = d.type === 'main_frame';
	if (isDoc) {
		if (requestIDs[d.requestId]) delete requestIDs[d.requestId];
		else delete tabs[d.tabId];
		if (d.redirectUrl && d.redirectUrl.indexOf('data://')) requestIDs[d.requestId] = 1;
	}
	if (!d.responseHeaders) return;
	tabs.getInfo(d.tabId).total++;
	let detected = false;
	const result = isDoc ? 2 : 1;
	const cObj = {}; // for complex patterns involving multiple headers
	const matched = {};
	top:
		for (const header of d.responseHeaders) {
			const n = header.name.toLowerCase();
			const v = header.value.toLowerCase();
			if (settings.patterns[n]) {
				for (const func of settings.patterns[n]) {
					const match = func(v, cObj);
					if (match && !matched[match]) {
						detected = true;
						matched[match] = true;
						if (isDoc) {
							tabs[d.tabId].docs[(new URL(d.url)).hostname] = requestIDs[d.requestId] ? 2 : 1;
						}
						tabs[d.tabId].cdn(match).inc(d.url);
						tabs[d.tabId].result = result;
						if (settings.lazy) break top;
					}
				}
			}
		}
	if (settings.heuristics && !detected) {
		for (const header of d.responseHeaders) {
			const n = header.name.toLowerCase();
			const v = header.value.toLowerCase();
			if (settings.hpatterns[n] && settings.hpatterns[n](v)) {
				detected = true;
				if (isDoc) tabs[d.tabId].docs[(new URL(d.url)).hostname] = requestIDs[d.requestId] ? 2 : 1;
				tabs[d.tabId].cdn('Heuristic detection').inc(d.url);
				tabs[d.tabId].hmatch = 1;
				tabs[d.tabId].result = result;
				break;
			}
		}
	}
	if (detected) {
		tabs[d.tabId].badgeNum++;
		if (!requestIDs[d.requestId]) tabs[d.tabId].updateUI();
	}
};

browser.webRequest.onErrorOccurred.addListener(d => {
	if (requestIDs[d.requestId]) delete requestIDs[d.requestId];
}, filter);
browser.webRequest.onCompleted.addListener(cb, filter, extraInfo);
browser.webRequest.onBeforeRedirect.addListener(cb, filter, extraInfo);
