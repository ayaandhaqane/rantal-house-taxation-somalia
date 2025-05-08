const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    citizen_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
    message: { type: String, required: true },
    notification_type: { type: String, required: true },
    date_sent: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
