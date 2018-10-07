browser.storage.sync.get(settings.all).then(rs => {
	if (rs.sync) settings.all = rs;
	else browser.storage.local.get(settings.all).then(rl => {settings.all = rl});
}).catch((e) => console.log(`True-Sight: ${e}`));

browser.storage.onChanged.addListener((changes, area) => {
	const obj = {};
	for (const i in changes) {
		if (changes[i].hasOwnProperty('newValue')) obj[i] = changes[i].newValue;
	}
	settings.all = obj;
}).catch((e) => console.log(`True-Sight: ${e}`));
