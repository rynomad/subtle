
var Generator = {}
Generator["RSA-OAEP"] = require("./algorithms/RSA-OAEP.js").generateKey;
Generator["RSASSA-PKCS1-v1_5"] = require("./algorithms/RSASSA-PKCS1-v1_5.js").generateKey;
Generator["ECDH"] = require("./algorithms/ECDH").generateKey;
var Algorithms = require("./algorithms/index.js");

function checkParams(algorithm,usages){
  if (!(algorithm.name && Algorithms[algorithm.name]))
    throw new Error("unsupported or missing algorithm name")

  var alg = Algorithms[algorithm.name];

  alg.checkParams(algorithm);

  for (var i in usages)
    if (!(alg.usages[usages[i]]))
      throw new Error("cannot create " + algorithm.name + " key with usage: " + usages[i]);

  return;
}

function generateKey(algorithm, exportable, usages, nonce){
  return new Promise(function rejecter(resolve,reject){
    checkParams(algorithm, usages);

    var _alg    = Algorithms[algorithm.name]
      , _key    = _alg.generate(algorithm);
      , _exp    = (exportable) ? _alg.createExporter(_key) : null
      , _ret    = {}
      , _res    = {}
      , _types  = []

    for (var i in usages){
      if (_types.indexOf(_alg[usages[i].label]) < 0)
        _types.push(_alg[usages[i]].label);



    for (var j in _types){
      _ret[_types[j]] = {
        _uses : {}
        _exp  : (exportable) ? _alg.createExporter(_key, _types[j]) : null
      };
      for (var k in usages)
        if (_alg[_types[j]].usages[usages[k]])
          _ret[_types[j]].uses[usages[k]] = _alg[_types[j]].usages[usages[k]](_key);

      _res[_alg[_types[j]].returnLabel] = new CryptoKey(_key, _types[j], _ret[_types[j]]._uses, nonce)
    }

    resolve(_res);
  });
}

module.exports = generateKey;
