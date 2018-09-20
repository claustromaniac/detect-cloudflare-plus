const checkboxes = [
	'paEnabled',
	'heuristics',
	'Akamai',
	'AmazonCloudfront',
	'Cloudflare',
	'GoogleProjectShield',
	'Incapsula',
	'KeyCDN',
	'Kinsta',
	'MyraCloud',
	'Sucuri'
];

document.addEventListener('DOMContentLoaded', () => {
	'use strict';
	for (const i of checkboxes) {
		browser.storage.sync.get(i).then(r => {
			document.getElementById(i).checked = !!r[i];
		});
	}
	document.querySelector("form").addEventListener("submit", e => {
		'use strict';
		let obj = {};
		for (const i of checkboxes) {
			obj[i] = document.getElementById(i).checked;
		}
		browser.storage.sync.set(obj);
		e.preventDefault();
	});
});

