function Bufferize (result){
  if (result instanceof ArrayBuffer)
    result = new Uint8Array(result);
  if (result instanceof Uint8Array)
    result = new Buffer(result);

  return result;
}

module.exports = Bufferize;
