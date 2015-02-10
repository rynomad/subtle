var exportKey = function exportKey(){
  return new Promise(function rejecter(resolve,reject){
    reject(new Error("operation not supported"));
  });
};

module.exports = exportKey;
