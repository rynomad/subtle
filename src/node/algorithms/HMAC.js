var NodeCrypto = require("crypto")
var CryptoKey = require("../CryptoKey.js")

var subtleToCrypto = {
  hash :{
    "SHA-256" : "sha256",
    "SHA-1": "sha1"
  }
}

var makeUsage = {
  "sign" : function makeSign(key, hash){
    return function(alg, buf){
      var mac = NodeCrypto.createHmac(subtleToCrypto.hash[hash.name], key)
                          .update(buf)
                          .digest();
      return mac;
    }
  },
  "verify" : function makeVerify(key, hash){
    return function(alg, buf, sig){
      return (!Buffer.compare(sig, makeUsage["sign"](key, hash)(alg, buf)))
    }
  }
}

function createCryptoKey(key, type, exportable, usage, nonce){
  var uses = {}, exporter;
  if (usage)
    uses[usage] = makeUsage[usage](key);
  if (exportable)
    exporter = makeExporter(type,key);

  console.log("OAEP KEY")
  return new CryptoKey(key, type, exporter, uses, nonce)
}

function generateKey(){
  throw new Error("not implimented")
}

var Import = {
  "raw" : function (bytes){
    return bytes;
  }
}

var Export = {
  "raw" :function (){}
}

var makeExporter = function makeExporter(key){
  return function exportKey(format){
    return (Export[format]) ? Export[type][format](key)
                            : new Error("unsupported export format");
  }
};

function checkParams(format,algorithm, usages){
  if (!(algorithm.hash && algorithm.hash.name))
    throw new Error("missing hash or hash.name field")
  if (!forge.md[subtleToCrypto.hash[algorithm.hash.name]])
    throw new Error("invalid hash name string")
  if (!Import[format])
    throw new Error("unsupported import format")
  for (var i in usages)
    if (!makeUsage[usages[i]])
      throw new Error("cannot make key with that usage")
}

function importKey(format, bytes, algorithm, exportable, usages, nonce){
  console.log("HMAC import")
  checkParams(format, algorithm, usages)

  var key = Import[format](bytes)
  var uses = {}
  for (var i in usages)
    uses[usages[i]] = makeUsage[usages[i]](key, algorithm.hash);

  exportable = (exportable) ? makeExporter(key) : null


  return new CryptoKey(key, "secret", exportable, uses, nonce);

}

module.exports = {
  importKey : importKey

}
