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

function pad(buffer) {
  if (buffer[0] & 0x80) {
    // If the value starts with 1, we prepend a 0 to assure it is interpreted as a positive number.
    return Buffer.concat([new Buffer([0]), buffer])
  }
  else {
    return buffer;
  }
}

function createVerify(key, alg1){
  return function ECDSA_VERIFY(alg, buf, sig) {
    var forgehashKey = alg.hash.name.replace(/-/g, '').toLowerCase();
    var md = forge.md[forgehashKey].create();
    md.update(buf.toString("binary"));
    var digest = md.digest().getBytes();
    var sigPart1 = pad(sig.slice(0, 32));
    var sigPart2 = pad(sig.slice(32, 64));
    var asn1 = forge.asn1;
    var integer1 = sigPart1.toString("binary");
    var integer2 = sigPart2.toString("binary");
    var derSignature = asn1.toDer(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, integer1),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, integer2)
    ])).getBytes();
    return key.verifySignature(new Buffer(digest, 'binary'), new Buffer(derSignature, 'binary'));
  }
}

module.exports = Algorithm;
