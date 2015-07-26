var Algorithm = require("./abstract")("ECDH")
  , ECC       = require("./shared/ECC")
  , forge     = require("node-forge")
  , private   = Algorithm.types.private.usage;

ECC(Algorithm);

Algorithm.checkParams = checkParams;

private.deriveBits = createDeriveBits;

module.exports = Algorithm;


function createDeriveBits(Key){
  return function ECDH_DERIVEBITS(publicKey,nonce){
    return Key.PrivateKey.deriveSharedSecret(Algorithm.formats.raw.import(publicKey._export("raw", nonce)).PublicKey);
  };
}

function checkParams(format, algorithm, usages){
  //if (!(algorithm.hash && (algorithm.hash.name === "SHA-256")))
    //throw new Error("Unsupported or missing hash name");
  //if (!Buffer.isBuffer(algorithm.publicExponent))
    //throw new Error("algorithm.publicExponent not a Buffer source");

}


module.exports = Algorithm;
