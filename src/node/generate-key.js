var forge     = require("node-forge")
  , CryptoKey = require("./crypto-key.js");


var generateKey = function generateKey(algorithm, exportable, usages){
  return new Promise(function rejecter(resolve,reject){
    var key, cryptoKey, rejectEr;

    switch(algorithm.name){
    case ("RSAES-PKCS1-V1_5"):
    case ("RSSHA-PKCS1-V1_5"):
    case ("RSA-OAEP"): {
        //should check if usages compatible with algorithm
        var exp = 0, pos = 0
        for (var i = algorithm.publicExponent.length - 1 ; i >= 0 ; i--){
          exp += algorithm.publicExponent[i] << (pos * 8);
          pos++;
        }
        key = forge.rsa.generateKeyPair({bits: algorithm.modulousLength , e: exp});
        resolve({
          publicKey  : new CryptoKey("public", key.publicKey, exportable, usages)
          , privateKey : new CryptoKey("private", key.privateKey, exportable, usages)
        });
        break;
      }
    default: (reject(new Error("Algorithm not supported")));
    }
  });
};

module.exports = generateKey;
