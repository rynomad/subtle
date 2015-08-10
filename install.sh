#!/bin/bash

export VERSION=`node -v`

if [ "$VERSION" == "v3.0.0" ]
then
    export PURE_JS=true
fi

if [ "$PURE_JS" == "true" ]
then
    echo "PURE JS"
else
    npm install git+https://github.com/rynomad/ecc.git
fi
