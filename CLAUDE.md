# Facebook Ads to Privyr Integration - Claude Code Guide

## Project Overview
Automatic lead capture from Facebook Ads campaigns and sync to Privyr CRM. Handles Thompson ad set and supports multiple campaigns.

## Quick Commands

### Start Development Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### Run Tests
```bash
npm run test
# or manually:
node test-integration.js
```

### Install Dependencies
```bash
npm install
```

## Setup Checklist

- [ ] Run `npm install` to install dependencies
- [ ] Create `.env` file from `.env.example`
- [ ] Add Facebook Access Token to `.env`
- [ ] Add Privyr API Key to `.env`
- [ ] Add Facebook Verify Token to `.env`
- [ ] Add Facebook Page ID to `.env`
- [ ] Run `npm run dev` to start server
- [ ] Run test suite: `node test-integration.js`

## File Structure

```
planwithisaac/
├── fb-privyr-integration.js    # Main integration server
├── package.json                # Dependencies & scripts
├── .env.example                # Configuration template
├── .env                        # Your actual config (CREATE THIS)
├── test-integration.js         # Test suite
├── CLAUDE.md                   # This file
├── QUICKSTART.md               # 5-minute setup guide
├── FB_PRIVYR_SETUP.md          # Detailed documentation
└── course-landing-page.html    # Landing page
```

## Configuration

### Required Environment Variables
```
FB_VERIFY_TOKEN       = Webhook security token
FB_ACCESS_TOKEN       = Facebook page access token
FB_PAGE_ID            = Your Facebook page ID
PRIVYR_API_KEY        = Privyr CRM API key
PORT                  = Server port (default: 3000)
```

See `.env.example` for template.

## Key Features

✅ **Real-time Lead Capture** - Webhook receiver for Facebook lead ads  
✅ **Auto Sync to Privyr** - Leads instantly go to your CRM  
✅ **Thompson Ad Set** - Pre-configured for your main campaign  
✅ **Multi-Campaign** - Add more ad sets easily  
✅ **Error Handling** - Robust logging and retry logic  
✅ **Test Suite** - Verify configuration before deployment  

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/webhook/facebook-leads` | POST | Receive Facebook lead events |
| `/webhook/facebook-leads` | GET | Webhook verification |
| `/admin/sync-leads` | POST | Manually sync leads (testing) |
| `/health` | GET | Health check |

## Troubleshooting

### Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill process if needed: kill -9 <PID>
```

### Dependencies Missing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Test Suite Fails
```bash
# Run with verbose output
node test-integration.js
# Check .env file exists and has all keys
```

## Next Steps

1. **Local Testing** - Start with `npm run dev` and `node test-integration.js`
2. **Add Credentials** - Copy `.env.example` → `.env` and fill in your keys
3. **Deploy** - Push to Heroku, AWS, or your server
4. **Register Webhook** - Configure in Facebook Developer Console
5. **Test with Real Leads** - Submit a test lead and verify in Privyr

## Useful Links

- [Facebook Developers](https://developers.facebook.com)
- [Privyr Dashboard](https://app.privyr.com)
- [Ads Manager](https://ads.facebook.com)
- Full Setup Guide: See `FB_PRIVYR_SETUP.md`
- Quick Start: See `QUICKSTART.md`

## Common Tasks

### Add a New Ad Set
Edit `fb-privyr-integration.js` → Update `AD_SET_MAPPING`:
```javascript
const AD_SET_MAPPING = {
  'thompson': { name: 'Thompson Ad Set', ... },
  'new_set': { name: 'New Campaign', leadSource: 'facebook_new', campaign: 'new_campaign' }
};
```

### Change Server Port
Edit `.env`:
```
PORT=8000
```

### Run on Different Node Version
```bash
nvm use 18  # or your preferred version
npm run dev
```

## Development Notes

- Server auto-restarts with `npm run dev` when files change
- Logs show all webhook activity and Privyr sync status
- Test suite validates configuration without external API calls
- Error handling catches and logs all failures for debugging

---

**Ready to go?** Just run `npm run dev` and you're live! 🚀
