var verify = function verify(){
  return new Promise(function rejecter(resolve,reject){
    reject(new Error("operation not supported"));
  });
};

module.exports = verify;
