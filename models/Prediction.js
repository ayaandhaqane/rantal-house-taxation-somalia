const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    citizen_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
    predicted_tax: { type: Number, required: true }
});

const Prediction = mongoose.model('Prediction', predictionSchema);
module.exports = Prediction;
