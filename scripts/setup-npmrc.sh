#!/bin/bash
# Setup script to create .npmrc for Vercel builds
# This script reads BRYNTUM_NPM_TOKEN from environment and creates .npmrc

set -e

if [ -z "$BRYNTUM_NPM_TOKEN" ]; then
  echo "Warning: BRYNTUM_NPM_TOKEN environment variable is not set"
  echo "Bryntum packages may fail to install"
  exit 1
fi

echo "Setting up .npmrc for Bryntum registry..."

cat > .npmrc << EOF
# Bryntum NPM Registry Configuration
@bryntum:registry=https://npm.bryntum.com
//npm.bryntum.com/:_authToken=${BRYNTUM_NPM_TOKEN}
//npm.bryntum.com/:strict-ssl=false
EOF

echo "✅ .npmrc created successfully"