var cecc = require("ecc-jsbn");
var CryptoKey = require("../CryptoKey.js")

var subtleToCECC = {
  "P-256" : "secp256r1"
}

var Import = {
  "spki": function(spki, curvename){
    var raw = spki.slice(spki.length - 65)
    var curvekey = subtleToCECC[curvename];
    var curve = cecc.ECCurves[curvekey];
    curve.legacy = true;

    return new cecc.ECKey(curve, raw, true);
  }
}

var makeUsage = {
  deriveBits: function makeEncrypt(privateKey){
    return function ECDH_DERIVEBITS(publicKey, nonce){
      console.log('publicKey', publicKey)
      return privateKey.deriveSharedSecret(publicKey._get(nonce));
    };
  }, get : function makeGet(key){
    return function(){
      return key;
    }
  }
}

var spkiECCPad = new Buffer("3056301006042b81047006082a8648ce3d030107034200","hex")
var Export = {
  "spki": function(key){
    return Buffer.concat([spkiECCPad, key.PublicKey])
  }
}

var makeExporter = function(type,key){
  return function(format){
    if (!Export[format])
      throw new Error("Unsupported export format")
    else
      return Export[format](key)
  }
}

function createCryptoKey(key, type, exportable, usages, nonce){
  var uses = {}, exporter;
  console.log("usages", usages)
  for (var i in usages)
    uses[usages[i]] = makeUsage[usages[i]](key);
  if (exportable)
    exporter = makeExporter(type,key);


  uses["get"] = makeUsage["get"](key)

  return new CryptoKey(key, type, exporter, uses, nonce)
}

function validateImport(format,alg,usages){
  for( var i in usages)
    if (!makeUsage[usages[i]])
      throw new Error("cannot import a key with those usages" + usages[i])

  if (!alg.namedCurve || !subtleToCECC[alg.namedCurve])
    throw new Error("Unsupported or not present: namedCurve")

  if (!Import[format])
    throw new Error("Cannot import the selected format")

  return;
}

function validateGenerate(alg, usages){
  validateImport("spki",alg, usages)
}


function generateKey(alg, exportable,usages, nonce){
  validateGenerate(alg,usages);

  var curvekey = subtleToCECC[alg.namedCurve];
  var curve = cecc.ECCurves[curvekey];
  curve.legacy = true;
  var key = new cecc.ECKey(curve);
  return {
    publicKey : createCryptoKey(key,"public", exportable, usages, nonce)
    , privateKey : createCryptoKey(key,"private",exportable,usages, nonce)
  }


}

function importKey(format, key, alg, exportable, usages, nonce){
  validateImport(format, alg, usages)

  var curvekey = subtleToCECC[alg.namedCurve];
  var curve = cecc.ECCurves[curvekey];
  curve.legacy = true;
  var KEY = new cecc.ECKey(curve, key, true);

  return createCryptoKey(KEY,"public",exportable,usages, nonce)
}

module.exports = {
  importKey : importKey,
  generateKey : generateKey
}
