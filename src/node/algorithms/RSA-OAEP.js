var forge = require("node-forge")
  , pkcsPad1  = new Buffer([48, 130])
  , pkcsPad2  = new Buffer([2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130]);

module.exports = {
  name : "RSA-OAEP",
  formats : {
    raw  : false,
    jwk  : false,
    spki : {
      import : spki_import,
      export : spki_export,
      types  : [Algorithm.types.public]
    },
    pkcs8 : {
      import : pkcs8_import,
      export : pkcs8_export,
      types  : [Algorithm.types.private]

    }
  },
  types : {
    public  : {
      label   : "public",
      formats : [Algorithm.formats.spki],
      usage   : {
        encrypt   : createEncrypt
      },
      returnLabel : "publicKey"
    },
    private : {
      label   : "private",
      formats : [Algorithm.formats.pkcs8],
      usage   : {
        decrypt   : createDecrypt
      },
      returnLabel : "privateKey"
    }
  },
  usages : {
    sign    : false,
    verify  : false,
    encrypt : Algorithm.types.public,
    decrypt : Algorithm.types.private
  },
  generate        : generate,
  checkParams     : checkParams,
  createExporter  : createExporter
};

function pkcs8_pad(privateBytes){
  var off1 = new Buffer([Math.floor(secret.length / 256),((secret.length + 22) % 256) ])
  var off2 = new Buffer([Math.floor(secret.length / 256), (secret.length % 256)])
  return Buffer.concat([pkcsPad1, off1, pkcsPad2, off2, secret]);
}

function pkcs8_unpad(privateBytes){
  return privateBytes.slice(pkcsPad1.length + pkcsPad2.length + 4);
}

function pkcs8_import(privateBytes){
  return { privateKey : forge.pki.privateKeyFromAsn1(forge.asn1.fromDer(pkcs8_unpad(privateBytes).toString("binary")))}:
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
    throw new Error("Unsupported hash");
}

function createExporter(type, key){
  return function exportKey(format){
    if (Algorithm.formats[format].types.indexOf(Algorithm.types[type]) < 0)
      throw new Error("can't export " + type + " key  in " + format + " format.");

    return Algorithm.formats[format].export(key);
  };
}
