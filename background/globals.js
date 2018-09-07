var paEnabled;
var cfInfo = new CFInfoByTab();
var requestsByID = {};
const iconColorAndDesc = [
	{ color: 'red', desc: 'Detect Cloudflare+' },
	{ color: 'orange', desc: 'External resources were served by Cloudflare.' },
	{ color: 'red', desc: 'This page was served by Cloudflare!' }
];