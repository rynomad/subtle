var exportKey = function exportKey(format, key, nonce){
  var args = arguments;
  console.log('exportKey args', nonce)
  return new Promise(function rejecter(resolve,reject){
    if (!key._export)
      reject(new Error("operation not supported"));
    else
      resolve(key._export.apply({},args))
  });
};

module.exports = exportKey;
