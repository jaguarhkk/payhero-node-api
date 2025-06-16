import express from 'express'; import cors from 'cors'; import PayHero from './index.js'; import dotenv from 'dotenv';

dotenv.config();

const app = express(); const PORT = process.env.PORT || 3000;

app.use(cors()); app.use(express.json());

function formatPhone(phone) { if (phone.startsWith('07')) { return '254' + phone.slice(1); } return phone; }

function isValidKenyanPhone(phone) { return /^07\d{8}$/.test(phone); }

const encodedCredentials = Buffer .from(${process.env.API_USERNAME}:${process.env.API_PASSWORD}) .toString('base64');

const basicAuthToken = Basic ${encodedCredentials};

const PayHeroInstance = new PayHero({ Authorization: basicAuthToken, consumerKey: process.env.CONSUMER_KEY, consumerSecret: process.env.CONSUMER_SECRET, apiUrl: 'https://pay.pesapal.com/v3', callbackUrl: process.env.CALLBACK_URL, ipnId: process.env.PAYHERO_IPN_ID });

app.get('/', (req, res) => { res.send('✅ PayHero API is running'); });

app.post('/stk-push', async (req, res) => { try { const body = { ...req.body }; body.phone_number = formatPhone(body.phone_number);

if (!isValidKenyanPhone('0' + body.phone_number.slice(3))) {
  return res.status(400).json({ error: 'Invalid Kenyan phone number format' });
}

body.amount = 100;
body.channel_id = 2200;
body.provider = "m-pesa";
body.external_reference = "INV-0129";

const response = await PayHeroInstance.makeStkPush(body);
console.log("📤 STK Push Request Sent:", body);
console.log("✅ STK Push Response:", response);
res.json(response);

} catch (error) { console.error("🔥 STK PUSH ERROR:", error.response?.data || error.message); res.status(500).json({ error: error.response?.data || error.message }); } });

app.post('/payhero-callback', (req, res) => { console.log('✅ PayHero callback received:', JSON.stringify(req.body, null, 2)); res.json({ ResultCode: 0, ResultDesc: "Success" }); });

app.listen(PORT, () => { console.log(🚀 Server running on port ${PORT}); });

