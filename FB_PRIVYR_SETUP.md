# Facebook Ads to Privyr Integration Setup Guide

## Overview
This integration automatically captures leads from Facebook Ads campaigns and sends them directly to your Privyr CRM. It specifically handles the Thompson ad set and supports additional ad sets.

## Features
✅ Real-time lead capture from Facebook Ads  
✅ Automatic synchronization with Privyr CRM  
✅ Support for multiple ad sets (Thompson, etc.)  
✅ Webhook verification and security  
✅ Manual lead sync capability  
✅ Error handling and logging  

## Prerequisites
- Node.js v14+ and npm
- Facebook Business Account with ad account access
- Privyr account with API access
- Server with public URL (for webhook)

## Step 1: Get Facebook Credentials

### 1.1 Get Facebook Page Access Token
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Navigate to your app settings
3. Under "Tools & Support", select "Graph API Explorer"
4. Select your Page from the dropdown
5. Generate a Page Access Token with these permissions:
   - `leads_retrieval`
   - `pages_manage_metadata`
6. Copy the access token

### 1.2 Get Lead Ad Form ID(s)
1. In Facebook Ads Manager, go to your lead ad form
2. Click on the form name to open it
3. The URL contains the form ID: `forms/FORM_ID/edit`
4. Note the ad set IDs associated with your campaigns

### 1.3 Create Webhook Verify Token
Generate a secure random string (at least 20 characters):
```bash
openssl rand -base64 32
```

## Step 2: Set Up Privyr API Access

