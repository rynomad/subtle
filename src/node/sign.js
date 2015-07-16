

var sign = function sign(alg, key, data, nonce){
  console.log("SIGN", alg)
  if (!key._sign)
    return Promise.reject("Unsupported usage for that key")
  else
    return key._sign(alg,data, nonce);
};


module.exports = sign;
