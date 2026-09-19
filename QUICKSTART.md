# Facebook Ads → Privyr Integration - Quick Start

Get your lead generation working in **5 minutes** ⚡

## TL;DR Setup

### 1. Install & Configure (2 min)
```bash
npm install
cp .env.example .env
# Edit .env with your credentials (see below for how to get them)
```

### 2. Get Your Credentials (2 min)

**Facebook Access Token:**
- Go to [Facebook Developers](https://developers.facebook.com) → Your App → Tools
- Generate a Page Access Token with `leads_retrieval` permission

**Privyr API Key:**
- Log into [Privyr](https://app.privyr.com) → Settings → API & Integrations
- Generate and copy your API key

**Webhook Verify Token:**
- Generate any secure random string: `openssl rand -base64 32`

### 3. Start Server (1 min)
```bash
npm run dev
# Server running on http://localhost:3000
```

### 4. Connect to Facebook (Optional for testing)
To receive real leads, register your webhook:
- [Facebook App Console](https://developers.facebook.com) → Webhooks
- Callback URL: `https://your-domain.com/webhook/facebook-leads`
- Verify Token: (from step 2)

### 5. Test It! 🧪
```bash
# Health check
curl http://localhost:3000/health

# Run test suite
node test-integration.js
```

## Your `.env` File

Create `.env` with these values:

```
FB_VERIFY_TOKEN=your_random_secure_string_here
FB_ACCESS_TOKEN=EAAPxxxxxxxxxxxxxxx
FB_PAGE_ID=123456789
PRIVYR_API_KEY=pk_live_xxxxxxxxxxxxxxx
PRIVYR_API_BASE=https://app.privyr.com/api
PORT=3000
```

## Thompson Ad Set Tracking

The integration automatically tracks your Thompson ad set. To verify it's working:

1. In `fb-privyr-integration.js`, confirm this mapping exists:
```javascript
const AD_SET_MAPPING = {
  'thompson': {
    name: 'Thompson Ad Set',
    leadSource: 'facebook_thompson',
    campaign: 'thompson_course'
  }
};
```

2. Find your actual Thompson ad set ID in [Facebook Ads Manager](https://ads.facebook.com):
   - Open Campaign → Ad Set → URL contains `ams_id=YOUR_AD_SET_ID`

3. Update the key if needed (e.g., if your ID is `act_123456_thompson_ads`, use `thompson_ads` as the key)

## Manual Test: Sync Existing Leads

Already have leads in Facebook? Sync them to Privyr:

```bash
curl -X POST http://localhost:3000/admin/sync-leads \
  -H "Content-Type: application/json" \
  -d '{"lead_ids": ["1234567890", "9876543210"]}'
```

Replace the lead IDs with real ones from Facebook Ads Manager.

## Deployment

Ready for production?

**Heroku:**
```bash
heroku create your-app-name
heroku config:set FB_VERIFY_TOKEN=xxx FB_ACCESS_TOKEN=xxx PRIVYR_API_KEY=xxx
git push heroku main
```

**Docker:**
```bash
docker build -t fb-privyr-integration .
docker run -p 3000:3000 --env-file .env fb-privyr-integration
```

**AWS/Google Cloud/Any VPS:**
1. Upload files
2. `npm install`
3. `npm start` or use PM2/systemd

## Troubleshooting in 30 Seconds

**"Server not running?"** 
```bash
npm run dev  # Check for errors
```

**"Leads not syncing?"**
```bash
node test-integration.js  # Verify configuration
# Check logs for errors
```

**"Wrong ad set?"**
Edit `fb-privyr-integration.js` → update `AD_SET_MAPPING` → restart

**"Can't generate token?"**
Use [Graph API Explorer](https://developers.facebook.com/tools/explorer) to get Facebook token

## What Each File Does

| File | Purpose |
|------|---------|
| `fb-privyr-integration.js` | Main integration server |
| `package.json` | Dependencies & scripts |
| `.env` | Your secret credentials |
| `test-integration.js` | Verify everything works |
| `FB_PRIVYR_SETUP.md` | Detailed setup guide |
| `QUICKSTART.md` | This file! |

## Next Steps

1. ✅ Complete the 5-minute setup above
2. ✅ Run `node test-integration.js` to verify
3. ✅ Deploy to your server
4. ✅ Register webhook in Facebook Console
5. ✅ Test with a lead submission
6. ✅ Verify lead appears in Privyr within 2 seconds

## Common Issues

| Issue | Solution |
|-------|----------|
| Server won't start | Check `.env` exists; run `npm install` |
| Webhook verification fails | Verify token matches in `.env` and Facebook |
| Leads not appearing | Confirm API keys are correct; check logs |
| Thompson ad set not tracked | Update `AD_SET_MAPPING` with correct ad set ID |

---

**Need help?** See `FB_PRIVYR_SETUP.md` for detailed documentation.

**Ready to go?** Start with `npm install && npm run dev` 🚀
