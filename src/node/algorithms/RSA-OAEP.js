
var makeUsage = {
  encrypt: function makeEncrypt(key){
    return function RSA_OAEP_ENCRYPT(buf){
      return new Buffer(key.publicKey.encrypt(buf.toString("binary"), "RSA-OAEP"),"binary");
    };
  },
  decrypt : function makeDecrypt(key){
    return function RSA_OAEP_DECRYPT(buf){
      return new Buffer(key.privateKey.decrypt(buf.toString("binary"), "RSA-OAEP"),"binary");
    }
  }
}
var pkcsPad1  = new Buffer([48, 130])
var pkcsPad2  = new Buffer([2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130])

function rawToPKCS8(secret){
  var off1 = new Buffer([Math.floor(secret.length / 256),((secret.length + 22) % 256) ])
  var off2 = new Buffer([Math.floor(secret.length / 256), (secret.length % 256)])
  return Buffer.concat([pkcsPad1, off1, pkcsPad2, off2, secret]);
}

var Export = {
  "public": {
    "spki" : function(publicKey){
      return forge.asn1.toDer(forge.pki.publicKeyToAsn1(publicKey)).bytes()
    }
  },
  "private":{
    "pkcs8": function(privateKey){
      var secret = forge.asn1.toDer(forge.pki.privateKeyToAsn1(privateKey)).bytes();
      return rawToPKCS8(secret);
    }
  }
};

var makeExporter = function makeExporter(type, key){
  return function exportKey(format){
    return (Export[type][format]) ? Export[type][format](key)
                                  : throw new Error("unsupported export format");
  }
};

function checkAlgorithmAndUsage(algorithm, usages){
  if (!(algorithm.hash && forge.md[subtleToForge.hash[algorithm.hash.name]]))
    return new Error("unsupported or invalid hash name")
  else {
    for (var i in usages)
      if ((["encrypt","decrypt"]).indexOf(usages[i]) < 0)
        return new Error("cannot make a key with usage: " + usages[i])
  }
}


function generateKey(algorithm, extractable, usages, nonce){
  var err = checkAlgorithmAndUsage(algorithm, usages)
  if (err){
    return Promise.reject(err)
  } else {
    key = makeKeyPair(algorithm)
    var publicUsage = {}, privateUsage = {}
    var exportPrivate, exportPublic, publicEncrypt;
    for (var i in usages){
      if (usages[i] === "encrypt")
        publicUsage.encrypt = makeUsage.encrypt(key);
      else if (usages[i] === "decrypt")
        privateUsage.decrypt = makeUsage.decrypt(key);
    }

    if (exportable){
      exportPrivate = makeExporter.private(key.privateKey);
      exportPublic = makeExporter(key.publicKey);
    }
    return Promise.resolve({
      publicKey : new CryptoKey(key.publicKey, exportPublic, publicUsage, nonce),
      privateKey = new CryptoKey(key.privateKey, exportPrivate, privateUsage, nonce)
    })
  }
}
