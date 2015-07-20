var Importer = {};

Importer["RSA-OAEP"] = require("./algorithms/RSA-OAEP.js").importKey;
Importer["RSASSA-PKCS1-v1_5"] = require("./algorithms/RSASSA-PKCS1-v1_5.js").importKey;
Importer["AES-GCM"] = require("./algorithms/AES-GCM.js").importKey;
Importer["ECDH"] = require("./algorithms/ECDH.js").importKey;
Importer["HMAC"] = require("./algorithms/HMAC.js").importKey;

var Algorithms = require("./algorithms/index.js");

function checkParams(format,key,algorithm,usages){
  if (!(algorithm.name && Algorithms[algorithm.name]))
    throw new Error("unsupported or missing algorithm name")

  var alg = Algorithms[algorithm.name];

  alg.checkParams(algorithm);

  if (!alg.formats[format])
    throw new Error("cannot create a " + algorithm.name + " key from format: " + format);

  for (var i in usages)
    if (!(alg.formats[format].types.indexOf(alg.usages[usages[i]]) < 0)
      throw new Error("cannot create " + algorithm.name + " " + format + " key with usage: " + usages[i]);

  return;
}

var importKey = function importKey(format,key, algorithm, exportable, usages, nonce ){
  return new Promise(function rejecter(resolve,reject){
    checkParams(format,key,algorithm,usages,nonce);

    var _alg    = Algorithms[algorithm.name]
      , _format = _alg[format]
      , _type   = _format.type
      , _key    = _format.import(key)
      , _exp    = (exportable) ? _alg.createExporter(_key) : null
      , _uses   = {};

    for (var i in usages)
      _uses[usages[i]] = _type.usage[usages[i]](_key);

    resolve(new CryptoKey(_key, _type, _exp, _uses, nonce ));
  });
};

module.exports = importKey;
