#!/bin/bash

export VERSION=`npm -v`

if [ "${VERSION:0:1}" == "2" ]
then
    export PURE_JS=true
fi

echo $PURE_JS

if [ "$PURE_JS" == "true" ]
then
    echo "PURE JS"
else
    npm install git+https://github.com/jvanveen/ecc.git#feature/nan-2.1.0
fi
