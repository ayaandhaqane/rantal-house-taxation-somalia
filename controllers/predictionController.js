const Prediction = require('../models/Prediction');
const Citizen = require('../models/Citizen');  // Assuming Citizen is already defined

// Create a prediction
exports.createPrediction = async (req, res) => {
    try {
        const { citizen_id, predicted_tax } = req.body;

        // Check if the citizen exists
        const citizen = await Citizen.findById(citizen_id);
        if (!citizen) {
            return res.status(400).json({ message: "Citizen not found" });
        }

        // Create the prediction
        const newPrediction = new Prediction({ citizen_id, predicted_tax });
        await newPrediction.save();

        res.status(201).json(newPrediction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all predictions
exports.getAllPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.find().populate('citizen_id', 'name phone_number');  // Populate citizen details
        res.status(200).json(predictions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
