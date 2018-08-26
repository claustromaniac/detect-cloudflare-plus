Detect Cloudflare PA
--------------------

Fork of the [Detect Cloudflare](https://github.com/traktofon/cf-detect) extension for Firefox by [traktofon](https://github.com/traktofon), with the following differences (as of 2018-08-24):
- Uses the `onResponseStarted` event from the [webRequest API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/) instead of `onHeadersReceived`, which should be safer for what it's needed for in this extension.
- Uses a **P**age-**A**ction type of icon (that appears in the awesomebar), instead of a toolbar icon.
- Hides the icon instead of changing its color to grey or green, when appropriate.

This fork is not listed on AMO, but you can download the signed XPI from [here](https://github.com/claustromaniac/detect-cloudflare-PA/releases).

### Motivation

Cloudflare is a content delivery network that provides useful services for servers, like caching, encryption and protection against DDoS attacks. It works as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy): it sits between the servers and you, intercepting all your traffic on behalf of them.

Cloudflare allows webmasters to choose how to handle the communication's encryption. Servers can choose not to serve anything over HTTPS, or they can choose to use strict HTTPS between server and browser. That's pretty normal, right? The problem is that **they also allow servers to choose to have the encryption be only partial.**

You cannot trust the *S* in *HTTPS* when you don't know whether the communication is encrypted between you and the server, or if it is encrypted only between you and Cloudflare. Since there is no way for you to know what is going on with your traffic once it leaves your device, and since sites served by Cloudflare don't make that fact apparent in any way, the only sense of security you can get from the *S* in *HTTPS*, is a false one. You simply don't know what is really going on.

[Some people have argued](https://www.troyhunt.com/cloudflare-ssl-and-unhealthy-security-absolutism/) that it is better to have partial encryption than having no encryption at all, and **that** is the only reasonable argument in favor of Cloudflare that I have heard/read so far. The only problem with that argument is that websites with partial encryption **don't make that fact apparent in any way**. Would you type in your credit card number if you knew that the communication is only encrypted between you and the man in the middle? I sure wouldn't.

This extension tries to let you know which sites that you visit are served by Cloudflare, so you can use your own judgement to decide whether to trust them or not.

The internet has become more and more centralized over the years. Sadly, Cloudflare is not the only reverse proxy around, but it is a very major one, and it is relatively easy to detect.


### Privacy Policy
This extension neither collects nor shares *any* kind of information whatsoever.

