browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
	cfInfo.delInfo(tabId);
});

browser.tabs.onReplaced.addListener((newId, oldId) => {
	cfInfo.delInfo(oldId);
});
