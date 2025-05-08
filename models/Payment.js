const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    citizen_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    payment_amount: { type: Number, required: true },
    payment_date: { type: Date, default: Date.now },
    payment_method: { type: String, required: true }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
