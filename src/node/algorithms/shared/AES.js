var sjcl      = require("sjcl");

function AES_generateKey(noop){
  return;
}

function raw_import(buf){
  return new sjcl.cipher.aes(sjcl.codec.hex.toBits(buf.toString("hex")));
}

function raw_export(key){
  return key;
}

function AES(Algorithm){
  Algorithm.formats.raw.import = raw_import;
  Algorithm.formats.raw.export = raw_export;
  return;
}

module.exports = AES;
