#!/bin/bash

# Facebook Ads to Privyr Integration - Automated Setup Script
# Run this once to set up everything

echo "🚀 Facebook Ads → Privyr Integration Setup"
echo "==========================================="
echo ""

# Step 1: Check if .env exists
if [ ! -f .env ]; then
  echo "📋 Creating .env file from template..."
  cp .env.example .env
  echo "✅ .env created"
  echo "⚠️  Please edit .env with your credentials:"
  echo "   - FB_VERIFY_TOKEN"
  echo "   - FB_ACCESS_TOKEN"
  echo "   - FB_PAGE_ID"
  echo "   - PRIVYR_API_KEY"
  echo ""
else
  echo "✅ .env file already exists"
fi

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
if npm install; then
  echo "✅ Dependencies installed"
else
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo ""

# Step 3: Run tests
echo "🧪 Running test suite..."
if node test-integration.js; then
  echo "✅ Tests passed"
else
  echo "⚠️  Some tests failed - check your configuration"
fi
echo ""

# Step 4: Summary
echo "==========================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your Facebook and Privyr credentials"
echo "2. Run: npm run dev"
echo "3. Your server will start on http://localhost:3000"
echo ""
echo "For more info, see:"
echo "  - QUICKSTART.md (5-minute guide)"
echo "  - FB_PRIVYR_SETUP.md (detailed docs)"
echo "==========================================="
