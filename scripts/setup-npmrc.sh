#!/bin/bash
# Setup script to create .npmrc for Bryntum NPM registry
# This script reads BRYNTUM_NPM_TOKEN from environment and creates .npmrc
# Works for both local development and CI/CD (Vercel, etc.)

set -e

if [ -z "$BRYNTUM_NPM_TOKEN" ]; then
  echo "Error: BRYNTUM_NPM_TOKEN environment variable is not set" >&2
  echo "Please set BRYNTUM_NPM_TOKEN before running this script" >&2
  exit 1
fi

# Create .npmrc file
cat > .npmrc << EOF
# Bryntum NPM Registry Configuration
@bryntum:registry=https://npm.bryntum.com
//npm.bryntum.com/:_authToken=${BRYNTUM_NPM_TOKEN}
//npm.bryntum.com/:strict-ssl=false
EOF

echo "✅ .npmrc created successfully"