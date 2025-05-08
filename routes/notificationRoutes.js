const express = require('express');
const router = express.Router();
const { getAllNotifications, createNotification } = require('../controllers/notificationController');

// Routes for notifications
router.get('/', getAllNotifications);
router.post('/', createNotification);

module.exports = router;
