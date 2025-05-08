const express = require('express');
const router = express.Router();
const { createPrediction, getAllPredictions } = require('../controllers/predictionController');

// Create a prediction
router.post('/', createPrediction);

// Get all predictions
router.get('/', getAllPredictions);

module.exports = router;
