const Payment = require('../models/Payment');

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { citizen_id, property_id, payment_amount, payment_method } = req.body;
        const newPayment = new Payment({ citizen_id, property_id, payment_amount, payment_method });
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
