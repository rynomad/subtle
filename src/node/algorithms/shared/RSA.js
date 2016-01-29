var forge = require("node-forge")
  , pkcsPad1  = new Buffer([48, 130])
  , pkcsPad2  = new Buffer([2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130])

function pkcs8_pad(privateBytes){
  var off1 = new Buffer([Math.floor(privateBytes.length / 256),((privateBytes.length + 22) % 256) ])
  var off2 = new Buffer([Math.floor(privateBytes.length / 256), (privateBytes.length % 256)])
  return Buffer.concat([pkcsPad1, off1, pkcsPad2, off2, privateBytes]);
}

function pkcs8_unpad(privateBytes){
  return privateBytes.slice(pkcsPad1.length + pkcsPad2.length + 4);
}

function pkcs8_import(privateBytes){
  return { privateKey : forge.pki.privateKeyFromAsn1(forge.asn1.fromDer(pkcs8_unpad(privateBytes).toString("binary")))};
}

function pkcs8_export(Key){
  return pkcs8_pad(new Buffer(forge.asn1.toDer(forge.pki.privateKeyToAsn1(Key.privateKey)).bytes(), "binary"));
}

function spki_import(publicBytes){
  return { publicKey : forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(publicBytes.toString("binary")))};
}

function spki_export(Key){
  return new Buffer(forge.asn1.toDer(forge.pki.publicKeyToAsn1(Key.publicKey)).bytes(),"binary");
}

function generate(algorithm){
  var exp = 0, pos = 0
  for (var i = algorithm.publicExponent.length - 1 ; i >= 0 ; i--){
    exp += algorithm.publicExponent[i] << (pos * 8);
    pos++;
  }

  return forge.rsa.generateKeyPair({bits: algorithm.modulusLength , e: exp});
}


function RSA(Algorithm){
  var formats = Algorithm.formats
    , spki    = formats.spki
    , pkcs8   = formats.pkcs8


  // attach common generator
  Algorithm.generate = generate;

  //attach import/export for supported formats
  spki.import = spki_import;
  spki.export = spki_export;

  pkcs8.import = pkcs8_import;
  pkcs8.export = pkcs8_export;

  return;
}

module.exports = RSA;
