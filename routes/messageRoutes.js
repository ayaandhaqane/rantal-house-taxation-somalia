

// const express = require('express');
// const router = express.Router();
// const { authenticate } = require('../middleware/authenticate');
// const { createMessage, getAllMessages,getLatestAdminMessageByType,getMessagesByDistrict } = require('../controllers/messageController');

// router.post('/create', authenticate, createMessage);  // protected route
// router.get('/', getAllMessages);                      // public route for reading messages
// router.get('/latest-admin', authenticate, getLatestAdminMessageByType);
// router.get('/by-district/:district', authenticate, getMessagesByDistrict);



// module.exports = router;


const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const {
  createMessage,
  getAllMessages,
  getMessagesByDistrict,
  getLatestMessageByUser,
  getUnreadMessageCount,
  createOverdueMessage,
  getMessagesForProperty

} = require('../controllers/messageController');

// Create message (authenticated)
router.post('/create', authenticate, createMessage);

// Get all messages (public)
router.get('/', getAllMessages);

// Get messages filtered by district (authenticated)
router.get('/by-district/:district', authenticate, getMessagesByDistrict);

// Get latest admin message by type (authenticated)
router.get('/latest-user', authenticate, getLatestMessageByUser);

router.get('/allMessages', getMessagesForProperty);

// router.get('/unread-count', authenticate, getUnreadMessageCount);
// routes/message.js
router.post('/send-overdue', authenticate, createOverdueMessage);


module.exports = router;
