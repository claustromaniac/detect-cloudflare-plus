Detect Cloudflare+
------------------

**https://addons.mozilla.org/firefox/addon/detect-cloudflare-plus/**

This Firefox extension is an almost fully rewritten fork of [Detect Cloudflare](https://github.com/traktofon/cf-detect) by [traktofon](https://github.com/traktofon). It has the following differences (as of 2018-09-03):
- Does not use the `onHeadersReceived` event from the [webRequest API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/) because multiple `onHeadersReceived` listeners [conflict with one another](https://github.com/ghacksuserjs/ghacks-user.js/issues/265), and this extension doesn't need to modify any headers to work, so it is not necessary.
- Does not use the webNavigation API, so it doesn't need permissions for that.
- Reports a more accurate number of requests. The original Detect Cloudflare extension usually reports a higher number of request per domain, sometimes even twice as high. This is because `onHeadersReceived` doesn't necessarily trigger only once for each request, and the extension doesn't check the request IDs at any moment.
- Uses the orange cloud as the default icon.
- Shows the total number of responses served by Cloudflare in a badge on the toolbar icon.
- Does not change the color of the toolbar icon. Instead, it changes the color of the badge.
- Adds an optional page-action type of icon (that appears in the address bar). The color of this icon **does** change because it cannot have a badge.
- Uses light text on dark background for the popup style.
- Various performance optimizations and some very minor fixes.

### Privacy

This extension neither collects nor shares any kind of information whatsoever.

### Motivation

Cloudflare is a content delivery network that provides useful services for servers, like caching, encryption and protection against DDoS attacks. It works as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy): it sits between the servers and you, relaying all requests and responses.

Cloudflare allows webmasters to choose how to handle the communication's encryption. Servers can choose not to serve anything over HTTPS, or they can choose to use strict HTTPS between server and browser. That's pretty normal, right? The problem is that **they also give servers the choice of encrypting the communication *only* between your browser and Cloudflare.**

You cannot trust the *S* in *HTTPS* when it is very likely that the encryption is getting dropped midway in the communication. Since there is no way for you to know what is going on with your traffic once it leaves your device, and since sites served by Cloudflare don't make that fact apparent in any way, the only sense of security you can get from HTTPS is a false one. You simply don't know what is really going on.

[Some people have argued](https://www.troyhunt.com/cloudflare-ssl-and-unhealthy-security-absolutism/) that it is better to have partial encryption than having no encryption at all, and **that** is the only reasonable argument in favor of Cloudflare that I have heard/read so far. The only problem with that argument is that - again - websites that use Cloudflare like this **don't make that fact apparent in any way**. Would you type in your credit card number if you knew that the communication is only encrypted between you and the man in the middle? I sure wouldn't.

And Cloudflare *is* a man in the middle. So, you can't have any guarantees regarding privacy either. Technically speaking, at any given time you can't even know whether or not the content you get in your browser is really the unaltered response from the server.

This extension informs you of the presence of this intermediary, to give you an additional resource for judging whether to trust websites or not.

The internet has become more and more centralized over the years. Sadly, Cloudflare is not the only reverse proxy around, but it is a very major one, and it is relatively easy to detect (at least for now).
