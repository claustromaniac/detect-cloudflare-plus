Detect Cloudflare PA
--------------------

Fork of the [Detect Cloudflare](https://github.com/traktofon/cf-detect) extension for Firefox by [traktofon](https://github.com/traktofon), with the following differences (as of 2018-08-24):
- Uses the `onResponseStarted` event from the [webRequest API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/) instead of `onHeadersReceived`, which should be safer for what it's needed for in this extension.
- Uses a **P**age-**A**ction type of icon (that appears in the awesomebar), instead of a toolbar icon.
- Hides the icon instead of changing its color to grey or green, when appropriate.

This fork is not listed on AMO, but you can download the signed XPI from [here](https://github.com/claustromaniac/detect-cloudflare-PA/releases).

### Privacy Policy
This extension neither collects nor shares *any* kind of information whatsoever.
