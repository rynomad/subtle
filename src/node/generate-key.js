var generateKey = function generateKey(){
  return new Promise(function rejecter(resolve,reject){
    reject(new Error("operation not supported"));
  });
};

module.exports = generateKey;
