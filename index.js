
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
