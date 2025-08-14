// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const {
//   createProperty,
//   getAllProperties,
//   getPropertyById,
//   updateProperty,
//   deleteProperty,
//   getPropertyByHouseNo,
//   getPropertyByHouseNoForCitizen,
//   getPropertyByCitizenId,
//   togglePropertyStatus,
//   calculatePropertyTax,
//   getNextHouseNumber
// } = require('../controllers/propertyController');

// // Create property
// router.post('/create', createProperty);

// // Get all properties (general)
// router.get('/', getAllProperties);


// // --- SPECIFIC ROUTES FIRST ---

// // Route to get the next generated house number for preview on the frontend
// // This has been moved up so it's matched before the '/:id' route below
// router.get('/next-house-no', getNextHouseNumber);

// router.get('/calculate-tax', calculatePropertyTax);
// router.get('/house/:houseNo', getPropertyByHouseNo);
// router.get('/house/:houseNo/citizen/:citizenId', getPropertyByHouseNoForCitizen);
// router.get('/citizen/:citizenId', getPropertyByCitizenId);


// // --- DYNAMIC ROUTES LAST ---

// // This will now correctly handle requests for a specific property by its ID
// router.get('/:id', getPropertyById);

// // Update, delete, and toggle status by id
// router.put('/:id', updateProperty);
// router.delete('/:id', deleteProperty);
// router.patch('/:id/toggle-status', togglePropertyStatus);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const {
//   createProperty,
//   getAllProperties,
//   getPropertyById,
//   updateProperty,
//   deleteProperty,
//   getPropertyByHouseNo,
//   getPropertyByHouseNoForCitizen,
//   getPropertyByCitizenId,
//   togglePropertyStatus,
//   calculatePropertyTax,
//   getNextHouseNumber,
//   getTotalHouseRentForZone
// } = require('../controllers/propertyController');

// // Create property
// router.post('/create', createProperty);

// // Get all properties (general)
// router.get('/', getAllProperties);


// // --- SPECIFIC ROUTES FIRST ---

// // Route to get the next generated house number for preview on the frontend
// // This has been moved up so it's matched before the '/:id' route below
// router.get('/next-house-no', getNextHouseNumber);

// router.get('/calculate-tax', calculatePropertyTax);
// router.get('/house/:houseNo', getPropertyByHouseNo);
// router.get('/house/:houseNo/citizen/:citizenId', getPropertyByHouseNoForCitizen);
// router.get('/citizen/:citizenId', getPropertyByCitizenId);


// // --- DYNAMIC ROUTES LAST ---

// // This will now correctly handle requests for a specific property by its ID
// router.get('/:id', getPropertyById);

// // Update, delete, and toggle status by id
// router.put('/:id', updateProperty);
// router.delete('/:id', deleteProperty);
// router.patch('/:id/toggle-status', togglePropertyStatus);


// // Route to get the total house rent for a zone
// router.get('/total-house-rent', getTotalHouseRentForZone);



// module.exports = router;




const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertyByHouseNo,
  getPropertyByHouseNoForCitizen,
  getPropertyByCitizenId,
  togglePropertyStatus,
  calculatePropertyTax,
  getNextHouseNumber,
  getTotalHouseRentForZone
} = require('../controllers/propertyController');

// Create property
router.post('/create', createProperty);

// Get all properties (general)
router.get('/', getAllProperties);

// --- SPECIFIC ROUTES FIRST ---
router.get('/next-house-no', getNextHouseNumber);
router.get('/calculate-tax', calculatePropertyTax);
router.get('/total-house-rent', getTotalHouseRentForZone); // Moved this up
router.get('/house/:houseNo', getPropertyByHouseNo);
router.get('/house/:houseNo/citizen/:citizenId', getPropertyByHouseNoForCitizen);
router.get('/citizen/:citizenId', getPropertyByCitizenId);

// --- DYNAMIC ROUTES LAST ---
router.get('/:id', getPropertyById);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);
router.patch('/:id/toggle-status', togglePropertyStatus);

module.exports = router;