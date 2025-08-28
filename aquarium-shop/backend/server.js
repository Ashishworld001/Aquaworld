const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // for sending requests to Telegram API
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Load from .env
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/order', async (req, res) => {
  const { orderNumber, products, totalPrice, deliveryCharge, customerPhone, customerEmail } = req.body;

  const productList = products.map(p => `${p.name} x${p.qty}`).join(', ');
  const message = `
🛒 New Order #${orderNumber}
📦 Products: ${productList}
💰 Total: $${totalPrice}
🚚 Delivery: $${deliveryCharge}
👤 Customer: ${customerPhone}, ${customerEmail}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });
    res.status(200).send({ success: true, message: 'Order placed and Telegram message sent.' });
  } catch (error) {
    console.error('Telegram sending failed:', error);
    res.status(500).send({ success: false, message: 'Order placed but Telegram message failed.' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
