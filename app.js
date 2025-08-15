// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const path = require('path');  

// // Import Routes
// const citizenRoutes = require('./routes/citizenRoutes');
// const districtRoutes = require('./routes/districtRoutes');
// const branchRoutes = require('./routes/branchRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const predictionRoutes = require('./routes/predictionRoutes');
// const propertyRoutes = require('./routes/propertyRoutes');
// const taxRoutes = require('./routes/taxRoutes');
// const zoneRoutes = require('./routes/zoneRoutes');
// const userRoutes = require('./routes/userRoutes');  
// const taxCollectionRoutes = require('./routes/taxCollectionRoutes');  
// const validationRoutes = require('./routes/validationRoutes');
// const uploadRoutes = require('./routes/uploadRoutes')
// const messageRoutes = require('./routes/messageRoutes')
// const adminRoutes = require('./routes/adminRoutes');
// const statusChangeRoutes = require('./routes/statusChangeRequestRoutes');  // Add the status change route

// // Load environment variables
// dotenv.config();  

// // Connect to the database
// connectDB();  

// const app = express();

// // Middleware
// app.use(bodyParser.json());  // Parse incoming JSON requests
// app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)
// app.use(express.json()); // For JSON request parsing
// app.use(express.urlencoded({ extended: true })); // For handling form-data (if needed)

// // For serving static files (avatars, etc.)
// // In app.js, update your static file serving:
// // Make sure this is before your routes
// // Serve static files from public directory
// // Serve static files from public directory
// app.use('/public', express.static(path.join(__dirname, 'public'), {
//   setHeaders: (res, path) => {
//     if (/\.(jpg|jpeg|png|gif)$/i.test(path)) {
//       res.setHeader('Cache-Control', 'public, max-age=86400');
//     }
//   }
// }));

// // Routes
// app.use('/api/citizens', citizenRoutes);          // Citizen routes
// app.use('/api/districts', districtRoutes);        // District routes
// app.use('/api/branches', branchRoutes);           // Branch routes
// app.use('/api/payments', paymentRoutes);          // Payment routes
// app.use('/api/complaints', complaintRoutes);      // Complaint routes
// app.use('/api/notifications', notificationRoutes);// Notification routes
// app.use('/api/predictions', predictionRoutes);    // Prediction routes
// app.use('/api/properties', propertyRoutes);       // Property routes
// app.use('/api/taxes', taxRoutes);                 // Tax routes
// app.use('/api/zones', zoneRoutes);                // Zone routes
// app.use('/api/users', userRoutes);                // User routes (Admin)
// app.use('/api/taxcollections', taxCollectionRoutes); 
// app.use('/api', taxCollectionRoutes); // This line is ESSENTIAL
// app.use('/api', validationRoutes);
// app.use('/api', uploadRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/admin', adminRoutes);  // Admin routes
// app.use('/api/', statusChangeRoutes);  // Status change request route

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Rental House Taxation API!');
// });

// // Set the port
// const port = process.env.PORT || 5000;

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port} ✅`);
// });

// module.exports = app;







// app.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

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
const userRoutes = require('./routes/userRoutes');  // Admin routes
const taxCollectionRoutes = require('./routes/taxCollectionRoutes');  // <-- NEW: TaxCollection route
const validationRoutes = require('./routes/validationRoutes');
const messageRoutes = require('./routes/messageRoutes')
const transactionRoutes = require('./routes/transactionRoutes');
const messageStoreRoutes = require('./routes/messageStoreRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statusChangeRoutes = require('./routes/statusChangeRequestRoutes');  // Add the status change route
const reportRoutes = require('./routes/reportRouter'); // Add this to include your new report routes
const uploadRoutes = require('./routes/uploadRoutes')



// Load environment variables
dotenv.config();  // Load .env file

// Connect to the database
connectDB();  // Connect to MongoDB

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());  // Parse incoming JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // For JSON request parsing
app.use(express.urlencoded({ extended: true })); // For handling form-data (if needed)

// For serving static files (avatars, etc.)
// In app.js, update your static file serving:
// Make sure this is before your routes
// Serve static files from public directory
// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (/\.(jpg|jpeg|png|gif)$/i.test(path)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));


// Routes
app.use('/api/citizens', citizenRoutes);          // Citizen routes
app.use('/api/districts', districtRoutes);        // District routes
app.use('/api/branches', branchRoutes);           // Branch routes
app.use('/api/payments', paymentRoutes);          // Payment routes wkana 
app.use('/api/complaints', complaintRoutes);      // Complaint routes
app.use('/api/notifications', notificationRoutes);// Notification routes
app.use('/api/predictions', predictionRoutes);    // Prediction routes
app.use('/api/properties', propertyRoutes);       // Property routes
app.use('/api/taxes', taxRoutes);                 // Tax routes
app.use('/api/zones', zoneRoutes);                // Zone routes
app.use('/api/users', userRoutes);                // User routes (Admin)
app.use('/api/taxcollections', taxCollectionRoutes); // <-- NEW: TaxCollection route
app.use('/api', taxCollectionRoutes); // This line is ESSENTIAL
app.use('/api', validationRoutes);
app.use('/api/messages', messageRoutes)
app.use('/api/transactions', transactionRoutes);
app.use('/api/message-store', messageStoreRoutes);
app.use('/api/admin', adminRoutes);  // Admin routes
app.use('/api/', statusChangeRoutes);  // Status change request route
app.use('/api/report', reportRoutes); // Report routes (Citizen report, etc.)
app.use('/api', uploadRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Home route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the Rental House Taxation API!');
});

// Set the port
const port = process.env.PORT || 5000;
// api ga payment ga postwac inaa arko rabaa midak
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port} ✅`);
});

module.exports = app;  // Export app for potential testing
