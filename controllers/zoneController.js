const Zone = require('../models/Zone');

exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find().populate({
      path: 'branch_id',
      populate: { path: 'district_id' },
    });
    res.status(200).json(zones);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching zones', error: error.message });
  }
};

exports.getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id).populate({
      path: 'branch_id',
      populate: { path: 'district_id' },
    });
    if (!zone) return res.status(404).json({ message: 'Zone not found' });
    res.status(200).json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching zone', error: error.message });
  }
};



// exports.createZone = async (req, res) => {
//   const { branch_id, zone_name } = req.body;
//   try {
//     const newZone = new Zone({ branch_id, zone_name });
//     await newZone.save();
//     res.status(201).json(newZone);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating zone', error: error.message });
//   }
// };

// Create a new zone
exports.createZone = async (req, res) => {
  const { branch_id, zone_name } = req.body;

  try {
    if (!branch_id || !zone_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Normalize zone name by removing hyphens, spaces, and converting to lowercase
    const normalizedZoneName = zone_name
      .trim()
      .toLowerCase()
      .replace(/[-\s]/g, ''); // Remove hyphens and spaces

    // Check if the zone already exists for the given branch
    const existingZones = await Zone.find({ branch_id });

    // Normalize all existing zone names for the given branch
    const normalizedExistingZones = existingZones.map(z =>
      z.zone_name.trim().toLowerCase().replace(/[-\s]/g, '')
    );

    // Check for duplicate zone names
    const foundDuplicate = normalizedExistingZones.some(existing =>
      existing === normalizedZoneName
    );

    if (foundDuplicate) {
      return res.status(400).json({ message: 'Zone already exists for this branch' });
    }

    // Create the new zone if it doesn't exist
    const newZone = new Zone({ branch_id, zone_name });
    await newZone.save();

    res.status(201).json(newZone);

  } catch (error) {
    res.status(500).json({ message: 'Error creating zone', error: error.message });
  }
};


exports.updateZone = async (req, res) => {
  const { id } = req.params;
  const { branch_id, zone_name } = req.body;

  try {
    const updatedZone = await Zone.findByIdAndUpdate(
      id,
      { branch_id, zone_name },
      { new: true, runValidators: true }
    );
    if (!updatedZone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.status(200).json(updatedZone);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteZone = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedZone = await Zone.findByIdAndDelete(id);
    if (!deletedZone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.status(200).json({ message: 'Zone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




exports.getAllZones = async (req, res) => {
  try {
    const { branch_id } = req.query;
    let filter = {};
    if (branch_id) {
      filter.branch_id = branch_id;
    }
    const zones = await Zone.find(filter).populate({
      path: 'branch_id',
      populate: { path: 'district_id' },
    });
    res.status(200).json(zones);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching zones', error: error.message });
  }
};
