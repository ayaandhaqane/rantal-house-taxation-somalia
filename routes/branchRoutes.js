const express = require('express');
const router = express.Router();
const {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} = require('../controllers/branchController');

router.get('/', getAllBranches);
router.get('/:id', getBranchById);  // Important for fetching one branch for editing
router.post('/', createBranch);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);


module.exports = router;
