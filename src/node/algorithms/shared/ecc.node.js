
try{
  module.exports = require("ecc-qj");
} catch (e){
  module.exports = require("ecc-jsbn");
}
