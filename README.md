Detect Cloudflare PA
--------------------

Fork of the [Detect Cloudflare](https://github.com/traktofon/cf-detect) extension for Firefox by [traktofon](https://github.com/traktofon), with the following differences (as of 2018-08-24):
- Uses the `onResponseStarted` event from the [webRequest API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/) instead of `onHeadersReceived`, which should be safer for what it's needed for in this extension.
- Uses a **P**age-**A**ction type of icon (that appears in the awesomebar), instead of a toolbar icon.
- Hides the icon instead of changing its color to grey or green, when appropriate.

This fork is not listed on AMO, but you can download the signed XPI from [here](https://github.com/claustromaniac/detect-cloudflare-PA/releases).

This extension neither collects nor shares *any* kind of information whatsoever.

### Motivation

Cloudflare is a content delivery network that provides useful services for servers, like caching, encryption and protection against DDoS attacks. It works as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy): it sits between the servers and you, relaying all requests and responses.

Cloudflare allows webmasters to choose how to handle the communication's encryption. Servers can choose not to serve anything over HTTPS, or they can choose to use strict HTTPS between server and browser. That's pretty normal, right? The problem is that **they also give servers the choice of encrypting the communication *only* between your browser and Cloudflare.**

You cannot trust the *S* in *HTTPS* when it is very likely that the encryption is getting dropped midway in the communication. Since there is no way for you to know what is going on with your traffic once it leaves your device, and since sites served by Cloudflare don't make that fact apparent in any way, the only sense of security you can get from HTTPS is a false one. You simply don't know what is really going on.

[Some people have argued](https://www.troyhunt.com/cloudflare-ssl-and-unhealthy-security-absolutism/) that it is better to have partial encryption than having no encryption at all, and **that** is the only reasonable argument in favor of Cloudflare that I have heard/read so far. The only problem with that argument is that - again - websites that use Cloudflare like this **don't make that fact apparent in any way**. Would you type in your credit card number if you knew that the communication is only encrypted between you and the man in the middle? I sure wouldn't.

And Cloudflare *is* a man in the middle. So, you can't have any guarantees regarding privacy either. Technically speaking, at any given time you can't even know whether or not the content you get in your browser is really the unaltered response from the server.

This extension informs you of the presence of this intermediary, to give you an additional resource for judging whether to trust websites or not.

The internet has become more and more centralized over the years. Sadly, Cloudflare is not the only reverse proxy around, but it is a very major one, and it is relatively easy to detect (at least for now).
