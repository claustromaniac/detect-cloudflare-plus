const checkboxes = [
	'paEnabled',
	'heuristics',
	'Cloudflare',
	'GoogleProjectShield',
	'Incapsula',
	'KeyCDN',
	'Sucuri'
];

document.addEventListener('DOMContentLoaded', () => {
	'use strict';
	for (const i of checkboxes) {
		browser.storage.sync.get(i).then(r => {
			document.querySelector(`#${i}`).checked = !!r[i];
		});
	}
});

document.querySelector("form").addEventListener("submit", e => {
	'use strict';
	let obj = {};
	for (const i of checkboxes) {
		obj[i] = document.querySelector(`#${i}`).checked;
	}
	browser.storage.sync.set(obj);
	e.preventDefault();
});
