
const express = require('express');
const { getAllTaxes } = require('../controllers/taxController');
const router = express.Router();

router.get('/', getAllTaxes);

module.exports = router;
