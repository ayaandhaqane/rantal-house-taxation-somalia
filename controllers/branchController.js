// // // const Branch = require('../models/Branch');

// // // // Get all branches
// // // exports.getAllBranches = async (req, res) => {
// // //     try {
// // //         const branches = await Branch.find().populate('district_id');
// // //         res.status(200).json(branches);
// // //     } catch (error) {
// // //         res.status(500).json({ message: 'Server error' });
// // //     }
// // // };

// // // // Create a new branch
// // // exports.createBranch = async (req, res) => {
// // //     try {
// // //         const { district_id, branch_name } = req.body;
        
// // //         // Make sure district_id is valid (ObjectId format)
// // //         if (!district_id || !branch_name) {
// // //             return res.status(400).json({ message: "Missing required fields" });
// // //         }

// // //         const newBranch = new Branch({ district_id, branch_name });
// // //         await newBranch.save();
// // //         res.status(201).json(newBranch);  // Return the created branch
// // //     } catch (error) {
// // //         console.error(error);  // Log error to console for debugging
// // //         res.status(500).json({ message: "Server error" });
// // //     }
// // // };











// // const Branch = require('../models/Branch');

// // // Get all branches
// // exports.getAllBranches = async (req, res) => {
// //   try {
// //     const branches = await Branch.find().populate('district_id');
// //     res.status(200).json(branches);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // // Create a new branch
// // exports.createBranch = async (req, res) => {
// //   try {
// //     const { district_id, branch_name } = req.body;

// //     if (!district_id || !branch_name) {
// //       return res.status(400).json({ message: 'Missing required fields' });
// //     }

// //     const newBranch = new Branch({ district_id, branch_name });
// //     await newBranch.save();
// //     res.status(201).json(newBranch);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };




// const Branch = require('../models/Branch');

// // Get all branches with populated district info
// exports.getAllBranches = async (req, res) => {
//   try {
//     const branches = await Branch.find().populate('district_id');
//     res.status(200).json(branches);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Create new branch
// exports.createBranch = async (req, res) => {
//   try {
//     const { district_id, branch_name } = req.body;
//     if (!district_id || !branch_name) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const newBranch = new Branch({ district_id, branch_name });
//     await newBranch.save();
//     res.status(201).json(newBranch);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Update branch by ID
// exports.updateBranch = async (req, res) => {
//   const { id } = req.params;
//   const { district_id, branch_name } = req.body;

//   try {
//     const updatedBranch = await Branch.findByIdAndUpdate(
//       id,
//       { district_id, branch_name },
//       { new: true, runValidators: true }
//     );
//     if (!updatedBranch) {
//       return res.status(404).json({ message: 'Branch not found' });
//     }
//     res.status(200).json(updatedBranch);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Delete branch by ID
// exports.deleteBranch = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedBranch = await Branch.findByIdAndDelete(id);
//     if (!deletedBranch) {
//       return res.status(404).json({ message: 'Branch not found' });
//     }
//     res.status(200).json({ message: 'Branch deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };



// const Branch = require('../models/Branch');

// // Get all branches with populated district info
// exports.getAllBranches = async (req, res) => {
//   try {
//     const branches = await Branch.find().populate('district_id');
//     res.status(200).json(branches);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Create new branch
// exports.createBranch = async (req, res) => {
//   try {
//     const { district_id, branch_name } = req.body;
//     if (!district_id || !branch_name) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const newBranch = new Branch({ district_id, branch_name });
//     await newBranch.save();
//     res.status(201).json(newBranch);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Update branch by ID
// exports.updateBranch = async (req, res) => {
//   const { id } = req.params;           // get id from URL param
//   const { district_id, branch_name } = req.body;

//   if (!district_id || !branch_name) {
//     return res.status(400).json({ message: 'district_id and branch_name are required' });
//   }

//   try {
//     const updatedBranch = await Branch.findByIdAndUpdate(
//       id,
//       { district_id, branch_name },
//       { new: true, runValidators: true }
//     );

//     if (!updatedBranch) {
//       return res.status(404).json({ message: 'Branch not found' });
//     }

//     res.status(200).json(updatedBranch);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Delete branch by ID
// exports.deleteBranch = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedBranch = await Branch.findByIdAndDelete(id);
//     if (!deletedBranch) {
//       return res.status(404).json({ message: 'Branch not found' });
//     }
//     res.status(200).json({ message: 'Branch deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };






// controllers/branchController.js
const Branch = require('../models/Branch');

exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().populate('district_id');
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id).populate('district_id');
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
    );

    if (!updatedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.status(200).json(updatedBranch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBranch = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBranch = await Branch.findByIdAndDelete(id);
    if (!deletedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
