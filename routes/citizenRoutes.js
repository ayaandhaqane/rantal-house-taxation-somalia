const express = require('express');
const {
  createCitizen,
  getAllCitizens,
  updateCitizen,
  deleteCitizen,
  loginCitizen, 
  getCitizenBasicProfile,
  getCitizensByOwnDistrict,
  getManagedCitizenList,
  getCitizenReport,
  getCitizenCounts,
  getCitizenCountByDistrict,
  getCitizensByDistrict
} = require('../controllers/citizenController');
const auth = require('../middleware/auth'); 
const router = express.Router();

// POST create citizen
router.post('/create', createCitizen);

// GET all citizens
router.get('/', getAllCitizens);

router.get('/managed-list', auth, getManagedCitizenList); 
// PUT update citizen by ID
router.put('/:id', updateCitizen);

// DELETE citizen by ID
router.delete('/:id', deleteCitizen);

router.post('/login', loginCitizen); // <-- Add this line

router.get('/profile/:id', getCitizenBasicProfile);


router.get('/my-district', auth, getCitizensByOwnDistrict); // <-- Kudar line-kan
// GET citizen counts based on filters
router.get('/report', auth, getCitizenReport);
// Route for fetching citizen count by district
router.get('/citizens/count', getCitizenCountByDistrict);
router.get('/citizens-by-district', getCitizensByDistrict);
module.exports = router;
