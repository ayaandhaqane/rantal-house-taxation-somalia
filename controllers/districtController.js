const District = require('../models/District');

// Get all districts
exports.getAllDistricts = async (req, res) => {
    try {
        const districts = await District.find();
        res.status(200).json(districts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new district
exports.createDistrict = async (req, res) => {
    try {
        const { district_name } = req.body;
        const newDistrict = new District({ district_name });
        await newDistrict.save();
        res.status(201).json(newDistrict);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
