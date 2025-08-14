// models/Complaint.js
const mongoose = require('mongoose');


const complaintSchema = new mongoose.Schema({
  citizen_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  complaint_description: { type: String, required: true },
  reply: { type: String }, // <-- ADD THIS LINE
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
