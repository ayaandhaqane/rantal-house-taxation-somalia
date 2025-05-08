const Notification = require('../models/Notification');

// Get all notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const { citizen_id, message, notification_type } = req.body;
        const newNotification = new Notification({ citizen_id, message, notification_type });
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
