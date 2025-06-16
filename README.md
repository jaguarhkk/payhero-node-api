# Unofficial PayHero Node.js SDK + API

This project is an unofficial SDK and deployable API server for integrating PayHero and Pesapal payment solutions in Node.js applications. You can use it as a library **or** deploy it as an API on platforms like **Render**.

---

## 🚀 Features

- STK Push Payments
- Pesapal Payment Integration
- Verify Pesapal Transactions
- Wallet Balance Queries
- Account Transaction Logs
- Withdrawal to Mobile
- WhatsApp Messaging
- Ready-to-deploy API server

---

## 📦 Installation (as SDK Library)

Install via npm:

```bash
npm i payhero-wrapper
```

Use it in code:

```js
import PayHero from 'payhero-wrapper';

const PayHeroConfig = {
  Authorization: 'Basic base64encodedCreds',
  pesapalConsumerKey: 'your_key',
  pesapalConsumerSecret: 'your_secret',
  pesapalApiUrl: 'https://pay.pesapal.com/v3',
  pesapalCallbackUrl: 'https://yourapp.com/callback',
  pesapalIpnId: 'your_ipn_id'
};

const PayHeroInstance = new PayHero(PayHeroConfig);
```

---

## 🧪 Example Usage (STK Push)

```js
PayHeroInstance.makeStkPush({
  amount: 10,
  phone_number: "0740161331",
  channel_id: 333,
  provider: "m-pesa",
  external_reference: "INV-009",
  callback_url: "https://example.com/callback.php"
})
.then(console.log)
.catch(console.error);
```

---

## 🌐 API Server (Render Deployment)

This repo includes a production-ready `server.js` file using Express to expose endpoints for payments.

### ⚙️ Setup `.env`

Create a `.env` file in your root:

```env
API_USERNAME=your_payhero_username
API_PASSWORD=your_payhero_password
PESAPAL_KEY=your_pesapal_key
PESAPAL_SECRET=your_pesapal_secret
CALLBACK_URL=https://yourapp.onrender.com/pesapal-callback
PESAPAL_IPN_ID=your_pesapal_ipn_id
```

Or use `.env.example` as a template.

---

## 🧪 API Endpoints

| Endpoint                  | Method | Description                      |
|---------------------------|--------|----------------------------------|
| `/`                       | GET    | Health check                     |
| `/stk-push`               | POST   | Initiate STK Push                |
| `/pesapal/initiate`       | POST   | Initiate Pesapal Payment         |
| `/pesapal/verify/:id`     | GET    | Verify Pesapal transaction       |

---

## 🚀 Deploy to Render

1. Push code to GitHub
2. Create a new **Web Service** in Render
3. Set environment variables (same as `.env`)
4. Use:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

---

## 📄 License

This project is licensed under the MIT License.

---

## 🛠 Contributing

Issues and PRs are welcome at [https://github.com/moore100/PayHero-wrapper](https://github.com/moore100/PayHero-wrapper)
