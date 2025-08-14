const Prediction = require('../models/Prediction');
const axios = require('axios');

// Create a prediction
exports.createPrediction = async (req, res) => {
    try {
        const {
            houseNo,
            branch,
            district,
            zone,
            currentHouseRent,
            predictionPeriod
        } = req.body;

        // 1. Call the Flask API to get the predicted tax
        const flaskResponse = await axios.post('http://localhost:5002/predict', {
            currentHouseRent
        });

        const predicted_tax = flaskResponse.data.prediction;

        // 2. Create new prediction document
        const newPrediction = new Prediction({
            houseNo,
            branch,
            district,
            zone,
            currentHouseRent,
            predictionPeriod,
            predicted_tax
        });

        await newPrediction.save();

        // 3. Return the result to frontend
        res.status(201).json({
            message: "Prediction created successfully",
            predicted_tax,
            prediction: newPrediction
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all predictions (optional, for viewing history)
exports.getAllPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.find();
        res.status(200).json(predictions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
