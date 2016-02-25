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
    var signature = key.sign(new Buffer(digest, 'hex'));
    // Signature is DER encoded, remove it.
    var decodedSignature = forge.asn1.fromDer(signature.toString("binary"));
    // We take only the last 32 bytes because values could be padded with 0 at the beginning.
    return Buffer.concat([
      new Buffer(decodedSignature.value[0].value, 'binary').slice(-32),
      new Buffer(decodedSignature.value[1].value, 'binary').slice(-32)
    ]);
  };
}

function createVerify(key, alg1){
  return function ECDSA_VERIFY(alg, buf, sig) {
    var forgehashKey = alg.hash.name.replace(/-/g, '').toLowerCase();
    var md = forge.md[forgehashKey].create();
    md.update(buf.toString("binary"));
    var digest = md.digest().getBytes();
    var sigPart1 = sig.slice(0, 32);
    var sigPart2 = sig.slice(32, 64);
    var asn1 = forge.asn1;
    var derSignature = asn1.toDer(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, sigPart1.toString("binary")),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, sigPart2.toString("binary"))
    ])).getBytes();
    return key.verifySignature(new Buffer(digest, 'binary'), new Buffer(derSignature, 'binary'));
  }
}

module.exports = Algorithm;
