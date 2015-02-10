var unwrapKey = function unwrapKey(){
  return new Promise(function rejecter(resolve,reject){
    reject(new Error("operation not supported"));
  });
};

module.exports = unwrapKey;
