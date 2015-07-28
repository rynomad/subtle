#!/bin/bash

if [ "$PURE_JS" == "true" ]
then
    echo "PURE JS"
else
    npm install git+https://github.com/rynomad/ecc.git
fi
