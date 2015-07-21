var Algorithm = require("./abstract")("RSA-OAEP")
  , forge     = require("node-forge")
  , pkcsPad1  = new Buffer([48, 130])
  , pkcsPad2  = new Buffer([2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130])

Algorithm.formats.spki.import = spki_import;
Algorithm.formats.spki.export = spki_export;
Algorithm.formats.pkcs8.import = pkcs8_import;
Algorithm.formats.pkcs8.export = pkcs8_export;
Algorithm.types.public.usage.encrypt = createEncrypt;
Algorithm.types.private.usage.decrypt = createDecrypt;
Algorithm.generate = generate;
Algorithm.checkParams = checkParams;

module.exports = Algorithm;

function pkcs8_pad(privateBytes){
  var off1 = new Buffer([Math.floor(secret.length / 256),((secret.length + 22) % 256) ])
  var off2 = new Buffer([Math.floor(secret.length / 256), (secret.length % 256)])
  return Buffer.concat([pkcsPad1, off1, pkcsPad2, off2, secret]);
}

function pkcs8_unpad(privateBytes){
  return privateBytes.slice(pkcsPad1.length + pkcsPad2.length + 4);
}

function pkcs8_import(privateBytes){
  return { privateKey : forge.pki.privateKeyFromAsn1(forge.asn1.fromDer(pkcs8_unpad(privateBytes).toString("binary")))};
}

function pkcs8_export(privateKey){
  return pkcs8_pad(new Buffer(forge.asn1.toDer(forge.pki.privateKeyToAsn1(privateKey)).bytes(), "binary"));
}

function spki_import(publicBytes){
  return { publicKey : forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(keyBytes.toString("binary")))};
}

function spki_export(publicKey){
  return forge.asn1.toDer(forge.pki.publicKeyToAsn1(publicKey)).bytes();
}

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

function generate(algorithm){
  var exp = 0, pos = 0
  for (var i = algorithm.publicExponent.length - 1 ; i >= 0 ; i--){
    exp += algorithm.publicExponent[i] << (pos * 8);
    pos++;
  }

  return forge.rsa.generateKeyPair({bits: algorithm.modulousLength , e: exp});
}

function checkParams(format, algorithm, usages){
  if (!(algorithm.hash && (algorithm.hash.name === "SHA-256")))
    throw new Error("Unsupported or missing hash name");
  if (!Buffer.isBuffer(algorithm.publicExponent))
    throw new Error("algorithm.publicExponent not a Buffer source");

}
