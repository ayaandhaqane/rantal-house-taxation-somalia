// const express = require('express');
// const { createZone, getAllZones, getZoneById } = require('../controllers/zoneController');

// const router = express.Router();

// // Route to create a new zone
// router.post('/create', createZone);

// // Route to get all zones
// router.get('/', getAllZones);

// // Route to get a specific zone by ID
// router.get('/:id', getZoneById);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const {
//   createZone,
//   getAllZones,
//   getZoneById,
//   updateZone,
//   deleteZone,
// } = require('../controllers/zoneController');

// router.post('/create', createZone);
// router.get('/', getAllZones);
// router.get('/:id', getZoneById);
// router.put('/:id', updateZone);
// router.delete('/:id', deleteZone);

// module.exports = router;




// routes/zoneRoutes.js
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
