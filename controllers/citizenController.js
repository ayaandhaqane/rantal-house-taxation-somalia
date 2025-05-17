// // const Citizen = require('../models/Citizen');

// // // Register a new citizen
// // exports.createCitizen = async (req, res) => {
// //   const { name, phone_number, password, status } = req.body;

// //   try {
// //     // Check if the phone number already exists
// //     const existingCitizen = await Citizen.findOne({ phone_number });
// //     if (existingCitizen) {
// //       return res.status(400).json({ message: 'Phone number already registered' });
// //     }

// //     // Create a new Citizen instance
// //     const newCitizen = new Citizen({
// //       name,
// //       phone_number,
// //       password,  // In real apps, hash the password before saving
// //       status,
// //     });

// //     // Save the citizen to the database
// //     await newCitizen.save();
// //     res.status(201).json(newCitizen); // Respond with the created citizen
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error registering citizen', error: err.message });
// //   }
// // };

// // // Get all citizens
// // exports.getAllCitizens = async (req, res) => {
// //   try {
// //     const citizens = await Citizen.find();
// //     res.status(200).json(citizens);
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error fetching citizens', error: err.message });
// //   }
// // };






// const Citizen = require('../models/Citizen');

// // Create new citizen
// exports.createCitizen = async (req, res) => {
//   const { name, phone_number, password, status } = req.body;

//   try {
//     const existingCitizen = await Citizen.findOne({ phone_number });
//     if (existingCitizen) {
//       return res.status(400).json({ message: 'Phone number already registered' });
//     }

//     const newCitizen = new Citizen({
//       name,
//       phone_number,
//       password,
//       status,
//     });

//     await newCitizen.save();
//     res.status(201).json(newCitizen);
//   } catch (err) {
//     res.status(500).json({ message: 'Error registering citizen', error: err.message });
//   }
// };

// // Get all citizens
// exports.getAllCitizens = async (req, res) => {
//   try {
//     const citizens = await Citizen.find();
//     res.status(200).json(citizens);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching citizens', error: err.message });
//   }
// };

// // Update citizen
// exports.updateCitizen = async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   try {
//     const updatedCitizen = await Citizen.findByIdAndUpdate(id, updateData, { new: true });
//     if (!updatedCitizen) {
//       return res.status(404).json({ message: 'Citizen not found' });
//     }
//     res.json(updatedCitizen);
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating citizen', error: err.message });
//   }
// };

// // Delete citizen
// exports.deleteCitizen = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedCitizen = await Citizen.findByIdAndDelete(id);
//     if (!deletedCitizen) {
//       return res.status(404).json({ message: 'Citizen not found' });
//     }
//     res.json({ message: 'Citizen deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error deleting citizen', error: err.message });
//   }
// };





// const Citizen = require('../models/Citizen');

// // Helper function to generate random 6-digit numeric password
// function generateRandomPassword() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Register a new citizen
// exports.createCitizen = async (req, res) => {
//   const { name, phone_number, status } = req.body;

//   try {
//     // Check if phone number exists
//     const existingCitizen = await Citizen.findOne({ phone_number });
//     if (existingCitizen) {
//       return res.status(400).json({ message: 'Phone number already registered' });
//     }

//     // Generate random 6-digit password
//     const password = generateRandomPassword();

//     const newCitizen = new Citizen({
//       name,
//       phone_number,
//       password,
//       status,
//     });

//     await newCitizen.save();

//     res.status(201).json({
//       citizen: newCitizen,
//       generatedPassword: password,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Error registering citizen', error: err.message });
//   }
// };

// // Get all citizens
// exports.getAllCitizens = async (req, res) => {
//   try {
//     const citizens = await Citizen.find();
//     res.status(200).json(citizens);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching citizens', error: err.message });
//   }
// };




const Citizen = require('../models/Citizen');

// Helper function to generate random 6-digit numeric password
function generateRandomPassword() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Register a new citizen
exports.createCitizen = async (req, res) => {
  const { name, phone_number, status } = req.body;

  try {
    // Check if phone number exists
    const existingCitizen = await Citizen.findOne({ phone_number });
    if (existingCitizen) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Generate random 6-digit password
    const password = generateRandomPassword();

    const newCitizen = new Citizen({
      name,
      phone_number,
      password,
      status,
    });

    await newCitizen.save();

    res.status(201).json({
      citizen: newCitizen,
      generatedPassword: password,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering citizen', error: err.message });
  }
};

// Get all citizens
exports.getAllCitizens = async (req, res) => {
  try {
    const citizens = await Citizen.find();
    res.status(200).json(citizens);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching citizens', error: err.message });
  }
};

// Update a citizen by ID
exports.updateCitizen = async (req, res) => {
  const { id } = req.params;
  const { name, phone_number, status } = req.body;

  try {
    // Check if updating phone_number to an existing one
    const existing = await Citizen.findOne({ phone_number, _id: { $ne: id } });
    if (existing) {
      return res.status(400).json({ message: 'Phone number already registered to another citizen' });
    }

    const updatedCitizen = await Citizen.findByIdAndUpdate(
      id,
      { name, phone_number, status },
      { new: true, runValidators: true }
    );

    if (!updatedCitizen) {
      return res.status(404).json({ message: 'Citizen not found' });
    }

    res.status(200).json(updatedCitizen);
  } catch (err) {
    res.status(500).json({ message: 'Error updating citizen', error: err.message });
  }
};

// Delete a citizen by ID
exports.deleteCitizen = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCitizen = await Citizen.findByIdAndDelete(id);

    if (!deletedCitizen) {
      return res.status(404).json({ message: 'Citizen not found' });
    }

    res.status(200).json({ message: 'Citizen deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting citizen', error: err.message });
  }
};
