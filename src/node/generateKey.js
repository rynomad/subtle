var forge     = require("node-forge")
  , CryptoKey = require("./CryptoK.js");

var Generator = {}
Generator.["RSA-OAEP"] = Generator["RSASSA-PKCS1-v1_5"] = Generator["RSAAES-PKCS1-v1_5"] = require("./algorithms/RSA.js").Generator

var generateKey = function generateKey(algorithm){
  return new Promise(function rejecter(resolve,reject){
    if (Generator[algorithm.name])
      return Generator[algorithm.name].apply(null, arguments);
    else
      return reject(new Error("Algorithm not supported"));
  });
};

module.exports = generateKey;
