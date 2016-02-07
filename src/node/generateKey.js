
var Generator = {}
Generator["RSA-OAEP"] = require("./algorithms/RSA-OAEP.js").generateKey;
Generator["RSASSA-PKCS1-v1_5"] = require("./algorithms/RSASSA-PKCS1-v1_5.js").generateKey;
Generator["ECDH"] = require("./algorithms/ECDH").generateKey;
var Algorithms = require("./algorithms/index.js");
var CryptoKey = require("./CryptoKey.js")

function checkParams(algorithm,usages){
  if (!(algorithm.name && Algorithms[algorithm.name]))
    throw new Error("unsupported or missing algorithm name")

  var alg = Algorithms[algorithm.name];

  alg.checkParams("generate",algorithm);

  for (var i in usages)
    if (!(alg.usages[usages[i]]))
      throw new Error("cannot create " + algorithm.name + " key with usage: " + usages[i]);

  return;
}

function generateKey(algorithm, exportable, usages, nonce){
  return new Promise(function generateKey_Promise(resolve,reject){
    checkParams(algorithm, usages);

    var _alg    = Algorithms[algorithm.name]
      , _key    = _alg.generate(algorithm)
      , _scaf   = {}
      , _res    = {}
      , _types  = [];

    //iterate through usages
    for (var i in usages){

      //iterate through key types associated with usage
      for (var j in _alg.usages[usages[i]]){

        //check if usage is implimented for this key type
        if (_alg.usages[usages[i]][j].usage[usages[i]]){

          //create or retrieve a scaffold for the key type
          _scaf[_alg.usages[usages[i]][j].label] = _scaf[_alg.usages[usages[i]].label]
                                                || { _uses : {}
                                                   , _exp  : (exportable) ? _alg.createExporter(_alg.usages[usages[i]][j].label, _key)
                                                                          : null
                                                   };

          //attach the usage to the scaffold
          _scaf[_alg.usages[usages[i]][j].label]._uses[usages[i]] = _alg.usages[usages[i]][j].usage[usages[i]](_key, algorithm)

          //move on to the next usage
          break;
        }
      }
    }

    //construct the return object from the scaffold
    Object.keys(_scaf).forEach(function(type){
      if (_alg.types[type].returnLabel) {
        _res[_alg.types[type].returnLabel] = new CryptoKey(_key, type, _scaf[type]._exp, _scaf[type]._uses, nonce);
      }
      else {
        _res = new CryptoKey(_key, type, _scaf[type]._exp, _scaf[type]._uses, nonce);
      }
    })

    //special case... ECDH public keys don't have they're own usage, but are still needed as params in deriveKey/Bits
    if (algorithm.name === "ECDH")
      _res["publicKey"] = new CryptoKey(_key, "public",_alg.createExporter("public", _key), {}, nonce);


    resolve(_res)
  });
}

module.exports = generateKey;
