const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const District = require('../models/District');
const axios = require('axios');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');


const ZB_API_KEY = process.env.ZEROBOUNCE_API_KEY;
async function isValidEmail(email) {
  try {
    const response = await axios.get(
      `https://api.zerobounce.net/v2/validate?api_key=${ZB_API_KEY}&email=${encodeURIComponent(email)}`
    );
    // Accept only truly deliverable emails
    return response.data.status === 'valid';
  } catch (err) {
    console.error('ZeroBounce email validation error:', err.message);
    // Fail safe: block registration if we can't verify
    return false;
  }
}
exports.registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password, role, district, status = 'active' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // CHECK: Is the email real and deliverable? (ZeroBounce)
    const realEmail = await isValidEmail(email);
    if (!realEmail) {
      return res.status(400).json({ message: 'The email address does not exist or is invalid.' });
    }

    // If the district is provided in the request, directly assign its ID
    let districtId = null;
    if (district) {
      const districtRecord = await District.findById(district);
      if (!districtRecord) {
        return res.status(400).json({ message: `District with ID '${district}' not found` });
      }
      districtId = districtRecord._id;
    } else if (role === 'user') {
      return res.status(400).json({ message: 'District is required for users' });
    }

    // Hash password and save user as before
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      role,
      district: districtId,
      status,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      data: {
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        district: newUser.district,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// exports.registerUser = async (req, res) => {
//   try {
//     const { fullName, username, email, password, role, district, status = 'active' } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User with this email or username already exists' });
//     }

//     // If the district is provided in the request, directly assign its ID
//     let districtId = null;
//     if (district) {
//       // Check if the district exists in the database by ID
//       const districtRecord = await District.findById(district);
//       if (!districtRecord) {
//         console.log(`District ${district} not found!`);
//         return res.status(400).json({ message: `District with ID '${district}' not found` });
//       }
//       districtId = districtRecord._id;
//     } else if (role === 'user') {
//       // If the role is 'user', we need a district, so we return an error
//       return res.status(400).json({ message: 'District is required for users' });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create a new user with the district ID
//     const newUser = new User({
//       fullName,
//       username,
//       email,
//       password: hashedPassword,
//       role,
//       district: districtId, // Store ObjectId of district
//       status,
//     });

//     // Save the new user
//     await newUser.save();

//     // Respond with user data
//     res.status(201).json({
//       message: 'User registered successfully',
//       data: {
//         _id: newUser._id,
//         fullName: newUser.fullName,
//         username: newUser.username,
//         email: newUser.email,
//         role: newUser.role,
//         district: newUser.district,
//         status: newUser.status,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

//OTP 

const OTP_EXPIRY_TIME = 5 * 60 * 1000;
const otpCache = {}; 
function generateOTP() {
  return randomstring.generate({ length: 6, charset: 'numeric' });  // Generates a 6-digit numeric OTP
}
// Function to send OTP to user's email
function sendOTP(email, otp) {

  const expiryTime = Date.now() + OTP_EXPIRY_TIME;  // Set expiry time for OTP (5 minutes from now)

  const mailOptions = {
    from: 'ayaandhaqane4155@gmail.com', // Replace with your Gmail
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for verification is: ${otp}`
  };

  otpCache[email] = { otp, expiryTime };  // Store OTP and expiry time in the cache

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ayaandhaqane4155@gmail.com', // Replace with your Gmail
      pass: 'gcvp jrod ksxj yzdv' // Use an App Password for security
    }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('OTP Email sent successfully:', info.response);
    }
  });
}
// Login user and send OTP
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Check if the user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Step 2: Check if the user is active
    if (user.status !== 'active') {
      return res.status(400).json({ message: 'Your account is inactive, please contact admin' });
    }

    // Step 3: Compare the password entered by the user with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Step 4: Generate OTP
    const otp = generateOTP();  // Generate a 6-digit OTP
    otpCache[email] = otp;  // Store OTP temporarily in memory/cache (use Redis or another solution for a production environment)

    // Step 5: Send OTP to user's email
    sendOTP(email, otp);  // Send the OTP to the user's email

    // Step 6: Return response with user ID and inform the user that OTP has been sent
    return res.status(200).json({
      message: 'Login successful. Please check your email for OTP.',
      userId: user._id,  // Send userId to verify OTP later
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Step 1: Check if the OTP exists in the cache
    if (!otpCache[email]) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Step 2: Check if the OTP has expired
    if (Date.now() > otpCache[email].expiryTime) {
      delete otpCache[email];  // Remove expired OTP from cache
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Step 3: Compare the OTP entered by the user with the one in cache
    if (otpCache[email].otp === otp.trim()) {
      // Step 4: OTP is correct, generate JWT token for the user
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Step 5: OTP is verified, delete OTP from cache after successful verification
      delete otpCache[email];  // OTP is valid, remove it from the cache

      return res.status(200).json({
        message: 'OTP verified successfully. You are now logged in.',
        token,  // Send the generated token to the frontend
      });
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('district', 'district_name');
    const processedUsers = users.map(user => ({
      ...user._doc,
      districtName: user.district?.district_name || 'No district',
    }));
    res.status(200).json(processedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // 1. Allow only admins
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete users.' });
    }

    const { id } = req.params;

    // 2. Find the user first
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Prevent deletion if the user is active
    if (user.status === 'active') {
      return res.status(400).json({ message: 'Cannot delete an active user. Please deactivate them first.' });
    }

    // 4. Proceed with deletion
    const deletedUser = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        id: deletedUser._id,
        email: deletedUser.email,
        status: deletedUser.status
      }
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during deletion',
      error: error.message
    });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update logged-in user's profile

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('district', 'district_name')
      .select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // avatarUrl logic
    let avatarUrl;
    if (user.avatarUrl) {
      if (user.avatarUrl.startsWith("http")) {
        avatarUrl = user.avatarUrl;
      } else {
        // If the path is like 'uploads/filename.png' or '/uploads/filename.png'
        const relative = user.avatarUrl.replace(/^\/?uploads[\\/]/, "uploads/");
        avatarUrl = `${req.protocol}://${req.get("host")}/public/${relative.replace(/\\/g, "/")}`;
      }
    } else {
      avatarUrl = `${req.protocol}://${req.get("host")}/public/default-avatar.jpg`;
    }

    const userResponse = {
      ...user._doc,
      avatarUrl: avatarUrl,
      district: user.district?.district_name || "No district specified",
    };
    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from authenticate middleware
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Support both JSON and form-data
    const { fullName, username, district, currentPassword, newPassword } = req.body;

    if (fullName) user.fullName = fullName;
    if (username) user.username = username;
    if (district) user.district = district;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required' });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Handle avatar upload
    if (req.file) {
      // Remove old avatar if exists
      if (user.avatarUrl) {
        const oldAvatarPath = path.join(__dirname, '../public', user.avatarUrl);
        if (fs.existsSync(oldAvatarPath)) fs.unlinkSync(oldAvatarPath);
      }
      user.avatarUrl = path.join('uploads', req.file.filename).replace(/\\/g, '/');
    }

    await user.save();

    // Optionally populate district name if you want
    await user.populate('district', 'district_name');
    const userResponse = {
      ...user._doc,
      password: undefined,
      district: user.district?.district_name || user.district || 'No district specified',
      avatarUrl: user.avatarUrl
    };

    return res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during update', error: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, username, email, role, district, status } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.district = district || user.district;
    user.status = status || user.status;
    if (req.file) {
      if (user.avatarUrl) {
        const oldAvatarPath = path.join(__dirname, '../public', user.avatarUrl);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
      user.avatarUrl = path.join('uploads', req.file.filename).replace(/\\/g, '/');
    }
    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        district: user.district,
        status: user.status,
        avatarUrl: user.avatarUrl
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Server error during update",
      error: error.message
    });
  }
};




