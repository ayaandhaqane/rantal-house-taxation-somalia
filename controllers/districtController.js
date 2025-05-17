// const District = require('../models/District');

// // Get all districts
// exports.getAllDistricts = async (req, res) => {
//     try {
//         const districts = await District.find();
//         res.status(200).json(districts);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Create a new district
// exports.createDistrict = async (req, res) => {
//     try {
//         const { district_name } = req.body;
//         const newDistrict = new District({ district_name });
//         await newDistrict.save();
//         res.status(201).json(newDistrict);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };







const District = require('../models/District');

// Get all districts
exports.getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find();
    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new district
exports.createDistrict = async (req, res) => {
  try {
    const { district_name } = req.body;
    const newDistrict = new District({ district_name });
    await newDistrict.save();
    res.status(201).json(newDistrict);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update district by ID
exports.updateDistrict = async (req, res) => {
  const { id } = req.params;
  const { district_name } = req.body;

  try {
    const updatedDistrict = await District.findByIdAndUpdate(
      id,
      { district_name },
      { new: true, runValidators: true }
    );
    if (!updatedDistrict) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.status(200).json(updatedDistrict);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete district by ID
exports.deleteDistrict = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDistrict = await District.findByIdAndDelete(id);
    if (!deletedDistrict) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.status(200).json({ message: 'District deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
