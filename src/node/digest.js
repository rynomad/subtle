var forge = require("node-forge")
var subtleToForge = {
  "SHA-256" : "sha256"
}

var digest = function digest(alg, data){
  var name = (typeof alg === 'object') ? alg.name : alg
  if (!subtleToForge[name])
    return Promise.reject("unsupported hashing algorithm")
  else{
    var md = forge.md[subtleToForge[name]].create()
    md.update(data.toString("binary"))

    return new Buffer(md.digest().bytes(), "binary")
  }
};

module.exports = digest;
