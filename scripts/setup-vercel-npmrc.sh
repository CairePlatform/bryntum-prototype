#!/bin/bash
# Setup .npmrc for Vercel builds
# This script is used by Vercel's installCommand in vercel.json
# It assumes BRYNTUM_NPM_TOKEN is set as an environment variable in Vercel
set -e

if [ -z "$BRYNTUM_NPM_TOKEN" ]; then
  echo "Error: BRYNTUM_NPM_TOKEN environment variable is not set"
  echo "Please set it in your Vercel project settings"
  exit 1
fi

echo "@bryntum:registry=https://npm.bryntum.com" > .npmrc
echo "//npm.bryntum.com/:_authToken=$BRYNTUM_NPM_TOKEN" >> .npmrc
echo "//npm.bryntum.com/:strict-ssl=false" >> .npmrc
echo "✅ Created .npmrc for Bryntum registry"
