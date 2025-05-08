const Tax = require('../models/Tax');

// Create a new tax entry
exports.createTax = async (req, res) => {
  const { property_id, tax_amount } = req.body;

  try {
    // Create a new Tax instance
    const newTax = new Tax({
      property_id,
      tax_amount,
    });

    // Save the tax to the database
    await newTax.save();
    res.status(201).json(newTax);  // Respond with the created tax entry
  } catch (err) {
    res.status(500).json({ message: 'Error creating tax entry', error: err.message });
  }
};

// Get all tax entries
exports.getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find().populate('property_id');
    res.status(200).json(taxes);  // Respond with the list of taxes
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tax entries', error: err.message });
  }
};

// Get tax by ID
exports.getTaxById = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id).populate('property_id');

    if (!tax) {
      return res.status(404).json({ message: 'Tax not found' });
    }

    res.status(200).json(tax);  // Respond with the tax details
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tax entry', error: err.message });
  }
};
