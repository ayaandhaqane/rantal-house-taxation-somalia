const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const districtRoutes = require('./routes/districtRoutes');
const branchRoutes = require('./routes/branchRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const predictionRoutes = require('./routes/predictionRoutes');


// Initialize the app
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/districts', districtRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/predictions', predictionRoutes); // Added new route for predictions


// Home route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the Rental House Taxation API!');
});

// Set the port
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