### 2.1 Get Privyr API Key
1. Log in to [Privyr](https://app.privyr.com)
2. Go to Settings → API & Integrations
3. Generate a new API key
4. Copy the API key (keep it secure!)

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your credentials:
```
FB_VERIFY_TOKEN=your_verify_token_from_step_1_3
FB_ACCESS_TOKEN=your_page_access_token_from_step_1_1
FB_PAGE_ID=your_facebook_page_id
PRIVYR_API_KEY=your_privyr_api_key_from_step_2_1
PORT=3000
```

## Step 4: Deploy the Integration

### 4.1 Install Dependencies
```bash
npm install
```

### 4.2 Start the Server
**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## Step 5: Set Up Facebook Webhook

### 5.1 Deploy to Public URL
Your server must be accessible from the internet. Options:
- Deploy to Heroku, AWS, Google Cloud, etc.
- Use ngrok for testing: `ngrok http 3000`
- Use your own domain

### 5.2 Register Webhook in Facebook
1. Go to [Facebook App Dashboard](https://developers.facebook.com/apps)
2. Select your app
3. Go to Messenger → Settings
4. In "Webhooks", click "Add Subscription"
5. Set the Callback URL: `https://your-domain.com/webhook/facebook-leads`
6. Set Verify Token to your `FB_VERIFY_TOKEN`
7. Subscribe to these webhook fields:
   - `leadgen`
   - `lead`
8. Click "Verify and Save"

### 5.3 Subscribe to Lead Ads
1. In your app settings, go to "Webhooks"
2. Click "Add Subscription" if not already done
3. Select "Page" as the object
4. Subscribe to `leadgen` events
5. Save

## Step 6: Configure Ad Set Mapping (Thomson Example)

Edit `fb-privyr-integration.js` and update the `AD_SET_MAPPING`:

```javascript
const AD_SET_MAPPING = {
  'thompson': {
    name: 'Thompson Ad Set',
    leadSource: 'facebook_thompson',
    campaign: 'thompson_course'
  },
  'other_set': {
    name: 'Other Campaign',
    leadSource: 'facebook_other',
    campaign: 'other_campaign'
  }
};
```

**To find your ad set ID:**
1. In Ads Manager, open your campaign
2. Click on the ad set
3. The URL contains: `act_ACCOUNT_ID&ams_id=AD_SET_ID`
4. Note the `AD_SET_ID` and add it to the mapping

## Step 7: Test the Integration

### 7.1 Health Check
```bash
curl http://localhost:3000/health
```

### 7.2 Manual Lead Sync (Testing)
```bash
curl -X POST http://localhost:3000/admin/sync-leads \
  -H "Content-Type: application/json" \
  -d '{"lead_ids": ["123456789", "987654321"]}'
```

### 7.3 Create Test Lead
1. In Facebook Ads Manager, submit a test lead on your lead ad form
2. Check the server logs for processing confirmation
3. Verify the lead appears in Privyr

## Troubleshooting

### Leads Not Appearing in Privyr

**Issue:** Facebook leads arrive but don't sync to Privyr

**Solutions:**
1. Check API key validity in Privyr settings
2. Verify `PRIVYR_API_KEY` is correct in `.env`
3. Review server logs for error messages
4. Confirm webhook is receiving Facebook events

### Webhook Not Verifying

**Issue:** "Webhook verification failed" error

**Solutions:**
1. Verify `FB_VERIFY_TOKEN` matches in both places (`.env` and Facebook app)
2. Check server is publicly accessible (not localhost)
3. Ensure callback URL is exactly: `https://your-domain.com/webhook/facebook-leads`
4. Restart server after changing tokens

### Thompson Ad Set Not Working

**Issue:** Thompson ad set leads not syncing

**Solutions:**
1. Verify ad set ID is in `AD_SET_MAPPING`
2. Check ad set ID matches what's in Facebook Ads Manager
3. Ensure Thompson lead ads have the correct form selected
4. Review logs to see if leads are being captured

### Privyr API Errors

**Issue:** "Privyr API error" in logs

**Solutions:**
1. Verify API key has "leads" permissions in Privyr
2. Check lead data format is correct (email or phone required)
3. Ensure Privyr account has available lead slots
4. Check Privyr API status page

## API Endpoints

### POST /webhook/facebook-leads
Receives lead events from Facebook. Automatically processes and sends to Privyr.

### GET /webhook/facebook-leads
Webhook verification endpoint. Facebook calls this to verify webhook.

### POST /admin/sync-leads
Manually sync specific leads by ID.
```json
{
  "lead_ids": ["123456789", "987654321"]
}
```

### GET /health
Server health check.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `FB_VERIFY_TOKEN` | Webhook security token | `abc123xyz...` |
| `FB_ACCESS_TOKEN` | Facebook page access token | `EAAJ9Zxx...` |
| `FB_PAGE_ID` | Facebook page ID | `123456789` |
| `PRIVYR_API_KEY` | Privyr API authentication key | `pk_live_xxx...` |
| `PRIVYR_API_BASE` | Privyr API endpoint | `https://app.privyr.com/api` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## Security Best Practices

1. **Never commit `.env`** - Add to `.gitignore`
2. **Rotate API keys** - Regularly update Privyr and Facebook tokens
3. **Use HTTPS** - Always deploy on secure connections
4. **Verify tokens** - Webhook always verifies `FB_VERIFY_TOKEN`
5. **Log securely** - Don't log sensitive data in production
6. **Rate limiting** - Implement rate limiting for production

## Monitoring & Logging

The integration logs important events:
- ✅ Successful lead processing
- ❌ Failed API calls
- ⚠️ Missing or invalid data
- 🔄 Webhook verifications

Monitor logs in production:
```bash
# With PM2
pm2 logs fb-privyr-integration

# With Docker
docker logs container_name

# File logging (if configured)
tail -f logs/integration.log
```

## Advanced Configuration

### Multiple Ad Sets
Add more ad sets to `AD_SET_MAPPING`:
```javascript
const AD_SET_MAPPING = {
  'thompson': { /* ... */ },
  'jones': { name: 'Jones Campaign', leadSource: 'facebook_jones', campaign: 'jones_course' },
  'wilson': { name: 'Wilson Campaign', leadSource: 'facebook_wilson', campaign: 'wilson_course' }
};
```

### Custom Field Mapping
Modify `transformLeadForPrivyr()` to map custom fields from Facebook to Privyr.

### Error Notifications
Add email/Slack notifications for failed leads by extending error handling in `processLeadThroughPrivyr()`.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review server logs: `npm run dev`
3. Test webhook manually: `/admin/sync-leads`
4. Verify all credentials in `.env`

---

**Last Updated:** 2026-09-19  
**Integration Version:** 1.0.0  
**Support:** Contact Mobile Editing Club
