// // // const express = require('express');
// // // const { createCitizen, getAllCitizens } = require('../controllers/citizenController');

// // // const router = express.Router();

// // // // POST route to create a new citizen
// // // router.post('/create', createCitizen);

// // // // GET route to get all citizens
// // // router.get('/', getAllCitizens);

// // // module.exports = router;



// // const express = require('express');
// // const { createCitizen, getAllCitizens } = require('../controllers/citizenController');

// // const router = express.Router();

// // // POST create citizen
// // router.post('/create', createCitizen);

// // // GET all citizens
// // router.get('/', getAllCitizens);

// // module.exports = router;



// const express = require('express');
// const {
//   createCitizen,
//   getAllCitizens,
//   updateCitizen,
//   deleteCitizen
// } = require('../controllers/citizenController');

// const router = express.Router();

// router.post('/create', createCitizen);    // Create
// router.get('/', getAllCitizens);          // Read all
// router.put('/:id', updateCitizen);        // Update by ID
// router.delete('/:id', deleteCitizen);     // Delete by ID

// module.exports = router;



// const express = require('express');
// const { createCitizen, getAllCitizens } = require('../controllers/citizenController');

// const router = express.Router();

// // POST create citizen
// router.post('/create', createCitizen);

// // GET all citizens
// router.get('/', getAllCitizens);

// module.exports = router;


const express = require('express');
const {
  createCitizen,
  getAllCitizens,
  updateCitizen,
  deleteCitizen,
} = require('../controllers/citizenController');

const router = express.Router();

// POST create citizen
router.post('/create', createCitizen);

// GET all citizens
router.get('/', getAllCitizens);

// PUT update citizen by ID
router.put('/:id', updateCitizen);

// DELETE citizen by ID
router.delete('/:id', deleteCitizen);

module.exports = router;
