browser.storage.sync.get(settings.all).then(r => {
		'use strict';
		settings.all = r;
		settings.init();
		browser.storage.sync.set(settings.all).then(() => {
			browser.storage.onChanged.addListener(changes => {
				settings.update(changes);
				settings.init();
			});
		});
	})
	.catch((e) => { console.log(`True-Sight: ${e}`); });
