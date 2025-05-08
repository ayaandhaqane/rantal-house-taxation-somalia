const express = require('express');
const { createProperty, getAllProperties, getPropertyById } = require('../controllers/propertyController');

const router = express.Router();

// Route to create a new property
router.post('/create', createProperty);

// Route to get all properties
router.get('/', getAllProperties);

// Route to get a specific property by ID
router.get('/:id', getPropertyById);

module.exports = router;
