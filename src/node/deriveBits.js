var deriveBits = function deriveBits(alg, key, data, nonce){
  var args = arguments;
  if (!key._deriveBits)
    return Promise.reject(new Error("cannot deriveBits from this key"))
  else
    return key._deriveBits(alg,data, nonce);
};

module.exports = deriveBits;
