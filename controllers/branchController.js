// const Branch = require('../models/Branch');

// // Get all branches
// exports.getAllBranches = async (req, res) => {
//     try {
//         const branches = await Branch.find().populate('district_id');
//         res.status(200).json(branches);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Create a new branch
// exports.createBranch = async (req, res) => {
//     try {
//         const { district_id, branch_name } = req.body;
        
//         // Make sure district_id is valid (ObjectId format)
//         if (!district_id || !branch_name) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         const newBranch = new Branch({ district_id, branch_name });
//         await newBranch.save();
//         res.status(201).json(newBranch);  // Return the created branch
//     } catch (error) {
//         console.error(error);  // Log error to console for debugging
//         res.status(500).json({ message: "Server error" });
//     }
// };











const Branch = require('../models/Branch');

// Get all branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().populate('district_id');
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new branch
exports.createBranch = async (req, res) => {
  try {
    const { district_id, branch_name } = req.body;

    if (!district_id || !branch_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newBranch = new Branch({ district_id, branch_name });
    await newBranch.save();
    res.status(201).json(newBranch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
