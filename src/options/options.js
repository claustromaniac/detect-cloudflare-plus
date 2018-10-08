document.addEventListener('DOMContentLoaded', () => {
	'use strict';
	browser.runtime.sendMessage(true).then(settings => {
		const keys = Object.keys(settings);
		for (const i of keys) document.getElementById(i).checked = settings[i];
		document.querySelector("form").addEventListener("submit", async e => {
			e.preventDefault();
			const obj = {};
			for (const i of keys) obj[i] = document.getElementById(i).checked;
			obj.sync ? await browser.storage.sync.set(obj) : await browser.storage.sync.clear();
			await browser.storage.local.set(obj);
		});
	});
});
