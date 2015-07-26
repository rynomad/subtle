var CryptoKey  = require("./CryptoKey")
  , Algorithms = require("./algorithms/index.js");

function checkParams(format,key,algorithm,usages){
  console.log("format", algorithm.name, Algorithms[algorithm.name])
  if (!(algorithm.name && Algorithms[algorithm.name]))
    throw new Error("unsupported or missing algorithm name")

  var alg = Algorithms[algorithm.name];

  alg.checkParams(format,algorithm);

  if (!alg.formats[format])
    throw new Error("cannot create a " + algorithm.name + " key from format: " + format);

  for (var i in usages)
    if (!(alg.formats[format].types.indexOf(alg.usages[usages[i]]) < 0))
      throw new Error("cannot create " + algorithm.name + " " + format + " key with usage: " + usages[i]);

  return;
}

var importKey = function importKey(format,key, algorithm, exportable, usages, nonce ){
  return new Promise(function rejecter(resolve,reject){
    checkParams(format,key,algorithm,usages,nonce);

    var _alg    = Algorithms[algorithm.name]
      , _format = _alg.formats[format]
      , _types  = _format.types
      , _key    = _format.import(key, algorithm)
      , _exp    = (exportable) ? _alg.createExporter(_key) : null
      , _uses   = {}
      , _type;

    //iterate through usages for the format, until we find the right usage creator
    for (var i in usages)
      //iterate through key types until we find the right usage
      for (var j in _types){
        if (_types[j].usage[usages[i]]){
          _uses[usages[i]] = _types[j].usage[usages[i]](_key);
          _type = _types[j].label;
          break;
        }
      }
    resolve(new CryptoKey(_key, _type, _exp, _uses, nonce ));
  });
};

module.exports = importKey;
