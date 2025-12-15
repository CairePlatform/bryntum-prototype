#!/bin/bash
# Setup .npmrc for Vercel builds
set -e
echo "@bryntum:registry=https://npm.bryntum.com" > .npmrc
echo "//npm.bryntum.com/:_authToken=$BRYNTUM_NPM_TOKEN" >> .npmrc
echo "//npm.bryntum.com/:strict-ssl=false" >> .npmrc
echo "Created .npmrc with token length: ${#BRYNTUM_NPM_TOKEN}"
