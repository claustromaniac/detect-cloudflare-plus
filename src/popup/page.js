const statusText = [
	"Cloudflare not detected.",
	"External resources from these domains were served by Cloudflare:",
	"Resources from these domains were served by Cloudflare:"
];

var getTab = browser.tabs.query({
	active: true,
	currentWindow: true
});

getTab.then(tabs => {
		let port = browser.runtime.connect();
		port.postMessage(tabs[0].id);
		port.onMessage.addListener(msg => {
			port.disconnect();
			writeStatus(msg.result);
			if (msg.result) {
				populatePopup(msg.counts);
			}
		});
	})
	.catch(e => {
		writeStatus(0);
		console.log(`Detect-Cloudflare-Popup: ${e}`);
	});

function writeStatus(st) {
	document.getElementById("status").textContent = statusText[st];
}

function populatePopup(domainCounts) {
	let ndomain = 0;
	let ul = document.createElement("ul");
	for (var domain in domainCounts) {
		if (!domainCounts.hasOwnProperty(domain)) continue;
		++ndomain;
		var li = document.createElement("li");
		var text = document.createTextNode(`${domain}: `);
		var span = document.createElement("span");
		span.setAttribute("class", "count");
		span.textContent = `${domainCounts[domain]}`;
		li.appendChild(text);
		li.appendChild(span);
		ul.appendChild(li);
	}
	if (ndomain) document.getElementById("top").appendChild(ul);
}
