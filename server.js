import express from 'express';
import PayHero from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.post('/pesapal/initiate', async (req, res) => {
  try {
    const body = { ...req.body };
    body.phoneNumber = formatPhone(body.phoneNumber);

    if (!isValidKenyanPhone(body.phoneNumber)) {
      return res.status(400).json({ error: 'Invalid Kenyan phone number format' });
    }

    const response = await PayHeroInstance.initiatePesapalPayment(body);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/pesapal/verify/:orderTrackingId', async (req, res) => {
  try {
    const status = await PayHeroInstance.verifyPesapalTransaction(req.params.orderTrackingId);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/payment-callback', (req, res) => {
  console.log('📩 Payment callback received:', req.body);
  // Here you could log to a database, verify status, or trigger an event
  res.sendStatus(200); // Always respond to prevent retries
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
