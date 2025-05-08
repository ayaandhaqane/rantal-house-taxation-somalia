const Complaint = require('../models/Complaint');

// Get all complaints
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new complaint
exports.createComplaint = async (req, res) => {
    try {
        const { citizen_id, property_id, complaint_description } = req.body;
        const newComplaint = new Complaint({ citizen_id, property_id, complaint_description });
        await newComplaint.save();
        res.status(201).json(newComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
