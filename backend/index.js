const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const Invoice = require('./invoice_schema');
require('dotenv').config();

//middlewares
const app = express();
app.use(cors());
app.use(express.json());


// datadase connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.post('/invoices', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error saving invoice', error });
  }
});

app.get('/invoices/:userId', async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.params.userId });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error });
  }
});

app.post('/trigger-zapier', async (req, res) => {
  try {
    await axios.post(process.env.ZAPIER_WEBHOOK_URL, req.body);
    res.json({ message: 'Zapier trigger sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Zapier trigger failed', error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
