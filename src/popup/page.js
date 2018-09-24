browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
		'use strict';
		const port = browser.runtime.connect();
		port.postMessage(tabs[0].id);
		port.onMessage.addListener(msg => {
			port.disconnect();
			const sum = document.getElementById('sum');
			sum.textContent = msg.badgeNum.toString();
			append(sum, 'span', 'tooltiptext', 'requests to CDNs');
			const total = document.getElementById('total');
			total.textContent = msg.total.toString();
			append(total, 'span', 'tooltiptext', 'total requests');
			let sthDetected;
			for (const i in msg.counters) {
				sthDetected = populatePopup(i, msg) || sthDetected;
			}
			if (!sthDetected) append(0, 'p', 'none', 'No CDNs detected');
		});
	})
	.catch(e => {
		append(0, 'p', 'none', 'No CDNs detected');
		console.log(`True-Sight: ${e}`);
	});

function append(target, type, clazz, text) {
// Cuz I'm a clazzy cat, and I'm proudz of it.
	let ele;
	if (type) {
		ele = document.createElement(type);
		if (clazz) ele.setAttribute('class', clazz);
		if (text) ele.textContent = text;
	} else ele = document.createTextNode(text);
	return target ? target.appendChild(ele) : document.body.appendChild(ele);
}

function populatePopup(cdn, msg) {
	const ul = document.createElement('ul');
	for (const domain in msg.counters[cdn]) {
		var li = document.createElement('li');
		append(li, 0, 0, `${domain}: `);
		switch (msg.docs[domain]) {
			case 1:
				li.setAttribute('class', 'main');
				append(li, 'span', 'count', `${msg.counters[cdn][domain]}`);
				break;
			case 2:
				li.setAttribute('class', 'redirect');
				append(li, 'span', 'count', `${msg.counters[cdn][domain]} (redirect)`);
				break;
			default:
				li.setAttribute('class', 'external');
				append(li, 'span', 'count', `${msg.counters[cdn][domain]}`);
		}
		ul.appendChild(li);
	}
	if (li) {
		append(0, 'p', 'cdn', cdn);
		document.body.appendChild(ul);
		document.body.appendChild(document.createElement('br'));
		return true;
	}
}
