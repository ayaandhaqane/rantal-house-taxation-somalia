const express = require('express');
const router = express.Router();
const {
  readProperty,
  getAllTaxCollections,
  markTaxAsPaid,
  getCitizenTaxSummary,
  getTaxCollectionsByProperty
} = require('../controllers/taxCollectionController');


router.get('/property/:propertyId', getTaxCollectionsByProperty);
router.get('/details-by-house/:house_no', readProperty);
router.get('/collections', getAllTaxCollections);
router.put('/collections/:taxCollectionId/paid', markTaxAsPaid);

// ADD THIS ROUTE FOR TAX SUMMARY
router.get('/summary/:citizen_id', getCitizenTaxSummary);

module.exports = router;
