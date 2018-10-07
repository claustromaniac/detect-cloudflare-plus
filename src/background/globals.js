const settings = new Settings();
const tabs = new Tabs();
const iconData = [
	{
		color: '',
		desc: 'True Sight',
		path: null
	},

	{
		color: 'orange',
		desc: 'External resources were served by a CDN.',
		path: {
			16: 'icons/eye16-orange.png',
			32: 'icons/eye32-orange.png'
		}
	},

	{
		color: 'red',
		desc: 'This page was served by a CDN!',
		path: {
			16: 'icons/eye16-red.png',
			32: 'icons/eye32-red.png'
		}
	},

	{
		color: 'purple',
		desc: 'Multiple CDNs detected on this page!',
		path: {
			16: 'icons/eye16-purple.png',
			32: 'icons/eye32-purple.png'
		}
	}
];
