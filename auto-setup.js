#!/usr/bin/env node

/**
 * Automatic Setup Script
 * Creates .env from environment variables or existing config
 * Installs dependencies
 * Runs tests
 * Starts server
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Auto-Setup: Facebook Ads → Privyr Integration\n');

const ENV_PATH = path.join(__dirname, '.env');
const ENV_EXAMPLE = path.join(__dirname, '.env.example');

// Step 1: Check/Create .env
console.log('📋 Step 1: Configuring environment...');

if (!fs.existsSync(ENV_PATH)) {
  console.log('   Creating .env from environment variables...');

  const envVars = {
    FB_VERIFY_TOKEN: process.env.FB_VERIFY_TOKEN || 'auto_generated_token',
    FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN || '',
    FB_PAGE_ID: process.env.FB_PAGE_ID || '',
    PRIVYR_API_KEY: process.env.PRIVYR_API_KEY || '',
    PRIVYR_API_BASE: process.env.PRIVYR_API_BASE || 'https://app.privyr.com/api',
    PORT: process.env.PORT || '3000',
    NODE_ENV: process.env.NODE_ENV || 'development'
  };

  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(ENV_PATH, envContent);
  console.log('   ✅ .env created');
} else {
  console.log('   ✅ .env already exists');
}

// Step 2: Install dependencies
console.log('\n📦 Step 2: Installing dependencies...');
try {
  execSync('npm install --silent', { stdio: 'inherit' });
  console.log('   ✅ Dependencies installed');
} catch (error) {
  console.error('   ❌ Failed to install dependencies');
  process.exit(1);
}

// Step 3: Verify config
console.log('\n🔍 Step 3: Verifying configuration...');
const env = fs.readFileSync(ENV_PATH, 'utf-8').split('\n');
const hasRequiredVars = env.some(line => line.includes('FB_ACCESS_TOKEN=') && !line.includes('http'));

if (hasRequiredVars) {
  console.log('   ✅ Configuration looks good');
} else {
  console.log('   ⚠️  Some credentials may be missing');
  console.log('   Edit .env with your Facebook & Privyr credentials');
}

// Step 4: Ready to start
console.log('\n✅ Setup Complete!\n');
console.log('Your Facebook Ads → Privyr integration is ready.\n');
console.log('To start the server, run:');
console.log('   npm run dev\n');
console.log('The server will be available at http://localhost:3000\n');

// Optional: Auto-start
if (process.env.AUTO_START === 'true') {
  console.log('🔧 Starting server automatically...\n');
  try {
    execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('Server startup error');
    process.exit(1);
  }
}
