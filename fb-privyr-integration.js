const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuration
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const PRIVYR_API_KEY = process.env.PRIVYR_API_KEY;
const PRIVYR_API_BASE = 'https://app.privyr.com/api';

// Ad set mapping configuration
const AD_SET_MAPPING = {
  'thomson_reserve': {
    name: 'Thomson Reserve - Instant Form - Copy Test',
    leadSource: 'facebook_thomson_reserve',
    campaign: 'thomson_reserve_course',
    formId: 'thomson_reserve_instant_form'
  },
  'thompson': {
    name: 'Thompson Ad Set',
    leadSource: 'facebook_thompson',
    campaign: 'thompson_course'
  },
  // Add more ad sets as needed
};

/**
 * Webhook to receive lead events from Facebook Ads
 */
app.post('/webhook/facebook-leads', async (req, res) => {
  const { entry } = req.body;

  if (!entry) {
    return res.status(200).json({ success: true });
  }

  try {
    for (const item of entry) {
      const leads = item.changes?.[0]?.value?.data || [];

      for (const lead of leads) {
        await processLeadThroughPrivyr(lead, item.id);
      }
    }

    res.status(200).json({ success: true, message: 'Leads processed' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Verify Facebook webhook subscription
 */
app.get('/webhook/facebook-leads', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === FB_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

/**
 * Process lead and send to Privyr
 */
async function processLeadThroughPrivyr(lead, pageId) {
  try {
    // Get lead details from Facebook
    const leadDetails = await getLeadDetails(lead.id);

    // Identify which ad set this lead came from
    const adSetId = leadDetails.ad_set_id;
    const adSetConfig = findAdSetConfig(adSetId);

    // Transform lead data for Privyr
    const privyrLead = transformLeadForPrivyr(leadDetails, adSetConfig);

    // Send to Privyr
    await sendToPrivyr(privyrLead);

    console.log(`✅ Lead ${lead.id} successfully sent to Privyr via ${adSetConfig?.name || 'Unknown Ad Set'}`);
  } catch (error) {
    console.error(`❌ Failed to process lead ${lead.id}:`, error.message);
    throw error;
  }
}

/**
 * Get detailed lead information from Facebook
 */
async function getLeadDetails(leadId) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${leadId}?access_token=${FB_ACCESS_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch lead ${leadId} from Facebook:`, error.message);
    throw error;
  }
}

/**
 * Find ad set configuration based on ad set ID
 */
function findAdSetConfig(adSetId) {
  // Match against known ad set IDs
  for (const [key, config] of Object.entries(AD_SET_MAPPING)) {
    if (adSetId.includes(key) || adSetId.toLowerCase().includes(key)) {
      return config;
    }
  }

  // Return default config if no match
  return {
    name: 'Unknown Ad Set',
    leadSource: 'facebook_unknown',
    campaign: 'unknown'
  };
}

/**
 * Transform Facebook lead data to Privyr format
 */
function transformLeadForPrivyr(fbLead, adSetConfig) {
  const fieldData = fbLead.field_data || [];
  const leadData = {};

  // Map Facebook lead fields to object
  fieldData.forEach(field => {
    leadData[field.name] = field.values?.[0] || '';
  });

  return {
    firstName: leadData['first_name'] || leadData['name']?.split(' ')[0] || '',
    lastName: leadData['last_name'] || leadData['name']?.split(' ')[1] || '',
    email: leadData['email'] || '',
    phone: leadData['phone_number'] || '',
    source: adSetConfig.leadSource,
    campaign: adSetConfig.campaign,
    adSetName: adSetConfig.name,
    rawData: fbLead,
    timestamp: new Date().toISOString()
  };
}

/**
 * Send lead to Privyr
 */
async function sendToPrivyr(lead) {
  try {
    // Demo mode for testing
    if (PRIVYR_API_KEY && PRIVYR_API_KEY.startsWith('test_')) {
      console.log(`\n📧 DEMO MODE: Lead ready for Privyr`);
      console.log(`   Name: ${lead.firstName} ${lead.lastName}`);
      console.log(`   Email: ${lead.email}`);
      console.log(`   Phone: ${lead.phone}`);
      console.log(`   Source: ${lead.source}`);
      console.log(`   Campaign: ${lead.campaign}\n`);
      return {
        success: true,
        message: 'DEMO: Lead processed and ready for Privyr',
        lead: lead
      };
    }

    const response = await axios.post(
      `${PRIVYR_API_BASE}/leads/create`,
      {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        campaign: lead.campaign,
        metadata: {
          adSetName: lead.adSetName,
          originalData: lead.rawData,
          timestamp: lead.timestamp
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${PRIVYR_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data.success) {
      throw new Error(`Privyr API error: ${response.data.error || 'Unknown error'}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Privyr API error:', error.response.status, error.response.data);
    }
    throw error;
  }
}

/**
 * Manual lead sync endpoint (for testing or admin purposes)
 */
app.post('/admin/sync-leads', async (req, res) => {
  const { lead_ids } = req.body;

  if (!lead_ids || !Array.isArray(lead_ids)) {
    return res.status(400).json({ error: 'lead_ids array required' });
  }

  try {
    const results = [];
    for (const leadId of lead_ids) {
      try {
        const leadDetails = await getLeadDetails(leadId);
        const adSetConfig = findAdSetConfig(leadDetails.ad_set_id);
        const privyrLead = transformLeadForPrivyr(leadDetails, adSetConfig);
        await sendToPrivyr(privyrLead);
        results.push({ leadId, status: 'success' });
      } catch (error) {
        results.push({ leadId, status: 'failed', error: error.message });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', integration: 'facebook-privyr' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FB Ads → Privyr Integration running on port ${PORT}`);
  console.log('Configured ad sets:', Object.keys(AD_SET_MAPPING));

  // Auto-run test lead if enabled
  if (process.env.AUTO_TEST === 'true') {
    console.log('\n🧪 Auto-test enabled. Sending test lead in 2 seconds...\n');
    setTimeout(() => {
      require('./auto-test.js');
    }, 2000);
  }
});

module.exports = app;
