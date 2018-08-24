const statusText = {
    0: "No requests have been processed yet.",
    1: "No requests were served by Cloudflare.",
    2: "Requests for these domains were served by Cloudflare:",
    3: "Requests for these domains were served by Cloudflare:",
   99: "Detection result unavailable."
};

var getTab = browser.tabs.query( { active:true, currentWindow:true } );

getTab.then( function( tabs ) {
    var tab = tabs[0];
    var port = browser.runtime.connect();
    port.postMessage(tab.id);
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
    var p = document.getElementById("status");
    p.textContent = statusText[st];
}

function populatePopup( domainCounts ) {
    var ndomain = 0;
    var div = document.getElementById("top");
    var ul = document.createElement("ul");
    for (var domain in domainCounts) {
        if (!domainCounts.hasOwnProperty(domain)) continue;
        ++ndomain;
        var count = domainCounts[domain];
        var li = document.createElement("li");
        var text = document.createTextNode(`${domain}: `);
        var span = document.createElement("span");
        span.setAttribute("class", "count");
        span.textContent = `${count}`;
        li.appendChild(text);
        li.appendChild(span);
        ul.appendChild(li);
    }
    if (ndomain>0) div.appendChild(ul);
}

// vim: set expandtab ts=4 sw=4 :
