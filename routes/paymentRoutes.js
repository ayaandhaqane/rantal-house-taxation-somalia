const express = require('express');
const router = express.Router();
const { getAllPayments, createPayment } = require('../controllers/paymentController');

// Routes for payments
router.get('/', getAllPayments);
router.post('/', createPayment);

module.exports = router;
