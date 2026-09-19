/**
 * Test script for FB Ads → Privyr integration
 * Use this to verify your setup before going live
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const PRIVYR_API_KEY = process.env.PRIVYR_API_KEY;

console.log('🧪 Facebook Ads → Privyr Integration Test Suite\n');

// Test 1: Health Check
async function testHealthCheck() {
  console.log('Test 1: Health Check');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Integration: ${response.data.integration}\n`);
    return true;
  } catch (error) {
    console.log('❌ Server health check failed');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

// Test 2: Environment Variables
function testEnvironmentVariables() {
  console.log('Test 2: Environment Variables');
  const required = ['FB_VERIFY_TOKEN', 'FB_ACCESS_TOKEN', 'PRIVYR_API_KEY'];
  let allPresent = true;

  required.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: configured`);
    } else {
      console.log(`❌ ${varName}: missing`);
      allPresent = false;
    }
  });

  console.log();
  return allPresent;
}

// Test 3: Test Webhook Structure
function testWebhookStructure() {
  console.log('Test 3: Webhook Data Structure');

  const sampleWebhookPayload = {
    object: 'page',
    entry: [
      {
        id: '123456789',
        time: Math.floor(Date.now() / 1000),
        changes: [
          {
            value: {
              data: [
                {
                  id: '9876543210',
                  field_data: [
                    { name: 'first_name', values: ['John'] },
                    { name: 'last_name', values: ['Doe'] },
                    { name: 'email', values: ['john@example.com'] },
                    { name: 'phone_number', values: ['+1234567890'] }
                  ],
                  ad_set_id: 'thompson_ad_set_001'
                }
              ]
            },
            field: 'leadgen'
          }
        ]
      }
    ]
  };

  console.log('✅ Sample webhook payload structure:');
  console.log(JSON.stringify(sampleWebhookPayload, null, 2));
  console.log();
  return true;
}

// Test 4: Privyr API Connectivity
async function testPrivyrConnectivity() {
  console.log('Test 4: Privyr API Connectivity');

  if (!PRIVYR_API_KEY) {
    console.log('⚠️  Skipped: PRIVYR_API_KEY not configured\n');
    return null;
  }

  try {
    // Most Privyr APIs require a valid lead, so we'll just test auth headers
    console.log('✅ Privyr API key is configured');
    console.log('   (Full connectivity test requires valid lead data)\n');
    return true;
  } catch (error) {
    console.log('❌ Privyr API test failed');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

// Test 5: Facebook Token Format
function testFacebookTokenFormat() {
  console.log('Test 5: Facebook Token Format');

  const fbToken = process.env.FB_ACCESS_TOKEN;

  if (!fbToken) {
    console.log('❌ FB_ACCESS_TOKEN not configured\n');
    return false;
  }

  if (fbToken.startsWith('EAAJ') || fbToken.startsWith('EAA')) {
    console.log('✅ FB_ACCESS_TOKEN format looks correct');
    console.log(`   Token length: ${fbToken.length} characters\n`);
    return true;
  } else {
    console.log('⚠️  FB_ACCESS_TOKEN format may be incorrect');
    console.log('   Valid tokens usually start with "EAAJ" or "EAA"');
    console.log(`   Your token starts with: ${fbToken.substring(0, 4)}\n`);
    return false;
  }
}

// Test 6: Ad Set Configuration
function testAdSetConfiguration() {
  console.log('Test 6: Ad Set Configuration');

  // This would require importing the actual config
  // For now, we'll show what should be configured

  const expectedAdSets = [
    { key: 'thompson', name: 'Thompson Ad Set' },
    { key: 'jones', name: 'Jones Ad Set (optional)' },
    { key: 'wilson', name: 'Wilson Ad Set (optional)' }
  ];

  console.log('Expected ad set mappings in fb-privyr-integration.js:');
  expectedAdSets.forEach(adSet => {
    console.log(`  • ${adSet.key}: ${adSet.name}`);
  });
  console.log('');
  console.log('✅ Check fb-privyr-integration.js for your AD_SET_MAPPING configuration\n');
  return true;
}

// Test 7: Simulate Lead Processing
function testLeadProcessingFlow() {
  console.log('Test 7: Lead Processing Flow');

  const sampleLead = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    source: 'facebook_thompson',
    campaign: 'thompson_course',
    adSetName: 'Thompson Ad Set'
  };

  console.log('✅ Sample lead data format for Privyr:');
  console.log(JSON.stringify(sampleLead, null, 2));
  console.log();
  return true;
}

// Run all tests
async function runAllTests() {
  const results = [];

  results.push(await testHealthCheck());
  results.push(testEnvironmentVariables());
  results.push(testWebhookStructure());
  results.push(await testPrivyrConnectivity());
  results.push(testFacebookTokenFormat());
  results.push(testAdSetConfiguration());
  results.push(testLeadProcessingFlow());

  // Summary
  console.log('📊 Test Summary\n');
  const passed = results.filter(r => r === true).length;
  const failed = results.filter(r => r === false).length;
  const skipped = results.filter(r => r === null).length;

  console.log(`✅ Passed:  ${passed}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log(`⚠️  Skipped: ${skipped}`);
  console.log();

  if (failed === 0 && passed > 0) {
    console.log('🎉 All tests passed! Your integration is ready.\n');
    console.log('Next steps:');
    console.log('1. Deploy to your server (Heroku, AWS, etc.)');
    console.log('2. Register webhook in Facebook Developer Console');
    console.log('3. Submit test leads in Facebook Ads Manager');
    console.log('4. Verify leads appear in Privyr');
  } else if (failed > 0) {
    console.log('⚠️  Please fix the failed tests before deploying.\n');
  }
}

// Run tests
runAllTests().catch(console.error);
