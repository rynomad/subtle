var CryptoKey  = require("../CryptoKey.js")
  , Algorithm  = require("./abstract")("HMAC")
  , NodeCrypto = require("crypto")
  , forge      = require("node-forge")
  , secret     = Algorithm.types.secret.usage
  , raw        = Algorithm.formats.raw;

module.exports = Algorithm;

secret.sign    = createSign;
secret.verify  = createVerify;

raw.import = raw_import;

function createSign(key,alg1){
  return function HMAC_SIGN(alg, buf){
    var hashKey = alg1.hash.name.replace(/-/g, '').toLowerCase();
    return NodeCrypto.createHmac(hashKey, key)
                      .update(buf)
                      .digest();
  };
}

function createVerify(key, alg1){
  return function HMAC_VERIFY(alg, buf, sig){
    var hashKey = alg1.hash.name.replace(/-/g, '').toLowerCase();
    return (!Buffer.compare(sig, makeUsage["sign"](key, hash)(alg, buf)));
  };
}

function raw_import(bytes){
  return bytes;
}

function raw_export(key){
  return key;
}
