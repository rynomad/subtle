function throwError(){
  throw new Error("NOT IMPLIMENTED")
}


function createAlgorithm(name) {
  //warn that there's no parameter checking
  function checkParams(){
    console.log("WARNING: " + name + "isn't checking parameters... bad things might happen");
    return true;
  }
  //generic exporter function
  function createExporter(type, key){
    return function exportKey(format){
      if (Algorithm.formats[format].types.indexOf(Algorithm.types[type]) < 0)
        throw new Error("can't export " + type.label + " key  in " + format + " format.");

      return Algorithm.formats[format].export(key);
    };
  }

  var Algorithm = {
      name : name,
      formats : {
        raw  : {
          import : throwError,
          export : throwError,
          types  : []
        },
        jwk  : {
          import : throwError,
          export : throwError,
          types  : []
        },
        spki : {
          import : throwError,
          export : throwError,
          types  : []
        },
        pkcs8 : {
          import : throwError,
          export : throwError,
          types  : []
        }
      },
      types : {
        public  : {
          label   : "public",
          formats : [],
          usage   : {
            encrypt   : null,
            verify    : null
          },
          returnLabel : "publicKey"
        },
        private : {
          label   : "private",
          formats : [],
          usage   : {
            decrypt   : null,
            sign      : null
          },
          returnLabel : "privateKey"
        },
        secret  : {
          label   : "secret",
          formats : [],
          usage   : {
            encrypt : null,
            decrypt : null,
            sign    : null,
            verify  : null
          }
        }
      },
      usages : {
        sign       : [],
        verify     : [],
        encrypt    : [],
        decrypt    : [],
        deriveKey  : [],
        deriveBits : [],
      },
      generate        : throwError,
      checkParams     : checkParams,
      createExporter  : createExporter,
    }

    , types   = Algorithm.types
    , secret  = types.secret
    , public  = types.public
    , private = types.private

    , formats = Algorithm.formats
    , jwk     = formats.jwk
    , raw     = formats.raw
    , spki    = formats.spki
    , pkcs8   = formats.pkcs8

    , usages  = Algorithm.usages
    , sign    = usages.sign
    , verify  = usages.verify
    , encrypt = usages.encrypt
    , decrypt = usages.decrypt
    , deriveKey  = usages.deriveKey
    , deriveBits = usages.deriveBits;


  // reference appropriate formats for each key type
  private.formats.push(pkcs8);
  private.formats.push(jwk);

  public.formats.push(spki)
  public.formats.push(jwk);

  secret.formats.push(raw)
  secret.formats.push(jwk);

  // reference appropriate key types for each format
  jwk.types.push(secret);
  jwk.types.push(public);
  jwk.types.push(private);

  raw.types.push(secret);
  raw.types.push(private);
  raw.types.push(public);

  spki.types.push(public);

  pkcs8.types.push(private);

  // reference appropriate key types for each usage
  sign.push(secret);
  sign.push(private);

  verify.push(secret);
  verify.push(public);

  encrypt.push(secret);
  encrypt.push(public);

  decrypt.push(secret);
  decrypt.push(private);

  deriveKey.push(private);

  deriveBits.push(private);

  return Algorithm;
}

module.exports = createAlgorithm;
