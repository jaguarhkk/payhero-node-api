import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import PayHero from "payhero-wrapper";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const payHero = new PayHero({
  Authorization: process.env.PAYHERO_AUTH_TOKEN,
  pesapalConsumerKey: process.env.PESAPAL_CONSUMER_KEY,
  pesapalConsumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
  pesapalApiUrl: "https://payments.pesapal.com/pesapalv3/api",
  pesapalCallbackUrl: process.env.PESAPAL_CALLBACK_URL,
  pesapalIpnId: process.env.PESAPAL_IPN_ID,
});

app.post("/stk", async (req, res) => {
  const PhoneNumber = req.body.PhoneNumber || req.body.phone || req.body.phone_number;

  const paymentDetails = {
    PhoneNumber,
    amount: 100,
    channel: 2552,
    provider: "m-pesa",
    external_reference: "INV-1001",
    callback_url: process.env.CALLBACK_URL,
  };

  try {
    const response = await payHero.makeStkPush(paymentDetails);
    res.status(200).json(response);
  } catch (error) {
    console.error("STK Push Error:", error);
    res.status(500).json({ error });
  }
});

app.get("/", (req, res) => {
  res.send("✅ PayHero STK API is running");
});

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
