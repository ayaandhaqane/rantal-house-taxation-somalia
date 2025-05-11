// // // routes/adminRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const adminController = require('../controllers/adminController');

// // // Route to register admin
// // router.post('/register', adminController.registerAdmin);

// // module.exports = router;


// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');

// // Route to register admin
// router.post('/register', adminController.registerAdmin);

// // Route to login admin
// router.post('/login', adminController.loginAdmin);

// module.exports = router;


const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to register admin
router.post('/register', adminController.registerAdmin);

// Route to login admin
router.post('/login', adminController.loginAdmin);

module.exports = router;
