browser.webRequest.onCompleted.addListener((d) => {
	if (d.tabId === -1) return;
	let isDoc = d.type === 'main_frame';
	let info = cfInfo.getOrCreate(d.tabId);
	if (isDoc) {
		cfInfo.delInfo(d.tabId);
		info = cfInfo.getOrCreate(d.tabId);
	}
	let p_res = info.result;
	for (var i in d.responseHeaders) {
		var hname = d.responseHeaders[i].name.toLowerCase();
		if ((hname === "cf-ray") || (hname === "server" && d.responseHeaders[i].value.toLowerCase() === "cloudflare-nginx")) {
			info.domainCounter.incCount(getDomainFromURL(d.url));
			if (!info.result) {
				info.result = isDoc ? 2 : 1;
			}
			++info.badgeNum
			break;
		}
	}
	if (info.badgeNum) {
		updateBadge(d.tabId, info.result, info.badgeNum.toString());
	}
	if (p_res !== info.result) {
		if (paEnabled) {
			updateIcon(d.tabId, info.result);
		}
	}
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);