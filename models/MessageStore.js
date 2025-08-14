const mongoose = require('mongoose');

const messageStoreSchema = new mongoose.Schema({
  messageType: { 
    type: String, 
    enum: ['upcoming', 'overdue'], 
    required: true 
  },
  recipientGroup: { 
    type: String, 
    enum: ['All Citizens', 'Citizens with Unpaid Taxes'], 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

const MessageStore = mongoose.model('MessageStore', messageStoreSchema);
module.exports = MessageStore;
