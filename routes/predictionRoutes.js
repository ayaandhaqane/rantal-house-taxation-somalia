const express = require('express');
const router = express.Router();
const { createPrediction } = require('../controllers/predictionController');

// POST endpoint to create prediction
router.post('/create', createPrediction);

module.exports = router;
