const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageType: { type: String, enum: ['upcoming', 'overdue'], required: true },
  recipientGroup: { type: String, enum: ['All Citizens', 'Citizens with Unpaid Taxes'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },

  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
