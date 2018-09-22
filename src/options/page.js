document.addEventListener('DOMContentLoaded', () => {
	'use strict';
	browser.runtime.getBackgroundPage().then(bg => {
		const options = Object.keys(bg.settings.defaults);
		for (const i of options) {
			document.getElementById(i).checked = bg.settings[i];
		}
		document.querySelector("form").addEventListener("submit", e => {
			'use strict';
			const obj = {};
			for (const i of options) obj[i] = document.getElementById(i).checked;
			browser.storage.sync.set(obj);
			bg.settings.all = obj;
			e.preventDefault();
		});
	});
});
