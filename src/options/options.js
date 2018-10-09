document.addEventListener('DOMContentLoaded', () => {
	'use strict';
	browser.runtime.sendMessage(true).then(settings => {
		const keys = Object.keys(settings);
		for (const i of keys) document.getElementById(i).checked = settings[i];
		document.querySelector("form").addEventListener("submit", e => {
			e.preventDefault();
			const obj = {};
			for (const i of keys) obj[i] = document.getElementById(i).checked;
			let working = obj.sync ? browser.storage.sync.set(obj) : browser.storage.sync.clear();
			working.then(browser.storage.local.set(obj));
		});
	});
});
