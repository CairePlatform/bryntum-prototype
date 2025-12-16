#!/bin/bash
# Setup script to configure environment for Bryntum NPM token
# This script helps external developers set up their .env file

set -e

echo "🔧 Bryntum NPM Token Setup"
echo ""

# Check if .env already exists
if [ -f .env ]; then
  echo "⚠️  .env file already exists"
  read -p "Do you want to overwrite it? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled. Existing .env file preserved."
    exit 0
  fi
fi

# Check if .env.example exists
if [ ! -f .env.example ]; then
  echo "❌ Error: .env.example file not found"
  echo "Please ensure .env.example exists in the project root"
  exit 1
fi

# Copy .env.example to .env
cp .env.example .env

echo "✅ Created .env file from .env.example"
echo ""
echo "📝 Next steps:"
echo "1. Open .env in your editor"
echo "2. Replace 'your-bryntum-npm-token-here' with your actual Bryntum NPM token"
echo "3. Get your token from: https://bryntum.com (Account Dashboard → NPM Token)"
echo ""
echo "After updating .env, load it in your current shell:"
echo "  export BRYNTUM_NPM_TOKEN=\$(grep \"^BRYNTUM_NPM_TOKEN=\" .env | cut -d'=' -f2)"
echo ""
echo "Or use a tool like 'dotenv' or 'direnv' to automatically load .env files"
echo ""


