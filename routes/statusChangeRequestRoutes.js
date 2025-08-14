const express = require('express');
const router = express.Router();
const { requestStatusChange,createDeleteRequest } = require('../controllers/StatusRequestController');

const authMiddleware = require('../middleware/auth');

router.post('/status-change', authMiddleware, requestStatusChange);

// Route for users to create a delete request
router.post('/delete-requests', authMiddleware, createDeleteRequest);


module.exports = router;
