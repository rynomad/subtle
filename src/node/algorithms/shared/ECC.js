var ecc        = require("./ecc.node.js")
  , spkiECCPad = new Buffer("3056301006042b81047006082a8648ce3d030107034200","hex")
  , pkcsPad1   = new Buffer("308187020100301306072A8648CE3D020106082A8648CE3D030107046D306B0201010420", "hex")
  , pkcsPad2   = new Buffer("A144034200", "hex");

function getCurveKey(namedCurve){
  return ("sec" + namedCurve.replace(/-/g, '').toLowerCase() + "r1");
}

function spki_import(publicBytes, alg){
  var publicBytes = publicBytes.slice(spkiECCPad.length);

  return raw_import(publicBytes, alg);
}

function spki_export(Key){
  return Buffer.concat([spkiECCPad, raw_export(Key)]);
}

function raw_export(Key){
  console.log("raw ecc export")
  return new Buffer(Key.PublicKey);
}

function raw_import(publicBytes, alg){
  var curvekey = getCurveKey(alg.namedCurve)
    , curve    = ecc.ECCurves[curvekey];

  curve.legacy = true;

  return new ecc.ECKey(curve, publicBytes, true);
}

function pkcs8_import(privateBytes, algorithm) {
  var curvekey = getCurveKey(algorithm.namedCurve)
    , curve = ecc.ECCurves[curvekey];

  curve.legacy = true;

  return new ecc.ECKey(curve, privateBytes.slice(pkcsPad1.length, pkcsPad1.length + 32), false);
}

function pkcs8_export(Key) {
  return Buffer.concat([pkcsPad1, Key.PrivateKey, pkcsPad2, raw_export(Key)]);
}

function generate(alg){
  var curvekey = getCurveKey(alg.namedCurve)
    , curve = ecc.ECCurves[curvekey];

  curve.legacy = true;

  return new ecc.ECKey(curve);
}

function ECC(Algorithm){
  var formats = Algorithm.formats
    , raw     = formats.raw
    , spki    = formats.spki
    , pkcs8   = formats.pkcs8;

  // attach common generator
  Algorithm.generate = generate;

  //attach import/export for supported formats
  raw.import = raw_import;
  raw.export = raw_export;

  spki.import = spki_import;
  spki.export = spki_export;

  pkcs8.import = pkcs8_import;
  pkcs8.export = pkcs8_export;

  return;
}

module.exports = ECC;
