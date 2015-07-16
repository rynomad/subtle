//This Class represents a CryptoKey a la w3c webCrypto API


var CryptoKey = function Cryptokey(type, key, export, usage){
  var self = this;
  var nonce = arguments.pop()
  this.usages = []

  Object.keys(usage).forEach(function(use){
    this.usages.push(use)
    self["_"+use] = function(){
      if (arguments.pop() != nonce)
        return Promise.reject("Unauthorized")
      else
        return usage[use].apply({},arguments)
  }

  if (typeof export === "function"){
    this._export = export;
    this.exportable = true;
  }
  this.type = type;
}

module.exports = CryptoKey;
