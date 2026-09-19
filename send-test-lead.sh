#!/bin/bash

# Send Thomson Reserve Test Lead to Integration
# Usage: bash send-test-lead.sh

echo "📨 Sending Thomson Reserve Test Lead..."
echo ""

curl -X POST http://localhost:3000/webhook/facebook-leads \
  -H "Content-Type: application/json" \
  -d @test-lead-thomson.json

echo ""
echo "✅ Test lead sent!"
echo ""
echo "Check your Privyr CRM for:"
echo "  Name: Alex Thomson"
echo "  Email: alex.thomson@example.com"
echo "  Phone: +65-9876-5432"
echo ""
