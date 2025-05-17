// // const Zone = require('../models/Zone');

// // // Create a new zone
// // exports.createZone = async (req, res) => {
// //   const { branch_id, zone_name } = req.body;

// //   try {
// //     // Create a new Zone instance
// //     const newZone = new Zone({
// //       branch_id,
// //       zone_name,
// //     });

// //     // Save the zone to the database
// //     await newZone.save();
// //     res.status(201).json(newZone);  // Respond with the created zone
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error creating zone', error: err.message });
// //   }
// // };

// // // Get all zones
// // exports.getAllZones = async (req, res) => {
// //   try {
// //     const zones = await Zone.find().populate('branch_id');  // Populate the branch details
// //     res.status(200).json(zones);  // Respond with the list of zones
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error fetching zones', error: err.message });
// //   }
// // };

// // // Get zone by ID
// // exports.getZoneById = async (req, res) => {
// //   try {
// //     const zone = await Zone.findById(req.params.id).populate('branch_id');

// //     if (!zone) {
// //       return res.status(404).json({ message: 'Zone not found' });
// //     }

// //     res.status(200).json(zone);  // Respond with the zone details
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error fetching zone', error: err.message });
// //   }
// // };







// const Zone = require('../models/Zone');

// // Create new zone
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

// // Get all zones with populated branch
// exports.getAllZones = async (req, res) => {
//   try {
//     const zones = await Zone.find().populate('branch_id');
//     res.status(200).json(zones);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching zones', error: error.message });
//   }
// };

// // Get zone by ID with branch populated
// exports.getZoneById = async (req, res) => {
//   try {
//     const zone = await Zone.findById(req.params.id).populate('branch_id');
//     if (!zone) {
//       return res.status(404).json({ message: 'Zone not found' });
//     }
//     res.status(200).json(zone);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching zone', error: error.message });
//   }
// };

// // Update zone by ID
// exports.updateZone = async (req, res) => {
//   const { id } = req.params;
//   const { branch_id, zone_name } = req.body;

//   try {
//     const updatedZone = await Zone.findByIdAndUpdate(
//       id,
//       { branch_id, zone_name },
//       { new: true, runValidators: true }
//     );
//     if (!updatedZone) {
//       return res.status(404).json({ message: 'Zone not found' });
//     }
//     res.status(200).json(updatedZone);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Delete zone by ID
// exports.deleteZone = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedZone = await Zone.findByIdAndDelete(id);
//     if (!deletedZone) {
//       return res.status(404).json({ message: 'Zone not found' });
//     }
//     res.status(200).json({ message: 'Zone deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };




// controllers/zoneController.js
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

exports.createZone = async (req, res) => {
  const { branch_id, zone_name } = req.body;
  try {
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
