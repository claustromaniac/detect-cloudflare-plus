browser.runtime.onConnect.addListener(port => {
	// triggered by popup script
	port.onMessage.addListener(tabId => {
		port.postMessage({
			results: tabs.getTabResults(tabId),
			counters: tabs.getTabCounters(tabId)
		});
	});
});
