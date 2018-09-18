browser.storage.sync.get('paEnabled').then(res => {
		paEnabled = res.paEnabled;
	})
	.catch((e) => { console.log(`Detect-Cloudflare-Plus: ${e}`); });

browser.storage.onChanged.addListener(changes => {
	paEnabled = changes.paEnabled.newValue;
	if (paEnabled) {
		cfInfo.info.forEach((val, key) => {
			updatePageAction(key, val.result);
		});
	} else {
		cfInfo.info.forEach((val, key) => {
			browser.pageAction.hide(key);
		});
	}
});
