// const express = require('express');
// const router = express.Router();
// const { getAllDistricts, createDistrict } = require('../controllers/districtController');

// // Routes for districts
// router.get('/', getAllDistricts);
// router.post('/', createDistrict);

// module.exports = router;



const express = require('express');
const router = express.Router();
const {
  getAllDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} = require('../controllers/districtController');

router.get('/', getAllDistricts);
router.post('/', createDistrict);
router.put('/:id', updateDistrict);
router.delete('/:id', deleteDistrict);

module.exports = router;
