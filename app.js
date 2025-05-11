// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');


// // Import Routes
// const districtRoutes = require('./routes/districtRoutes');
// const branchRoutes = require('./routes/branchRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const predictionRoutes = require('./routes/predictionRoutes');
// const citizenRoutes = require('./routes/citizenRoutes');  // Citizen routes



// // Initialize the app
// const app = express();

// // Connect to the database
// connectDB();
// // Load environment variables
// dotenv.config();  // Load .env file

// // Middleware
// app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
// app.use(express.json()); // Parse incoming JSON requests

// // Routes
// app.use('/api/districts', districtRoutes);
// app.use('/api/branches', branchRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/complaints', complaintRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/predictions', predictionRoutes); // Added new route for predictions
// app.use('/api/citizens', citizenRoutes);  // Citizen routes



// // Home route (optional)
// app.get('/', (req, res) => {
//   res.send('Welcome to the Rental House Taxation API!');
// });

// // Set the port
// const port = process.env.PORT || 5000;

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = app;

// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Import Routes
// const citizenRoutes = require('./routes/citizenRoutes');  // Citizen routes
// const districtRoutes = require('./routes/districtRoutes');
// const branchRoutes = require('./routes/branchRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const predictionRoutes = require('./routes/predictionRoutes');
// const propertyRoutes = require('./routes/propertyRoutes');  // Property routes

// // Load environment variables
// dotenv.config();  // Load .env file

// // Connect to the database
// connectDB();  // Connect to MongoDB

// // Initialize the app
// const app = express();

// // Middleware
// app.use(bodyParser.json());  // Parse incoming JSON requests
// app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)

// // Routes
// app.use('/api/citizens', citizenRoutes);  // Citizen routes
// app.use('/api/districts', districtRoutes);  // District routes
// app.use('/api/branches', branchRoutes);  // Branch routes
// app.use('/api/payments', paymentRoutes);  // Payment routes
// app.use('/api/complaints', complaintRoutes);  // Complaint routes
// app.use('/api/notifications', notificationRoutes);  // Notification routes
// app.use('/api/predictions', predictionRoutes);  // Prediction routes
// app.use('/api/properties', propertyRoutes);  // Property routes

// // Home route (optional)
// app.get('/', (req, res) => {
//   res.send('Welcome to the Rental House Taxation API!');
// });

// // Set the port
// const port = process.env.PORT || 5000;

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = app;  // Export app for potential testing







// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Import Routes
// const citizenRoutes = require('./routes/citizenRoutes');
// const districtRoutes = require('./routes/districtRoutes');
// const branchRoutes = require('./routes/branchRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const predictionRoutes = require('./routes/predictionRoutes');
// const propertyRoutes = require('./routes/propertyRoutes');
// const taxRoutes = require('./routes/taxRoutes');  // Tax routes

// // Load environment variables
// dotenv.config();  // Load .env file

// // Connect to the database
// connectDB();  // Connect to MongoDB

// // Initialize the app
// const app = express();

// // Middleware
// app.use(bodyParser.json());  // Parse incoming JSON requests
// app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)

// // Routes
// app.use('/api/citizens', citizenRoutes);
// app.use('/api/districts', districtRoutes);
// app.use('/api/branches', branchRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/complaints', complaintRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/predictions', predictionRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/taxes', taxRoutes);  // Added tax routes

// // Home route (optional)
// app.get('/', (req, res) => {
//   res.send('Welcome to the Rental House Taxation API!');
// });

// // Set the port
// const port = process.env.PORT || 5000;

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = app;  // Export app for potential testing



// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Import Routes
// const citizenRoutes = require('./routes/citizenRoutes');
// const districtRoutes = require('./routes/districtRoutes');
// const branchRoutes = require('./routes/branchRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const predictionRoutes = require('./routes/predictionRoutes');
// const propertyRoutes = require('./routes/propertyRoutes');
// const taxRoutes = require('./routes/taxRoutes');  // Tax routes
// const zoneRoutes = require('./routes/zoneRoutes');  // Zone routes

// // Load environment variables
// dotenv.config();  // Load .env file

// // Connect to the database
// connectDB();  // Connect to MongoDB

// // Initialize the app
// const app = express();

// // Middleware
// app.use(bodyParser.json());  // Parse incoming JSON requests
// app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)

// // Routes
// app.use('/api/citizens', citizenRoutes);
// app.use('/api/districts', districtRoutes);
// app.use('/api/branches', branchRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/complaints', complaintRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/predictions', predictionRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/taxes', taxRoutes);  // Added tax routes
// app.use('/api/zones', zoneRoutes);  // Added zone routes

// // Home route (optional)
// app.get('/', (req, res) => {
//   res.send('Welcome to the Rental House Taxation API!');
// });

// // Set the port
// const port = process.env.PORT || 5000;

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = app;  // Export app for potential testing








// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Import Routes
// const citizenRoutes = require('./routes/citizenRoutes');
// const districtRoutes = require('./routes/districtRoutes');
// const branchRoutes = require('./routes/branchRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const predictionRoutes = require('./routes/predictionRoutes');
// const propertyRoutes = require('./routes/propertyRoutes');
// const taxRoutes = require('./routes/taxRoutes');  // Tax routes
// const zoneRoutes = require('./routes/zoneRoutes');  // Zone routes

// // Load environment variables
// dotenv.config();  // Load .env file

// // Connect to the database
// connectDB();  // Connect to MongoDB

// // Initialize the app
// const app = express();

// // Middleware
// app.use(bodyParser.json());  // Parse incoming JSON requests
// app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)

// // Routes
// app.use('/api/citizens', citizenRoutes);  // Citizen routes
// app.use('/api/districts', districtRoutes);  // District routes
// app.use('/api/branches', branchRoutes);  // Branch routes
// app.use('/api/payments', paymentRoutes);  // Payment routes
// app.use('/api/complaints', complaintRoutes);  // Complaint routes
// app.use('/api/notifications', notificationRoutes);  // Notification routes
// app.use('/api/predictions', predictionRoutes);  // Prediction routes
// app.use('/api/properties', propertyRoutes);  // Property routes
// app.use('/api/taxes', taxRoutes);  // Tax routes
// app.use('/api/zones', zoneRoutes);  // Zone routes

// // Home route (optional)
// app.get('/', (req, res) => {
//   res.send('Welcome to the Rental House Taxation API!');
// });

// // Set the port
// const port = process.env.PORT || 5000;

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = app;  // Export app for potential testing













// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Import Routes
// const citizenRoutes = require('./routes/citizenRoutes');
// const districtRoutes = require('./routes/districtRoutes');
// const branchRoutes = require('./routes/branchRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const predictionRoutes = require('./routes/predictionRoutes');
// const propertyRoutes = require('./routes/propertyRoutes');
// const taxRoutes = require('./routes/taxRoutes');  // Tax routes
// const zoneRoutes = require('./routes/zoneRoutes');  // Zone routes
// const adminRoutes = require('./routes/adminRoutes');  // Admin routes

// // Load environment variables
// dotenv.config();  // Load .env file

// // Connect to the database
// connectDB();  // Connect to MongoDB

// // Initialize the app
// const app = express();

// // Middleware
// app.use(bodyParser.json());  // Parse incoming JSON requests
// app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)

// // Routes
// app.use('/api/citizens', citizenRoutes);  // Citizen routes
// app.use('/api/districts', districtRoutes);  // District routes
// app.use('/api/branches', branchRoutes);  // Branch routes
// app.use('/api/payments', paymentRoutes);  // Payment routes
// app.use('/api/complaints', complaintRoutes);  // Complaint routes
// app.use('/api/notifications', notificationRoutes);  // Notification routes
// app.use('/api/predictions', predictionRoutes);  // Prediction routes
// app.use('/api/properties', propertyRoutes);  // Property routes
// app.use('/api/taxes', taxRoutes);  // Tax routes
// app.use('/api/zones', zoneRoutes);  // Zone routes
// app.use('/api/admin', adminRoutes);  // Admin routes

// // Home route (optional)
// app.get('/', (req, res) => {
//   res.send('Welcome to the Rental House Taxation API!');
// });

// // Set the port
// const port = process.env.PORT || 5000;

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = app;  // Export app for potential testing




// app.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const citizenRoutes = require('./routes/citizenRoutes');
const districtRoutes = require('./routes/districtRoutes');
const branchRoutes = require('./routes/branchRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const taxRoutes = require('./routes/taxRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const adminRoutes = require('./routes/adminRoutes');  // Admin routes

// Load environment variables
dotenv.config();  // Load .env file

// Connect to the database
connectDB();  // Connect to MongoDB

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());  // Parse incoming JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)

// Routes
app.use('/api/citizens', citizenRoutes);  // Citizen routes
app.use('/api/districts', districtRoutes);  // District routes
app.use('/api/branches', branchRoutes);  // Branch routes
app.use('/api/payments', paymentRoutes);  // Payment routes
app.use('/api/complaints', complaintRoutes);  // Complaint routes
app.use('/api/notifications', notificationRoutes);  // Notification routes
app.use('/api/predictions', predictionRoutes);  // Prediction routes
app.use('/api/properties', propertyRoutes);  // Property routes
app.use('/api/taxes', taxRoutes);  // Tax routes
app.use('/api/zones', zoneRoutes);  // Zone routes
app.use('/api/admin', adminRoutes);  // Admin routes

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

module.exports = app;  // Export app for potential testing







// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const connectDB = require('./config/db'); // Database connection

// // Import Routes
// const adminRoutes = require('./routes/adminRoutes');  // Admin routes

// // Load environment variables
// dotenv.config();

// // Connect to the database
// connectDB();

// // Initialize the app
// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Routes
// app.use('/api/admin', adminRoutes);  // Admin routes

// // Home route (optional)
// app.get('/', (req, res) => {
//   res.send('Welcome to the Rental House Taxation API!');
// });

// // Set the port
// const port = process.env.PORT || 5000;

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = app;
