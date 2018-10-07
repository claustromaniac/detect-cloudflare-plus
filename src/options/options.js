document.addEventListener('DOMContentLoaded', () => {
	'use strict';
	browser.runtime.sendMessage('getSettings').then(settings => {
		const options = Object.keys(settings);
		for (const i of options) {
			document.getElementById(i).checked = settings[i];
		}
		document.querySelector("form").addEventListener("submit", e => {
			'use strict';
			const obj = {};
			for (const i of options) obj[i] = document.getElementById(i).checked;
			browser.runtime.sendMessage(obj);
			e.preventDefault();
		});
	});
});
