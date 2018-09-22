browser.storage.sync.get(settings.all).then(r => {settings.all = r})
	.catch((e) => console.log(`True-Sight: ${e}`));
