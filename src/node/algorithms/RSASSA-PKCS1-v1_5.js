var Algorithm = require("./abstract")("RSASSA-PKCS1-v1_5")
  , RSA       = require("./shared/RSA")
  , forge     = require("node-forge")
  , types     = Algorithm.types
  , public    = types.public.usage
  , private   = types.private.usage;

//attached shared RSA
RSA(Algorithm);

Algorithm.checkParams = checkParams;

public.verify = createVerify;
private.sign  = createSign;

module.exports = Algorithm;

function createSign(key){
  return function SIGN_RSASSA_PKCS1_v1_5(alg,buf){
    var forgehashKey = alg.hash.name.replace(/-/g, '').toLowerCase();
    var md = forge.md[forgehashKey].create();
    md.update(buf.toString("binary"));
    return new Buffer(key.privateKey.sign(md),"binary");
  };
}

function createVerify(key){
  return function RSASSA_VERIFY(alg,buf, sig){
    var forgehashKey = alg.hash.name.replace(/-/g, '').toLowerCase();
    var md = forge.md[forgehashKey].create();
    md.update(buf.toString("binary"));
    var bytes = md.digest().bytes()
    return key.publicKey.verify(bytes, sig.toString("binary"));
  }
}

function checkParams(algorithm){
  return;
}
