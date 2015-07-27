var ecc        = require("ecc-jsbn")
  , spkiECCPad = new Buffer("3056301006042b81047006082a8648ce3d030107034200","hex");

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
  return new Buffer(Key.PublicKey);
}

function raw_import(publicBytes, alg){
  var curvekey = getCurveKey(alg.namedCurve)
    , curve    = ecc.ECCurves[curvekey];

  curve.legacy = true;

  return new ecc.ECKey(curve, publicBytes, true);
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
    , spki    = formats.spki;

  // attach common generator
  Algorithm.generate = generate;

  //attach import/export for supported formats
  raw.import = raw_import;
  raw.export = raw_export;

  spki.import = spki_import;
  spki.export = spki_export;

  return;
}

module.exports = ECC;
