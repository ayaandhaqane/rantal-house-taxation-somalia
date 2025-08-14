// controllers/branchController.js
const Branch = require('../models/Branch');
const Zone = require('../models/Zone'); // make sure this is imported

// Get all branches or filter by district_id query param
exports.getAllBranches = async (req, res) => {
  try {
    const { district_id } = req.query;
    let query = {};
    if (district_id) {
      query.district_id = district_id;
    }

    // Populate district_id field with district details
    const branches = await Branch.find(query).populate('district_id');
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single branch by ID
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id).populate('district_id');
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new branch
// exports.createBranch = async (req, res) => {
//   try {
//     const { district_id, branch_name } = req.body;
//     if (!district_id || !branch_name) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }
//     const newBranch = new Branch({ district_id, branch_name });
//     await newBranch.save();
//     // Populate district_id to send full info
//     await newBranch.populate('district_id');
//     res.status(201).json(newBranch);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
// controllers/branchController.js

// Create a new branch
exports.createBranch = async (req, res) => {
  try {
    const { district_id, branch_name } = req.body;

    if (!district_id || !branch_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Normalize branch name by removing hyphens, spaces, and converting to lowercase
    const normalizedBranchName = branch_name
      .trim()
      .toLowerCase()
      .replace(/[-\s]/g, ''); // Remove hyphens and spaces

    // Check if the branch already exists in the specified district
    const existingBranches = await Branch.find({ district_id });

    // Normalize all existing branch names in the specified district
    const normalizedExistingBranches = existingBranches.map(b =>
      b.branch_name.trim().toLowerCase().replace(/[-\s]/g, '')
    );

    const foundDuplicate = normalizedExistingBranches.some(existing =>
      existing === normalizedBranchName
    );

    if (foundDuplicate) {
      return res.status(400).json({ message: 'Branch already exists in this district' });
    }

    // If the branch doesn't exist, create a new one
    const newBranch = new Branch({ district_id, branch_name });
    await newBranch.save();

    // Populate district_id to send full info
    await newBranch.populate('district_id');

    res.status(201).json(newBranch);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Update an existing branch
exports.updateBranch = async (req, res) => {
  const { id } = req.params;
  const { district_id, branch_name } = req.body;

  if (!district_id || !branch_name) {
    return res.status(400).json({ message: 'district_id and branch_name are required' });
  }

  try {
    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      { district_id, branch_name },
      { new: true, runValidators: true }
    ).populate('district_id');

    if (!updatedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.status(200).json(updatedBranch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a branch by ID

exports.deleteBranch = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if branch has any zones linked
    const zonesCount = await Zone.countDocuments({ branch_id: id });
    if (zonesCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete branch with existing zones. Please delete zones first.' 
      });
    }

    const deletedBranch = await Branch.findByIdAndDelete(id);
    if (!deletedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


