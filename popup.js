const statusText = {
	0: "No requests have been processed yet.",
	1: "No requests were served by Cloudflare.",
	2: "Requests for these domains were served by Cloudflare:",
	3: "Requests for these domains were served by Cloudflare:",
   99: "Detection result unavailable."
};

var getTab = browser.tabs.query( { active:true, currentWindow:true } );

getTab.then( function( tabs ) {
	let port = browser.runtime.connect();
	port.postMessage(tabs[0].id);
	port.onMessage.addListener( function(msg) {
		port.disconnect();
		if (msg) {
			writeStatus(msg.result);
			populatePopup(msg.counts);
		} else {
			writeStatus(0);
		}
	});
})
.catch( function( error ) {
	writeStatus(99);
	console.log(`CF-Detect-Popup: ${error}`);
});

function writeStatus( st ) {
	document.getElementById("status").textContent = statusText[st];
}

function populatePopup( domainCounts ) {
	let ndomain = 0;
	let ul = document.createElement("ul");
	for (var domain in domainCounts) {
		if (!domainCounts.hasOwnProperty(domain)) continue;
		++ndomain;
		var li = document.createElement("li");
		var text = document.createTextNode(`${domain}: `);
		var span = document.createElement("span");
		span.setAttribute("class", "domainCounts[domain]");
		span.textContent = `${domainCounts[domain]}`;
		li.appendChild(text);
		li.appendChild(span);
		ul.appendChild(li);
	}
	if (ndomain) document.getElementById("top").appendChild(ul);
}

// vim: set expandtab ts=4 sw=4 :