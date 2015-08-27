#!/bin/bash

export VERSION=`node -v`

if [ "${VERSION:0:2}" == "v3" ]
then
    export PURE_JS=true
fi

echo $PURE_JS

if [ "$PURE_JS" == "true" ]
then
    echo "PURE JS"
else
    npm install git+https://github.com/rynomad/ecc.git
fi
