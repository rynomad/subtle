
var sjcl = require("sjcl");
var CryptoKey = require("../CryptoKey")

function checkAlgorithmAndUsage(algorithm, usages){
  for (var i in usages)
    if ((["encrypt","decrypt"]).indexOf(usages[i]) < 0)
      throw new Error("invalid usages")
}

var Import = {
  "raw": function(keybuf){
    var keyhex = keybuf.toString('hex');
    return new sjcl.cipher.aes(sjcl.codec.hex.toBits(keyhex));
  }
}

var makeUsage = {
  encrypt : function(key){
    return function(alg, data){
      console.log("AES encrypt")
      var iv = sjcl.codec.hex.toBits(alg.iv.toString('hex'));
      var aad = sjcl.codec.hex.toBits(alg.additionalData.toString('hex'));
      var data = sjcl.codec.hex.toBits(data.toString('hex'));
      var cipher = sjcl.mode.gcm.encrypt(key, data , iv, aad, alg.tagLength);
      return new Buffer(sjcl.codec.hex.fromBits(cipher), 'hex');
    }
    // generate the signature

  },
  decrypt : function(key){
    return function(alg,data ){
      console.log("AES DECRYPT?")
      var iv = sjcl.codec.hex.toBits(alg.iv.toString("hex"));
      var aad = sjcl.codec.hex.toBits(alg.additionalData.toString("hex"));
      var cbody = sjcl.codec.hex.toBits(data.toString("hex"));
      var cipher = sjcl.mode.gcm.decrypt(key, cbody, iv, aad, alg.tagLength);
      return new Buffer(sjcl.codec.hex.fromBits(cipher), 'hex');
    }
  }
}

var makeExporter = function(){
  return false;
}

function createCryptoKey(key, type, exportable, usages, nonce){
  var uses = {}, exporter;
  console.log("create begin")
  for (var i in usages)
    uses[usages[i]] = makeUsage[usages[i]](key);

  if (exportable)
    exporter = makeExporter(type,key);

  console.log("create end")
  return new CryptoKey(key, type, exporter, uses, nonce)
}

function importKey(format, key, algorithm, exportable, usages, nonce){
  console.log("AES", algorithm, usages)
  checkAlgorithmAndUsage(algorithm, usages)
  console.log("pass alg & use check", format)
  if (!Import[format]){
    console.log("ER?")
    throw new Error("unsupported import format");
  } else {
    console.log("importing key")
    key = Import[format](key)
    var type = "secret"
    console.log("creating key")
    var key = createCryptoKey(key, type, exportable, usages, nonce)
    console.log("AES key", key)
    return key;
  }
}

module.exports = {
  generateKey : function(){},
  importKey : importKey
}
