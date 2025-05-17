// // const express = require('express');
// // const { createProperty, getAllProperties, getPropertyById } = require('../controllers/propertyController');

// // const router = express.Router();

// // // Route to create a new property
// // router.post('/create', createProperty);

// // // Route to get all properties
// // router.get('/', getAllProperties);

// // // Route to get a specific property by ID
// // router.get('/:id', getPropertyById);

// // module.exports = router;



// const express = require('express');
// const {
//   createProperty,
//   getAllProperties,
//   getPropertyById,
//   updateProperty,
//   deleteProperty,
// } = require('../controllers/propertyController');

// const router = express.Router();

// router.post('/create', createProperty);
// router.get('/', getAllProperties);
// router.get('/:id', getPropertyById);
// router.put('/:id', updateProperty);
// router.delete('/:id', deleteProperty);

// module.exports = router;



const express = require('express');
const {
  createProperty,
  getAllProperties,
  updateProperty,
} = require('../controllers/propertyController');

const router = express.Router();

router.post('/create', createProperty);
router.get('/', getAllProperties);
router.put('/:id', updateProperty);

module.exports = router;
