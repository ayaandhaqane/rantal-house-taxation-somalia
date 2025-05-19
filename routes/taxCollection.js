// // routes/taxCollectionRoutes.js
// const express = require('express');
// const router = express.Router();
// const TaxCollection = require('../models/TaxCollection');

// // Get all tax collections (with related population)
// router.get('/', async (req, res) => {
//   try {
//     const taxCollections = await TaxCollection.find()
//       .populate('citizen_id', 'name phone_number')
//       .populate('property_id')
//       .populate('tax_id');
//     res.status(200).json(taxCollections);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching tax collections', error: error.message });
//   }
// });

// // You can add POST, PUT, DELETE routes as needed

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const {
//   createProperty,
//   createPayment,
//   getAllTaxCollections,
//   markTaxAsPaid,
// } = require('../controllers/taxCollectionController');

// // Property create route (property + tax + taxCollection)
// router.post('/property/create', createProperty);

// // Create a new payment and update tax collection
// router.post('/payment/create', createPayment);

// // Get all tax collections
// router.get('/collections', getAllTaxCollections);

// // Mark tax collection as paid
// router.put('/collections/:taxCollectionId/paid', markTaxAsPaid);

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const {
//   createProperty,
//   createPayment,
//   getAllTaxCollections,
//   markTaxAsPaid,
// } = require('../controllers/taxCollectionController');

// // Route to create property + tax + taxCollection
// router.post('/property/create', createProperty);

// // Route to create a payment and update tax collection
// router.post('/payment/create', createPayment);

// // Get all tax collections
// router.get('/collections', getAllTaxCollections);

// // Mark tax collection as paid
// router.put('/collections/:taxCollectionId/paid', markTaxAsPaid);

// module.exports = router;





// const express = require('express');
// const router = express.Router();
// const {
//   createProperty,
//   createPayment,
//   getAllTaxCollections,
//   markTaxAsPaid,
//   getCitizenTaxSummary,
// } = require('../controllers/taxCollectionController');

// router.post('/property/create', createProperty);
// router.post('/payment/create', createPayment);
// router.get('/collections', getAllTaxCollections);
// router.put('/collections/:taxCollectionId/paid', markTaxAsPaid);

// // Summary route
// router.get('/summary/:citizen_id', getCitizenTaxSummary);

// module.exports = router;



const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllTaxCollections,
  markTaxAsPaid,
} = require('../controllers/taxCollectionController');

router.post('/payment/create', createPayment);
router.get('/collections', getAllTaxCollections);
router.put('/collections/:taxCollectionId/paid', markTaxAsPaid);

module.exports = router;
