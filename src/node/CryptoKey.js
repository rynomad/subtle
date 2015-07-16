//This Class represents a CryptoKey a la w3c webCrypto API


var CryptoKey = function Cryptokey(key,type, exporter, uses, nonce){
  var self = this;
  this.usages = []
  console.log("cryptkey struct begin")

  Object.keys(uses).forEach(function(use){
    self.usages.push(use)
    self["_"+use] = function(){
      var non = arguments[arguments.length - 1]
      if (non != nonce)
        return Promise.reject("Unauthorized")
      else
        return Promise.resolve(uses[use].apply({},arguments));
    }
  });

  if (typeof exporter === "function"){
    this._export = function(){
      console.log("export called", arguments)
      if (arguments[arguments.length-1] != nonce)
        return Promise.reject("Unauthorized")
      else
        return exporter.apply({}, arguments);
    }
    this.exportable = true;
  }
  console.log("CryptKey struct end")
  this.type = type;
  return this;
}

module.exports = CryptoKey;
