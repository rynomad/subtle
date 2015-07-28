var Algorithm = require("./abstract")("RSA-OAEP")
  , RSA       = require("./shared/RSA")
  , forge     = require("node-forge")
  , types     = Algorithm.types
  , public    = types.public.usage
  , private   = types.private.usage;

//attached shared RSA
RSA(Algorithm);

Algorithm.checkParams = checkParams;

public.encrypt = createEncrypt;
private.decrypt = createDecrypt;

module.exports = Algorithm;

function createEncrypt(Key){
  return function RSA_OAEP_ENCRYPT(alg,buf){
    return new Buffer(Key.publicKey.encrypt(buf.toString("binary"), "RSA-OAEP"),"binary");
  };
}

function createDecrypt(Key){
  return function RSA_OAEP_DECRYPT(alg,buf){
    return new Buffer(Key.privateKey.decrypt(buf.toString("binary"), "RSA-OAEP"),"binary");
  };
}


function checkParams(format, algorithm, usages){
  //if (!(algorithm.hash && (algorithm.hash.name === "SHA-256")))
    //throw new Error("Unsupported or missing hash name");
  //if (!Buffer.isBuffer(algorithm.publicExponent))
    //throw new Error("algorithm.publicExponent not a Buffer source");

}
