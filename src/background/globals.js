var settings = new Settings();
const tabs = new Tabs();
const requestIDs = {};
const filter = {urls: ["<all_urls>"]};
const extraInfo = ["responseHeaders"];
const iconColorAndDesc = [
	{ color: '', desc: 'True Sight' },
	{ color: 'yellow', desc: 'External resources were served by a CDN.' },
	{ color: 'red', desc: 'This page was served by a CDN!' },
	{ color: 'purple', desc: 'Multiple CDNs detected on this page!' }
];
