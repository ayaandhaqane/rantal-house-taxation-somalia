const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const { createMessageStore, getAllMessageStores, getLatestMessageFromStore, sendMessageFromStore } = require('../controllers/messageStoreController');

// Route to store a new message
router.post('/create', authenticate, createMessageStore);

// Route to view all stored messages (Optional, for listing)
router.get('/', authenticate, getAllMessageStores);
// ✅ Route-kan cusub:
router.get('/latest-store', authenticate, getLatestMessageFromStore);
router.post('/send-from-store/:storeId', authenticate, sendMessageFromStore);
module.exports = router;
