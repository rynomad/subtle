var subtle = require("../src/main.js");
var PAIR1, PAIR2, SIG, CRYPTED;
var promise = subtle.generateKey({ name: "RSA-OAEP"
                    , set: "2a"
                    , hash: {name: "SHA-256"}
                    , modulusLength:2048
                    , publicExponent : new Buffer([0x01,0x00,0x01])
                    , usage: ["encrypt","decrypt"]
                  }, true, ["encrypt", "decrypt"]).then(function(keypair){
                    console.log("got keys", keypair)
                    PAIR1 = keypair
                    return subtle.encrypt({name: "RSA-OAEP"},keypair.publicKey,new Buffer("string"))
                  }).then(function(crypted){
                    CRYPTED = crypted;
                    return subtle.decrypt({name: "RSA-OAEP"},PAIR1.privateKey, crypted)
                  }).then(function(dec){
                    console.log(dec.toString())
                  }).then(function(){
                    return subtle.generateKey({
                      name : "RSASSA-PKCS1-v1_5"
                      , hash: {name: "SHA-256"}
                      , modulusLength:2048
                      , publicExponent : new Buffer([0x01,0x00,0x01])
                    }, true, ["sign","verify"]);
                  }).then(function(key){
                    PAIR2 = key
                    return subtle.sign({name : "RSASSA-PKCS1-v1_5" ,hash:{name:"SHA-256"}}, key.privateKey, new Buffer("signme") );

                  }).then(function(sig){
                    SIG = sig
                    return subtle.verify({name : "RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}}, PAIR2.publicKey, sig,new Buffer("signme"))
                  }).then(function(ver){
                    console.log("VERIFIED")
                    return Promise.all([
                      subtle.exportKey("pkcs8", PAIR1.privateKey),
                      subtle.exportKey("spki", PAIR2.publicKey)
                      ])
                  }).then(function(keys){
                    return Promise.all([
                      subtle.importKey("pkcs8", keys[0],  {  name: "RSA-OAEP", hash: {name: "SHA-256"}}, true, ["decrypt"]),
                      subtle.importKey("spki", keys[1], {  name: "RSASSA-PKCS1-v1_5", hash: {name: "SHA-256"}}, true, ["verify"])
                      ])
                  }).then(function(keys){
                    return Promise.all([
                      subtle.decrypt({name: "RSA-OAEP"}, keys[0], CRYPTED),
                      subtle.verify({name : "RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}}, keys[1], SIG,new Buffer("signme")),
                      ])
                  }).then(function(done){
                    console.log(done)
                  }).catch(function(err){
                    console.log(err.stack)
                  })
