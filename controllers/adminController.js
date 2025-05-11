// // // controllers/adminController.js
// // const Admin = require('../models/Admin'); // Adjust the path to your model

// // // Register new admin
// // const registerAdmin = async (req, res) => {
// //   try {
// //     const { firstName, lastName, email, password, role } = req.body;

// //     // Check if admin already exists
// //     const existingAdmin = await Admin.findOne({ email });
// //     if (existingAdmin) {
// //       return res.status(400).json({ message: 'Admin already exists' });
// //     }

// //     // Create new admin
// //     const newAdmin = new Admin({
// //       firstName,
// //       lastName,
// //       email,
// //       password,
// //       role
// //     });

// //     await newAdmin.save();
// //     res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // module.exports = { registerAdmin };



// const Admin = require('../models/Admin'); // Import Admin model
// const bcrypt = require('bcryptjs'); // For password hashing
// const jwt = require('jsonwebtoken'); // For generating JWT tokens

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

// // Login admin
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



const Admin = require('../models/Admin'); // Admin Model
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWT token

// Register new admin
const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,  // Send token back to the frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerAdmin, loginAdmin };
