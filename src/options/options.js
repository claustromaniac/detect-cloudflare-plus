document.addEventListener('DOMContentLoaded', () => {
	'use strict';
	browser.runtime.sendMessage(true).then(settings => {
		const options = Object.keys(settings);
		for (const i of options) document.getElementById(i).checked = settings[i];
		document.querySelector("form").addEventListener("submit", e => {
			'use strict';
			const obj = {};
			for (const i of options) obj[i] = document.getElementById(i).checked;
			if (obj.sync) {
				browser.storage.local.clear();
				browser.storage.sync.set(obj);
			} else {
				browser.storage.sync.clear();
				browser.storage.local.set(obj);
			}
			e.preventDefault();
		});
	});
});
