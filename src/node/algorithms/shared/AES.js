var sjcl      = require("sjcl"),
    crypto    = require("crypto");

function AES_generateKey(algorithm){
  return raw_import(crypto.randomBytes(algorithm.length / 8));
}

function raw_import(buf){
  var key = new sjcl.cipher.aes(sjcl.codec.hex.toBits(buf.toString("hex")));
  key._raw = buf;
  return key;
}

function raw_export(key){
  return key._raw;
}

function AES(Algorithm){
  Algorithm.formats.raw.import = raw_import;
  Algorithm.formats.raw.export = raw_export;
  Algorithm.generate = AES_generateKey;
  return;
}

module.exports = AES;
