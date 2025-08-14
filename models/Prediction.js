const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  predicted_tax: { type: Number, required: true },
  houseNo: String,
  branch: String,
  district: String,
  zone: String,
  currentHouseRent: Number,
  predictionPeriod: String,
});

const Prediction = mongoose.model('Prediction', predictionSchema);
module.exports = Prediction;
