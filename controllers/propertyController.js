const Property = require('../models/Property');

// Create a new property
exports.createProperty = async (req, res) => {
  const { citizen_id, house_no, district_id, branch_id, zone_id, house_rent, tax } = req.body;

  try {
    // Create a new Property instance
    const newProperty = new Property({
      citizen_id,
      house_no,
      district_id,
      branch_id,
      zone_id,
      house_rent,
      tax,
    });

    // Save the property to the database
    await newProperty.save();
    res.status(201).json(newProperty);  // Respond with the created property
  } catch (err) {
    res.status(500).json({ message: 'Error creating property', error: err.message });
  }
};

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('citizen_id district_id branch_id zone_id');
    res.status(200).json(properties);  // Respond with the list of properties
  } catch (err) {
    res.status(500).json({ message: 'Error fetching properties', error: err.message });
  }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('citizen_id district_id branch_id zone_id');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(property);  // Respond with the property details
  } catch (err) {
    res.status(500).json({ message: 'Error fetching property', error: err.message });
  }
};
