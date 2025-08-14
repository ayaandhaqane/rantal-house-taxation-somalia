// const express = require('express');
// const { authenticate } = require('../middleware/authenticate');

// const router = express.Router();

// const { createTransaction,getTransactions, getTransactionsByPropertyId, getTransactionsByTaxCollectionStatus, getTransactionStats,transactionController, getTransactionsByDistrict  } = require('../controllers/transactionController');

// router.get('/', getTransactions);  // Correct route definition
// router.get('/property/:property_id', getTransactionsByPropertyId);
// router.get('/status/:status', getTransactionsByTaxCollectionStatus);
// router.get('/stats', getTransactionStats);



// module.exports = router;

const express = require('express');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

const { createTransaction,getTransactions, getTransactionsByPropertyId, getTransactionsByTaxCollectionStatus, getTransactionStats,transactionController, getTransactionsByDistrict  } = require('../controllers/transactionController');

router.get('/', getTransactions);  // Correct route definition
router.get('/property/:property_id', getTransactionsByPropertyId);
router.get('/status/:status', getTransactionsByTaxCollectionStatus);
router.get('/stats', getTransactionStats);
// Add this to your transaction routes (router.js)
router.get('/district/:districtId', authenticate, getTransactionsByDistrict);




module.exports = router;





