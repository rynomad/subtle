
var attach = {};

if (!global.crypto)
  global.crypto = {};
if (!global.crypto.subtle)
  global.crypto.subtle = attach;

attach.generateKey = require("./src/node/generate-key.js");
attach.importKey   = require("./src/node/import-key.js");
attach.exportKey   = require("./src/node/export-key.js");
attach.digest      = require("./src/node/digest.js");
attach.encrypt     = require("./src/node/encrypt.js");
attach.decrypt     = require("./src/node/decrypt.js");
attach.deriveKey   = require("./src/node/derive-key.js");
attach.sign        = require("./src/node/sign.js");
attach.verify      = require("./src/node/verify.js");
attach.wrapKey     = require("./src/node/wrap-key.js");
attach.unwrapKey   = require("./src/node/unwrap-key.js");

module.exports = attach;

attach.generateKey({
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]), // 24 bit representation of 65537
    hash: {
      name: "SHA-256"
    }
  },
  false, // Cannot extract new key
  ["encrypt", "decrypt"]
).
then(function(keyPair) {
  console.log("generated keypair",keyPair);
});
