const express = require('express');
const router = express.Router();
const { getAllBranches, createBranch } = require('../controllers/branchController');

// Routes for branches
router.get('/', getAllBranches);
router.post('/', createBranch);

module.exports = router;
