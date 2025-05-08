const Zone = require('../models/Zone');

// Create a new zone
exports.createZone = async (req, res) => {
  const { branch_id, zone_name } = req.body;

  try {
    // Create a new Zone instance
    const newZone = new Zone({
      branch_id,
      zone_name,
    });

    // Save the zone to the database
    await newZone.save();
    res.status(201).json(newZone);  // Respond with the created zone
  } catch (err) {
    res.status(500).json({ message: 'Error creating zone', error: err.message });
  }
};

// Get all zones
exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find().populate('branch_id');  // Populate the branch details
    res.status(200).json(zones);  // Respond with the list of zones
  } catch (err) {
    res.status(500).json({ message: 'Error fetching zones', error: err.message });
  }
};

// Get zone by ID
exports.getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id).populate('branch_id');

    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.status(200).json(zone);  // Respond with the zone details
  } catch (err) {
    res.status(500).json({ message: 'Error fetching zone', error: err.message });
  }
};
