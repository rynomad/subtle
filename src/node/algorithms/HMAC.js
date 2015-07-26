var CryptoKey  = require("../CryptoKey.js")
  , Algorithm  = require("./abstract")("HMAC")
  , NodeCrypto = require("crypto")
  , forge      = require("node-forge")
  , private    = Algorithm.types.private.usage
  , public     = Algorithm.types.public.usage;

private.sign  = createSign;
public.verify = createVerify;

function createSign(key, hash){
  return function HMAC_SIGN(alg, buf){
    var hashKey = alg.hash.name.replace(/-/g, '').toLowerCase();
    return NodeCrypto.createHmac(hashKey, key)
                      .update(buf)
                      .digest();
  };
}

function createVerify(key, hash){
  return function HMAC_VERIFY(alg, buf, sig){
    return (!Buffer.compare(sig, makeUsage["sign"](key, hash)(alg, buf)));
  };
}

function raw_import(bytes){
  return bytes;
}

function raw_export(key){
  return key;
}
