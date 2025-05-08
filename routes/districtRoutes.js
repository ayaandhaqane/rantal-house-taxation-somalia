const express = require('express');
const router = express.Router();
const { getAllDistricts, createDistrict } = require('../controllers/districtController');

// Routes for districts
router.get('/', getAllDistricts);
router.post('/', createDistrict);

module.exports = router;
