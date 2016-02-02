var Algorithm = require("./abstract")("ECDSA")
  , ECC       = require("./shared/ECC")
  , forge     = require("node-forge")
  , types     = Algorithm.types
  , public    = types.public.usage
  , private   = types.private.usage;

ECC(Algorithm);

Algorithm.checkParams = checkParams;

public.verify = createVerify;
private.sign  = createSign;

module.exports = Algorithm;

function checkParams(format, algorithm, usages) {
}

function createSign(key, alg1) {
  return function ECDSA_SIGN(alg, buf) {

  };
}

function createVerify(key, alg1){
  return function ECDSA_VERIFY(alg, buf, sig) {

  }
}

module.exports = Algorithm;
