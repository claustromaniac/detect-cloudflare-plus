Detect Cloudflare PA
--------------------

Fork of the [Detect Cloudflare](https://github.com/traktofon/cf-detect) extension for Firefox by [traktofon](https://github.com/traktofon), with the following differences (as of 2018-08-24):
- Uses the onResponseStarted event from the webRequest API instead of onHeadersReceived, which should be safer for what it's needed for in this extension.
- Uses a page-action type of icon (that appears in the awesomebar), instead of a toolbar icon.
- Hides the icon instead of displaying the grey or green icons, when appropriate.