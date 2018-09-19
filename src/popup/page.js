const statusType = [
	'none',
	'external',
	'main'
];

var getTab = browser.tabs.query({
	active: true,
	currentWindow: true
});

getTab.then(tabs => {
		'use strict';
		const port = browser.runtime.connect();
		port.postMessage(tabs[0].id);
		port.onMessage.addListener(msg => {
			port.disconnect();
			let sthDetected;
			for (const i in msg.counters) {
				sthDetected = populatePopup(i, msg.results[i], msg.counters[i]) || sthDetected;
			}
			if (!sthDetected) writeStatus('', 0);
		});
	})
	.catch(e => {
		writeStatus('', 0);
		console.log(`True-Sight: ${e}`);
	});

function writeStatus(cdn, result) {
	const st = document.createElement('h3');
	st.setAttribute('class', statusType[result]);
	switch (result) {
		case 1:
			st.textContent = cdn + ' (3p)';
			break;
		case 2:
			st.textContent = cdn + ' (1p)';
			break;
		default:
			st.textContent = 'No CDNs detected.';
	}
	document.getElementById('top').appendChild(st);
}

function populatePopup(cdn, result, domainCounts) {
	let ndomain = 0;
	const ul = document.createElement('ul');
	for (var domain in domainCounts) {
		if (!domainCounts.hasOwnProperty(domain)) continue;
		++ndomain;
		var li = document.createElement('li');
		var text = document.createTextNode(`${domain}: `);
		var span = document.createElement('span');
		span.setAttribute('class', 'count');
		span.textContent = `${domainCounts[domain]}`;
		li.appendChild(text);
		li.appendChild(span);
		ul.appendChild(li);
	}
	if (ndomain) {
		writeStatus(cdn, result);
		let top = document.getElementById('top');
		top.appendChild(ul);
		top.appendChild(document.createElement('br'));
		return true;
	}
}
