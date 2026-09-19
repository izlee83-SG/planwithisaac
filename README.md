# Facebook Ads to Privyr CRM Integration

Automatically capture leads from Facebook Ads campaigns and sync them to Privyr CRM in real-time.

## What This Does

🎯 **Captures** leads from your Facebook Ads  
📱 **Syncs** them instantly to Privyr CRM  
🔄 **Automates** Thompson ad set and other campaigns  
✅ **Verifies** all leads are properly formatted  
📊 **Tracks** lead sources and campaigns  

## Quick Start (30 seconds)

```bash
# 1. Copy configuration template
cp .env.example .env

# 2. Edit .env with your credentials
# (Add your Facebook token and Privyr API key)

# 3. Install and start
npm install
npm run dev
```

Server runs on `http://localhost:3000` 🚀

## What You Get

### Endpoints
- `POST /webhook/facebook-leads` - Receives leads from Facebook
- `POST /admin/sync-leads` - Manually sync leads (for testing)
- `GET /health` - Server status check

### Lead Data Flow
```
Facebook Lead Form
        ↓
   Webhook Event
        ↓
   Data Processing
        ↓
   Privyr API
        ↓
    CRM Contact
```

### Features
✅ Real-time webhook processing  
✅ Automatic lead transformation  
✅ Multi-campaign support (Thompson, Jones, Wilson, etc.)  
✅ Error handling and retry logic  
✅ Lead source tracking  
✅ Comprehensive logging  
✅ Health monitoring  

## Setup Guide

### 1. Get Credentials

**Facebook:**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create/select an app
3. Generate Page Access Token with `leads_retrieval` permission

**Privyr:**
1. Log into [Privyr](https://app.privyr.com)
2. Settings → API & Integrations
3. Generate API key

**Webhook Token:**
```bash
openssl rand -base64 32
```

### 2. Configure

```bash
cp .env.example .env
```

Edit `.env`:
```
FB_VERIFY_TOKEN=your_random_token_here
FB_ACCESS_TOKEN=EAAJ9Zxxxxxxxxxx
FB_PAGE_ID=123456789
PRIVYR_API_KEY=pk_live_xxxxxxxxxxxxx
PORT=3000
```

### 3. Deploy

**Local Development:**
```bash
npm install
npm run dev
```

**Production - Heroku:**
```bash
heroku create your-app-name
heroku config:set FB_VERIFY_TOKEN=xxx FB_ACCESS_TOKEN=xxx PRIVYR_API_KEY=xxx
git push heroku main
```

**Production - Docker:**
```bash
docker build -t fb-privyr .
docker run -p 3000:3000 --env-file .env fb-privyr
```

### 4. Register Webhook

1. [Facebook App Console](https://developers.facebook.com/apps)
2. Webhooks → Add Subscription
3. Callback URL: `https://your-domain.com/webhook/facebook-leads`
4. Verify Token: (from your `.env`)
5. Subscribe to: `leadgen` events

## File Reference

| File | Purpose |
|------|---------|
| `fb-privyr-integration.js` | Main server and integration logic |
| `package.json` | Dependencies and scripts |
| `.env.example` | Configuration template |
| `.env` | Your actual config (CREATE THIS) |
| `CLAUDE.md` | Claude Code project guide |
| `QUICKSTART.md` | 5-minute quick start |
| `FB_PRIVYR_SETUP.md` | Detailed setup documentation |
| `test-integration.js` | Configuration test suite |
| `setup.sh` | Automated setup script |
| `Makefile` | Common commands |
| `Dockerfile` | Docker container configuration |

## Commands

```bash
# Install dependencies
npm install

# Development server (auto-restart on changes)
npm run dev

# Production server
npm start

# Run tests
npm run test
# or
node test-integration.js

# Run setup wizard
bash setup.sh

# Using Make
make setup    # Full setup
make dev      # Start server
make test     # Run tests
make clean    # Remove node_modules
```

## Tracking Thompson Ad Set

The integration comes pre-configured for your Thompson ad set:

```javascript
'thompson': {
  name: 'Thompson Ad Set',
  leadSource: 'facebook_thompson',
  campaign: 'thompson_course'
}
```

Leads from Thompson automatically get tagged with:
- **Source:** `facebook_thompson`
- **Campaign:** `thompson_course`
- **Ad Set Name:** `Thompson Ad Set`

## Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Run Full Test Suite
```bash
node test-integration.js
```

### Manual Lead Sync (Testing)
```bash
curl -X POST http://localhost:3000/admin/sync-leads \
  -H "Content-Type: application/json" \
  -d '{"lead_ids": ["123456789"]}'
```

## Troubleshooting

### Server won't start
```bash
# Check port 3000 is free
lsof -i :3000
# Kill if needed: kill -9 <PID>
```

### Webhook verification fails
- Verify `FB_VERIFY_TOKEN` matches in `.env` and Facebook Console
- Check callback URL is exactly: `https://your-domain.com/webhook/facebook-leads`
- Restart server after changing tokens

### Leads not syncing to Privyr
- Verify `PRIVYR_API_KEY` is correct and has "leads" permissions
- Check server logs: `npm run dev`
- Run test suite: `node test-integration.js`
- Ensure lead has email or phone number

### Port already in use
```bash
# Change port in .env
PORT=8000
```

## Architecture

```
┌─────────────────┐
│  Facebook Ads   │
│  Lead Form      │
└────────┬────────┘
         │ (webhook)
         ↓
┌──────────────────────────────┐
│  fb-privyr-integration.js    │
│  ✓ Verify token              │
│  ✓ Parse Facebook data       │
│  ✓ Transform to Privyr format│
│  ✓ Handle errors             │
└────────┬─────────────────────┘
         │ (API call)
         ↓
┌──────────────────┐
│  Privyr CRM      │
│  Contact Created │
└──────────────────┘
```

## Logs

The server logs important events:
- ✅ Lead successfully synced
- ❌ Failed API calls
- ⚠️ Missing or invalid data
- 🔄 Webhook verifications

Monitor in development:
```bash
npm run dev
# Logs appear in terminal
```

## Support

For questions or issues:
1. Check `FB_PRIVYR_SETUP.md` for detailed guide
2. Run `node test-integration.js` to verify config
3. Check server logs: `npm run dev`
4. Verify credentials in `.env`

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `FB_VERIFY_TOKEN` | Yes | `abc123xyz...` |
| `FB_ACCESS_TOKEN` | Yes | `EAAJ9Zxx...` |
| `FB_PAGE_ID` | Yes | `123456789` |
| `PRIVYR_API_KEY` | Yes | `pk_live_xxx...` |
| `PRIVYR_API_BASE` | No | `https://app.privyr.com/api` |
| `PORT` | No | `3000` |
| `NODE_ENV` | No | `development` |

## License

MIT

---

**Ready to go?** 

1. Copy `.env.example` → `.env`
2. Add your credentials
3. Run `npm run dev`
4. Register webhook in Facebook Console

That's it! Your leads now sync automatically. 🎉
