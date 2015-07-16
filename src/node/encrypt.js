

var encrypt = function encrypt(alg, key, data, nonce){
  var args = arguments;
  if (!key._encrypt)
    return Promise.reject("Unsupported usage for that key")
  else
    return key._encrypt(alg,data, nonce);
};


module.exports = encrypt;
