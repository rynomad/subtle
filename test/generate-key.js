var genKey = require("../src/node/generate-key.js");

var promise = genKey({ name: "RSA-OAEP"
                    , set: "2a"
                    , hash: {name: "SHA-256"}
                    , modulusLength:2048
                    , publicExponent : new Uint8Array([0x01,0x00,0x01])
                    , usage: ["encrypt","decrypt"]
                  }, true, ["sign", "verify"]).then(function(keypair){
                    console.log("got keys", keypair)
                  }).catch(function(err){
                    console.log(err)
                  })
