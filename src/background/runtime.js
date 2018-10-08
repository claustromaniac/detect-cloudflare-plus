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
		return settings.all;
});
