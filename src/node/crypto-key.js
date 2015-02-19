//This Class represents a CryptoKey a la w3c webCrypto API


var CryptoKey = function Cryptokey(type, key, exportable, usages){
  this.usages = usages;
  this.type = type;
  this.exportable = exportable;
  if (this.exportable){
    this._getKey = function(){return key};
  }
}

module.exports = CryptoKey;
