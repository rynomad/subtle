//This Class represents a CryptoKey a la w3c webCrypto API


var CryptoKey = function Cryptokey(key,type, exporter, uses, nonce){
  var self = this;
  this.usages = []

  Object.keys(uses).forEach(function(use){
    self.usages.push(use)
    self["_"+use] = function(buf, non){
      if (non != nonce)
        return Promise.reject("Unauthorized")
      else
        return Promise.resolve(uses[use].apply({},[buf]));
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
  this.type = type;
}

module.exports = CryptoKey;
