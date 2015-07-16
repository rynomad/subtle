var CryptoKey = require("../CryptoKey.js")

var subtleToForge = {
  hash:{
    "SHA-256" : "sha256"
  }
}

var MakeUsage = {}
  sign : function(secretKey, hash){
    return function RSASign(){
      var hsh = subtleToForge[hash.name]
      if (!forge.md[hsh])
        return Promise.reject(new Error("Unsupported hash"))
      else{
        var md = forge.md[hsh].create()
        md.update(buf.toString("binary"));
      }
        var md = forge.md.sha256.create();      return new Buffer(secretKey.sign(md),"binary");
    }
  }
  , verify: function(){}
  , encrypt: function(){}
  ,decrypt : function(){

  }
}

function generateKey(algorithm, extractable, usages, nonce){
  var exp = 0, pos = 0
  for (var i = algorithm.publicExponent.length - 1 ; i >= 0 ; i--){
    exp += algorithm.publicExponent[i] << (pos * 8);
    pos++;
  }
  key = forge.rsa.generateKeyPair({bits: algorithm.modulousLength , e: exp});
  var usage = {}
  try {
    for (var i in usages)
      usage[usages[i]] = MakeUsage[usages[i]](key)
  } catch (e){
    reject(new Error("unsupported key usage"))
  }

  resolve({
    publicKey  : new CryptoKey("public", key.publicKey, exportable, usage, nonce)
    , privateKey : new CryptoKey("private", key.privateKey, exportable, usage, nonce)
  });
}
