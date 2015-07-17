function tryBrowser (routine, arguments){
  return crypto.subtle[routine].apply(crypto.subtle, arguments);
}

module.exports = tryBrowser
