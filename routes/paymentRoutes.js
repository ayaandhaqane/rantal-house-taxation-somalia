const express = require('express');
const router = express.Router();
const {  
    makePayment, 
    getTransactions, 
    getDetailedTransactions,
    getAllPaymentsForAdmin, 
    getPaymentsByProperty ,
    getAllPaymentsByUserDistrict,
    getAllPaymentsByDistrictId
} = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authenticate');



// This is the new route for your admin transaction page
router.get('/all-for-admin', getAllPaymentsForAdmin);


// router.post('/waafi', makeWaafiPayPayment);
router.post('/make-payment', makePayment);

router.get('/payments/:citizen_id', getTransactions);

router.get('/detailed/:citizen_id', getDetailedTransactions);

router.get('/property/:propertyId', getPaymentsByProperty);

router.get('/transactions/by-district/:district_id', authenticate, getAllPaymentsByDistrictId);
module.exports = router;
