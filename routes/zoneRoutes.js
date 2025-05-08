const express = require('express');
const { createZone, getAllZones, getZoneById } = require('../controllers/zoneController');

const router = express.Router();

// Route to create a new zone
router.post('/create', createZone);

// Route to get all zones
router.get('/', getAllZones);

// Route to get a specific zone by ID
router.get('/:id', getZoneById);

module.exports = router;
