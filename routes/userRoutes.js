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

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to register user
router.post('/register', userController.registerUser);

// Route to login user
router.post('/login', userController.loginUser);

// Route to get all users
router.get('/', userController.getAllUsers);

module.exports = router;
