var Importer = {};

Importer["RSA-OAEP"] = require("./algorithms/RSA-OAEP.js").importKey;
Importer["RSASSA-PKCS1-v1_5"] = require("./algorithms/RSASSA-PKCS1-v1_5.js").importKey;
Importer["AES-GCM"] = require("./algorithms/AES-GCM.js").importKey
Importer["ECDH"] = require("./algorithms/ECDH.js").importKey;

var importKey = function importKey(format,key, algorithm, exportable, usages, nonce ){
  var args = arguments
  console.log("alg", algorithm.name)
  return new Promise(function rejecter(resolve,reject){
    if (Importer[algorithm.name])
      resolve(Importer[algorithm.name].apply({},args));
    else
      reject(new Error("operation not supported"));
  });
};

module.exports =importKey;