exports.getBranchesByDistrict = async (req, res) => {
  const { district_id } = req.query;

  if (!district_id) {
    return res.status(400).json({ message: 'District ID is required' });
  }

  // Check if district_id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(district_id)) {
    return res.status(400).json({ message: 'Invalid District ID' });
  }

  try {
    // Fetch branches for the given district_id
    const branches = await Branch.find({ district: mongoose.Types.ObjectId(district_id) });

    if (!branches.length) {
      return res.status(404).json({ message: 'No branches found for this district' });
    }

    // Respond with branches data
    res.status(200).json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Temporary OTP cache
// const otpCache = {}; // In-memory storage for OTPs
// const OTP_EXPIRY_TIME = 5 * 60 * 1000; // OTP expires after 5 minutes

// Generate OTP
function generateOTP() {
  return randomstring.generate({ length: 6, charset: 'numeric' }); // 6-digit OTP
}

// Send OTP to the user's email
function sendOTP(email, otp) {
  const expiryTime = Date.now() + OTP_EXPIRY_TIME;
  otpCache[email] = { otp, expiryTime }; // Store OTP and expiry time in memory

  const mailOptions = {
    from: 'ayaandhaqane4155@gmail.com',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ayaandhaqane4155@gmail.com',
      pass: 'gcvp jrod ksxj yzdv', // Use an App Password or OAuth2 for better security
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending OTP:', error);
    } else {
      console.log('OTP sent:', info.response);
    }
  });
}

// Forgot Password - Sends OTP to the user's email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP and send it to the user's email
    const otp = generateOTP();
    sendOTP(email, otp); // Send OTP to the email

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP - Validates the OTP entered by the user
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  // Check if OTP exists and is not expired
  if (!otpCache[email] || otpCache[email].expiryTime < Date.now()) {
    return res.status(400).json({ message: 'OTP expired or not found' });
  }

  // Verify OTP
  if (otpCache[email].otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP is valid, remove it from cache after successful verification
  delete otpCache[email];

  res.status(200).json({ message: 'OTP verified successfully' });
};

// Reset Password - Updates the user's password after OTP verification
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
