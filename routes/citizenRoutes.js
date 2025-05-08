const express = require('express');
const { createCitizen, getAllCitizens } = require('../controllers/citizenController');

const router = express.Router();

// POST route to create a new citizen
router.post('/create', createCitizen);

// GET route to get all citizens
router.get('/', getAllCitizens);

module.exports = router;
