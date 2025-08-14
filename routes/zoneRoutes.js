const express = require('express');
const router = express.Router();
const {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone,
} = require('../controllers/zoneController');

router.get('/', getAllZones);
router.get('/:id', getZoneById);  // Important for fetching one zone for editing
router.post('/create', createZone);
router.put('/:id', updateZone);
router.delete('/:id', deleteZone);

module.exports = router;
