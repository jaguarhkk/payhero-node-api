import express from 'express';
import cors from 'cors';
import PayHero from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Validate Kenyan phone number
function formatPhone(phone) {
  if (phone.startsWith('+254')) return '0' + phone.slice(4);
  if (phone.startsWith('254')) return '0' + phone.slice(3);
  return phone;
}

function isValidKenyanPhone(phone) {
  return /^07\d{8}$/.test(phone);
}

const encodedCredentials = Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64');
const basicAuthToken = `Basic ${encodedCredentials}`;

const PayHeroInstance = new PayHero({
  Authorization: basicAuthToken,
  pesapalConsumerKey: process.env.PESAPAL_KEY,
  pesapalConsumerSecret: process.env.PESAPAL_SECRET,
  pesapalApiUrl: 'https://pay.pesapal.com/v3',
  pesapalCallbackUrl: process.env.CALLBACK_URL,
  pesapalIpnId: process.env.PESAPAL_IPN_ID
});

app.get('/', (req, res) => {
  res.send('✅ PayHero API is running');
});

app.post('/stk-push', async (req, res) => {
  try {
    const body = { ...req.body };
    body.phone_number = formatPhone(body.phone_number);

    if (!isValidKenyanPhone(body.phone_number)) {
      return res.status(400).json({ error: 'Invalid Kenyan phone number format' });
    }

    const response = await PayHeroInstance.makeStkPush(body);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Updated callback route
app.post('/payhero-callback', (req, res) => {
  console.log('✅ PayHero callback received:', req.body);

  // Respond with the structure PayHero expects
  res.json({
    ResultCode: 0,
    ResultDesc: "Success"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
