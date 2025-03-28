const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId: String,
  name:String,
  amount: Number,
  dueDate: Date,
  recipientEmail: String,
  status: { type: String, default: 'pending' }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;