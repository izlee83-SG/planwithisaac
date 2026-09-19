#!/usr/bin/env node

/**
 * Auto Test - Sends test lead automatically
 * Runs when server starts if AUTO_TEST=true
 */

const http = require('http');

const testLead = {
  object: "page",
  entry: [
    {
      id: "123456789",
      time: Math.floor(Date.now() / 1000),
      changes: [
        {
          value: {
            form_id: "thomson_reserve_instant_form",
            form_name: "Thomson Reserve - Instant Form - Copy Test",
            data: [
              {
                id: `thomson_test_lead_${Date.now()}`,
                field_data: [
                  { name: "first_name", values: ["Alex"] },
                  { name: "last_name", values: ["Thomson"] },
                  { name: "email", values: ["alex.thomson@example.com"] },
                  { name: "phone_number", values: ["+65-9876-5432"] }
                ],
                ad_set_id: "act_123456789_thomson_reserve_instant",
                ad_set_name: "Thomson Reserve - Instant Form - Copy Test",
                created_time: Math.floor(Date.now() / 1000)
              }
            ]
          },
          field: "leadgen"
        }
      ]
    }
  ]
};

function sendTestLead() {
  const payload = JSON.stringify(testLead);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/webhook/facebook-leads',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('\n📨 Auto Test Lead Sent!');
      console.log('─────────────────────────');
      console.log('Lead: Alex Thomson');
      console.log('Email: alex.thomson@example.com');
      console.log('Phone: +65-9876-5432');
      console.log('Form: Thomson Reserve - Instant Form - Copy Test');
      console.log('─────────────────────────');
      console.log('Status:', res.statusCode === 200 ? '✅ SUCCESS' : '❌ FAILED');
      console.log('Response:', data);
      console.log('─────────────────────────\n');

      if (res.statusCode === 200) {
        console.log('🎉 Lead processed! Check Privyr CRM.\n');
      }
    });
  });

  req.on('error', (e) => {
    console.error('Error sending test lead:', e.message);
  });

  req.write(payload);
  req.end();
}

// Wait for server to start, then send test lead
if (process.env.AUTO_TEST === 'true') {
  setTimeout(sendTestLead, 2000);
}
