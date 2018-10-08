browser.runtime.onConnect.addListener(port => {
	// triggered by popup script
	port.onMessage.addListener(tabId => {
		port.postMessage({
			badgeNum: tabs.getInfo(tabId).badgeNum,
			counters: tabs.getTabCounters(tabId),
			docs: tabs[tabId].docs,
			total: tabs[tabId].total
		});
	});
});

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	// triggered by options page script
	if (msg) sendResponse(settings.all);
});

browser.runtime.onInstalled.addListener(d => {
	if (d.reason === 'update') {
		const rx = /^0|1\.[0-3]\./;
		if (rx.test(d.previousVersion)) {
			browser.storage.sync.get(settings.all).then(rs => {
				settings.all = rs;
				browser.storage.sync.clear();
				browser.storage.local.set(settings.all);
			});
		}
	}
});
