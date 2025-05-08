const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const citizenRoutes = require('./routes/citizenRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes setup
app.use('/api/citizens', citizenRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);

// Set the port
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
