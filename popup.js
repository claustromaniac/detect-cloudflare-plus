var getTab = browser.tabs.query( { active:true, currentWindow:true } );

getTab.then( function( tabs ) {
	let port = browser.runtime.connect();
	port.postMessage(tabs[0].id);
	port.onMessage.addListener( function(msg) {
		port.disconnect();
		if (msg) {
			populatePopup(msg.counts);
		}
	});
})

.catch( function( error ) {
	console.log(`CF-Detect-Popup: ${error}`);
});

function populatePopup( domainCounts ) {
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

// vim: set expandtab ts=4 sw=4 :