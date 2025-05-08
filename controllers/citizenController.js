const Citizen = require('../models/Citizen');

// Register a new citizen
exports.createCitizen = async (req, res) => {
  const { name, phone_number, password, status } = req.body;

  try {
    // Check if the phone number already exists
    const existingCitizen = await Citizen.findOne({ phone_number });
    if (existingCitizen) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Create a new Citizen instance
    const newCitizen = new Citizen({
      name,
      phone_number,
      password,  // In real apps, hash the password before saving
      status,
    });

    // Save the citizen to the database
    await newCitizen.save();
    res.status(201).json(newCitizen); // Respond with the created citizen
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
