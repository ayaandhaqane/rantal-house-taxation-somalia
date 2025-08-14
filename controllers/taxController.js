const Tax = require('../models/Tax');

// Get all taxes with property populated
exports.getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find().populate('property_id');
    res.status(200).json(taxes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching taxes", error: error.message });
  }
};

// Get only the tax value for a citizen
exports.getOnlyTaxForCitizen = async (req, res) => {
  try {
    const { citizenId } = req.params;
    // Find the latest tax record for this citizen
    const tax = await Tax.findOne({ citizen_id: citizenId }).sort({ createdAt: -1 });
    if (!tax) {
      return res.status(404).json({ message: "No tax found for this citizen" });
    }
    res.status(200).json({ tax: tax.tax }); // Only return the tax value
  } catch (error) {
    res.status(500).json({ message: "Error fetching tax", error: error.message });
  }
};