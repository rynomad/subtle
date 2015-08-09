//This Class represents a CryptoKey a la w3c webCrypto API


var CryptoKey = function Cryptokey(key,type, exporter, uses, nonce){
  var self = this;
  this.usages = []

  Object.keys(uses).forEach(function(use){
    self.usages.push(use)
    self["_"+use] = function(){
      var non = arguments[arguments.length - 1]
      if (non != nonce)
        return Promise.reject("Unauthorized use")
      else
        return Promise.resolve(uses[use].apply({},arguments));
    }
  });

  if (typeof exporter === "function"){
    this._export = function(){
      var non = arguments[arguments.length-1]
      if ( non != nonce)
        return Promise.reject("Unauthorized export")
      else
        return exporter.apply({}, arguments);
    }
    this.exportable = true;
  }
  this.type = type;
  return this;
}

module.exports = CryptoKey;
