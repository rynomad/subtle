
var Generator = {}
Generator["RSA-OAEP"] = require("./algorithms/RSA-OAEP.js").generateKey;
Generator["RSASSA-PKCS1-v1_5"] = require("./algorithms/RSASSA-PKCS1-v1_5.js").generateKey;
Generator["ECDH"] = require("./algorithms/ECDH").generateKey;

var generateKey = function generateKey(algorithm){
  console.log("args", algorithm)
  var args = arguments
  return new Promise(function rejecter(resolve,reject){
    if (Generator[algorithm.name])
      return resolve(Generator[algorithm.name].apply(null, args));
    else
      return reject(new Error("Algorithm not supported"));
  });
};

module.exports = generateKey;
