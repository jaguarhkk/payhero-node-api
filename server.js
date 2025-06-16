import express from 'express';
import cors from 'cors';
import PayHero from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ FIXED: Convert local format to international format
function formatPhone(phone) {
  // Convert local format (07xxxxxxxx) to international format (2547xxxxxxxx)
  if (phone.startsWith('07')) {
    return '254' + phone.slice(1);
  }
  return phone;
}

// Validate local phone format
function isValidKenyanPhone(phone) {
  return /^07\d{8}$/.test(phone);
}

const encodedCredentials = Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64');
const basicAuthToken = `Basic ${encodedCredentials}`;

const PayHeroInstance = new PayHero({
  Authorization: basicAuthToken,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  apiUrl: 'https://pay.pesapal.com/v3',
  callbackUrl: process.env.CALLBACK_URL,
  ipnId: process.env.PAYHERO_IPN_ID
});

app.get('/', (req, res) => {
  res.send('✅ PayHero API is running');
});

app.post('/stk-push', async (req, res) => {
  try {
    const body = { ...req.body };
    body.phone_number = formatPhone(body.phone_number); // ✅ fixed format

    if (!isValidKenyanPhone('0' + body.phone_number.slice(3))) {
      return res.status(400).json({ error: 'Invalid Kenyan phone number format' });
    }

    const response = await PayHeroInstance.makeStkPush(body);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIXED: Proper callback route and response for PayHero
app.post('/payhero-callback', (req, res) => {
  console.log('✅ PayHero callback received:', req.body);

  // Always respond with the expected format
  res.json({
    ResultCode: 0,
    ResultDesc: "Success"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
