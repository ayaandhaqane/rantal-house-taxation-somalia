const express = require('express');
const { registerCitizen, getCitizenProfile } = require('../controllers/citizenController');

const router = express.Router();

// Route to register a new citizen
router.post('/register', registerCitizen);

// Route to get citizen profile by ID
router.get('/:id', getCitizenProfile);

module.exports = router;
