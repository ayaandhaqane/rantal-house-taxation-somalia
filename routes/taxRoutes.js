const express = require('express');
const { createTax, getAllTaxes, getTaxById } = require('../controllers/taxController');

const router = express.Router();

// Route to create a new tax entry
router.post('/create', createTax);

// Route to get all tax entries
router.get('/', getAllTaxes);

// Route to get a specific tax entry by ID
router.get('/:id', getTaxById);

module.exports = router;
