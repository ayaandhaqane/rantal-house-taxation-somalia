// const Admin = require('../models/Admin'); // Admin Model
// const bcrypt = require('bcryptjs'); // For password hashing
// const jwt = require('jsonwebtoken'); // For generating JWT token

// // Register new admin
// const registerAdmin = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, role } = req.body;

//     // Check if admin already exists
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ message: 'Admin already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new admin
//     const newAdmin = new Admin({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     await newAdmin.save();
//     res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Login Admin
// const loginAdmin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if the admin exists
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(400).json({ message: 'Admin not found' });
//     }

//     // Compare the password
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({
//       message: 'Login successful',
//       token,  // Send token back to the frontend
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { registerAdmin, loginAdmin };




// controllers/userController.js
const User = require('../models/User');  // User Model
const jwt = require('jsonwebtoken');  // For generating JWT token

// Register new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, district } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,  // No hashing applied for simplicity
      role,
      district: role === 'user' ? district : undefined, // Include district only if role is 'user'
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare password (no hashing for simplicity)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,  // Send token back to frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from the database
    res.status(200).json(users);  // Return the list of users
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getAllUsers };
