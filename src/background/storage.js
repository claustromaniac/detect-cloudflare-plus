settings.storage.get(settings.all).then(r => {settings.all = r})
	.catch((e) => console.log(`True-Sight: ${e}`));

browser.storage.onChanged.addListener((changes, area) => {
	const obj = {};
	for (const i in changes) {
		if (changes[i].hasOwnProperty('newValue')) obj[i] = changes[i].newValue;
	}
	settings.all = obj;
});
