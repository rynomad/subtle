var deriveBits = function encrypt(alg, key, data, nonce){
  var args = arguments;
  if (!key._deriveBits)
    return Promise.reject(key)
  else
    return key._deriveBits(alg.public,data, nonce);
};

module.exports = deriveBits;
