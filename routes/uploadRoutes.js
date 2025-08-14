const express = require('express');
const multer = require('multer');
const path = require('path');
const Citizen = require('../models/Citizen'); // Your schema
const router = express.Router();
const mongoose = require('mongoose');  // <--- Add this import


// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder where files will be saved (make sure it exists)
  },
  filename: (req, file, cb) => {
    // Use unique filename, e.g., citizenId + timestamp + extension
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.citizenId}-${Date.now()}${ext}`);
  },
});

// File filter to allow images only
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

// const fileFilter = (req, file, cb) => {
//   console.log('Uploading file type:', file.mimetype); // DEBUG log
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only JPEG, JPG, PNG files are allowed'), false);
//   }
// };


const upload = multer({ storage });

// Upload route: expects citizenId in params and file under 'profile_image' field
router.post('/upload-profile-image/:citizenId', upload.single('profile_image'), async (req, res) => {
    try {
      const citizenId = req.params.citizenId;

      // Validate citizenId as a valid MongoDB ObjectId string
      if (!mongoose.Types.ObjectId.isValid(citizenId)) {
        return res.status(400).json({ message: "Invalid citizen ID" });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const filePath = req.file.path;
  
      // Find citizen by MongoDB _id
      const citizen = await Citizen.findById(citizenId);
      if (!citizen) {
        return res.status(404).json({ message: 'Citizen not found' });
      }
  
      citizen.profile_image = filePath;
      await citizen.save();
  
      res.status(200).json({
        message: 'Profile image uploaded successfully',
        profile_image: filePath,
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Server error during file upload' });
    }
  });
  

  // GET citizen profile by ID (MongoDB _id)
router.get('/:id', async (req, res) => {
  try {
    const citizenId = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(citizenId)) {
      return res.status(400).json({ message: "Invalid citizen ID" });
    }

    // Find citizen by _id
    const citizen = await Citizen.findById(citizenId).select('-password'); // exclude sensitive fields
    if (!citizen) {
      return res.status(404).json({ message: 'Citizen not found' });
    }

    // Return citizen profile data including profile_image path
    res.status(200).json(citizen);
  } catch (error) {
    console.error('Error fetching citizen profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});


module.exports = router;
