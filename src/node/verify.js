var verify = function verify(alg, key, sig,buf, nonce){
  console.log("VERIFY", nonce)
  if (!key._verify)
    return Promise.reject("not a valid verify key", nonce)
  else
    return Promise.resolve(key._verify(alg, buf,sig, nonce));
};

module.exports = verify;
