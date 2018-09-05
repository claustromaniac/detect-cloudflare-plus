browser.runtime.onConnect.addListener(port => {
	// triggered by popup script
	port.onMessage.addListener(tabId => {
		let info = cfInfo.getInfo(tabId);
		let msg = { result: 0 };
		if (info) {
			msg = {
				result: info.result,
				counts: mapToObject(info.domainCounter.counts)
			};
		}
		port.postMessage(msg);
	});
});
