
try{
  module.exports = require("ecc-qj");
  console.log("NATIVE LOADED")
} catch (e){
  module.exports = require("ecc-jsbn");
}
