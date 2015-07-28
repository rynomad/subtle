Subtle
===
---
WebCrypto Polyfill for node/browsers

Why
--
You want to use crypto in Node and the browser. You want to use the same API in both places. If you're lucky enough to find a pure JS node module that can be browserified, you're off to a good start, but you heard that browsers have a webcrypto API now that's way faster than any javascript you could use. But it's supported in varying capacities by different browsers and it's entirely async, which means your API reuse dreams are now thoroughly crushed, and writing clean code to detect environment, features, and gracefully degrade is making you nauseous. This is why Subtle.

How
--
Subtle builds a wrapper over several node crypto modules, both pure-js and native, and wraps them in the webcrypto api. When browserified, the pure-js modules are included to fill out gaps between implimentations, but will only be used when webcrypto fails.

What
---
polyfill functionality is currently available for the following algorithms/operations ... all others will trigger the promise.catch() function (unless you're in a browser with that functionality).


RSASSA-PKCS1-v1_5 - generateKey, sign/verify, spki/pkcs8 import/export

RSA-OAEP - generateKey, encrypt/decrypt spki/pkcs8 import/export

AES-GCM -  encrypt/decrypt, raw import/export

HMAC - sign/verify, raw import/export

ECDH - {p-256} - generateKey, deriveBits, import/export spki/raw
