import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import PayHero from 'payhero-wrapper';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Fix: Properly encode credentials for basic auth
const encodedCredentials = Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64');
const basicAuthToken = `Basic ${encodedCredentials}`;

// Initialize PayHero SDK
const payHero = new PayHero({
  Authorization: basicAuthToken,
  pesapalConsumerKey: process.env.PESAPAL_CONSUMER_KEY,
  pesapalConsumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
  pesapalApiUrl: process.env.PESAPAL_API_URL,
  pesapalCallbackUrl: process.env.PESAPAL_CALLBACK_URL,
  pesapalIpnId: process.env.PESAPAL_IPN_ID
});

// STK Push Endpoint
app.post('/stk', async (req, res) => {
  try {
    const { phone } = req.body;

    const paymentDetails = {
      amount: 100, // fixed amount
      PhoneNumber: phone,
      channel: 2552,
      provider: "m-pesa",
      external_reference: "INV-1001",
      callback_url: process.env.CALLBACK_URL
    };

    const response = await payHero.makeStkPush(paymentDetails);
    res.json(response);
  } catch (error) {
    console.error('Payment error:', error.response?.data || error.message || error);
    res.status(500).json({
      error: error.response?.data || error.message || 'Something went wrong',
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
