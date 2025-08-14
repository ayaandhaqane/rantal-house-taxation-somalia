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


exports.createDistrict = async (req, res) => {
  try {
    const { district_name } = req.body;

    // Normalize district name by removing hyphens, spaces, and converting to lowercase
    const normalizedDistrictName = district_name
      .trim()
      .toLowerCase()
      .replace(/[-\s]/g, ''); // Remove hyphens and spaces

    // Check if the district already exists
    const districts = await District.find();

    // Normalize all existing district names and compare
    const normalizedExistingDistricts = districts.map(d => 
      d.district_name.trim().toLowerCase().replace(/[-\s]/g, '')
    );

    const foundDuplicate = normalizedExistingDistricts.some(existing => 
      existing === normalizedDistrictName
    );

    if (foundDuplicate) {
      return res.status(400).json({ message: 'District already exists' });
    }

    // If the district doesn't exist, create a new one
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