browser.storage.sync.get(settings.all).then(rs => {
	if (rs.sync) settings.all = rs;
	else browser.storage.local.get(settings.all).then(rl => {settings.all = rl});
}).catch((e) => console.log(`True-Sight: ${e}`));;
