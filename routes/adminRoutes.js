const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
// const { createDeleteRequest } = require('../controllers/StatusRequestController');

// Add this new route to get all requests
router.get('/status-requests', authMiddleware, AdminController.getAllStatusChangeRequests);
// router.post('/delete-requests', authMiddleware, createDeleteRequest);

// This is your existing route - keep it as is
router.post('/approve-status-change', authMiddleware, AdminController.approveStatusChange);

router.post('/approve-citizen-deletion', authMiddleware, AdminController.approveCitizenDeletion);

module.exports = router;