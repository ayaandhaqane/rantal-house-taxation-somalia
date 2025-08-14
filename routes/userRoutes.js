// // routes/userRouter.js
// const express = require('express');
// const router = express.Router();
// const {
//   registerUser,
//   loginUser,
//   verifyOTP,
//   getAllUsers,
//   deleteUser,
//   updateUser,
//   updateUserProfile,
//   getUserProfile,
//   getCurrentUser
// } = require('../controllers/userController');
// const { authenticate } = require('../middleware/authenticate');
// const upload = require('../config/multer');

// // Public routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/verify-otp', verifyOTP);

// // Admin routes
// router.get('/', getAllUsers);
// router.delete('/:id', authenticate, deleteUser);
// router.put('/:id', authenticate, updateUser);
// router.get('/me', authenticate, getCurrentUser);

// // Profile routes for logged-in user
// router.get('/profile', authenticate, getUserProfile);
// router.put('/profile', authenticate, upload.single('avatar'), updateUserProfile);

// module.exports = router;













// // routes/userRouter.js
// const express = require('express');
// const router = express.Router();
// const {
//   updateUserProfile,
//   getUserProfile,
//   // ... other controllers
// } = require('../controllers/userController');
// const { authenticate } = require('../middleware/authenticate');
// const upload = require('../config/multer');

// router.get('/profile', authenticate, getUserProfile);
// router.put('/profile', authenticate, upload.single('avatar'), updateUserProfile);

// module.exports = router;










const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyOTP,
  getAllUsers,
  deleteUser,
  updateUser,
  updateUserProfile,
  getUserProfile,
  getCurrentUser,
  forgotPassword,
   verifyOtp,
    resetPassword,
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');
const upload = require('../config/multer');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.get('/', getAllUsers);


// Public routes
router.post('/forgot-password', forgotPassword); // Send OTP to email
router.post('/verify-otp', verifyOtp); // Verify OTP entered by user
router.post('/reset-password', resetPassword); // Reset user password


// Authenticated user routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, upload.single('avatar'), updateUserProfile);
router.get('/me', authenticate, getCurrentUser);

// Admin routes (example)
// router.get('/', authenticate, getAllUsers); // Only authenticated (add admin check if needed)
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
