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
    var forgehashKey = alg.hash.name.replace(/-/g, '').toLowerCase();
    var md = forge.md[forgehashKey].create();
    md.update(buf.toString("binary"));
    var digest = md.digest().toHex();
    return key.sign(new Buffer(digest, 'hex'));
  };
}

function createVerify(key, alg1){
  return function ECDSA_VERIFY(alg, buf, sig) {
    var forgehashKey = alg.hash.name.replace(/-/g, '').toLowerCase();
    var md = forge.md[forgehashKey].create();
    md.update(buf.toString("binary"));
    var digest = md.digest().getBytes();
    return key.verifySignature(new Buffer(digest, 'binary'), sig);
  }
}

module.exports = Algorithm;
