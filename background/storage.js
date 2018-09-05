browser.storage.sync.get('paEnabled').then(res => {
		paEnabled = res.paEnabled;
	})
	.catch((e) => { console.log(`Cloudflare-Detect: ${e}`); });

browser.storage.onChanged.addListener(changes => {
	paEnabled = changes.paEnabled.newValue;
	if (paEnabled) {
		cfInfo.info.forEach((val, key) => {
			updateIcon(key, val.result);
		});
	} else {
		cfInfo.info.forEach((val, key) => {
			browser.pageAction.hide(key);
		});
	}
})
