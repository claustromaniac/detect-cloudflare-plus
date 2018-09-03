browser.webRequest.onCompleted.addListener((d) => {
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
		if (!info.result) {
			info.result = isDoc ? 2 : 1;
			if (paEnabled) {
				updateIcon(d.tabId, info.result);
			}
		}
		updateBadge(d.tabId, info.result, info.badgeNum.toString());
	}
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);
