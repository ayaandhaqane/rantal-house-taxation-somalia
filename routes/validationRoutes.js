const express = require('express');
const router = express.Router();
const { isHormuudNumber } = require('../utils/hormuudValidator');
const Citizen = require('../models/Citizen');  // Adjust path and model name

router.get('/validate/hormuud/:citizenId', async (req, res) => {
    try {
      const { citizenId } = req.params;
      const citizen = await Citizen.findById(citizenId);
      if (!citizen) {
        return res.status(404).json({ valid: false, message: 'Citizen not found' });
      }
  
      const phoneNumber = citizen.phone_number;
      console.log('Validating phone number:', phoneNumber);
  
      const isValid = isHormuudNumber(phoneNumber);
  
      console.log('Validation result:', isValid);
  
      res.json({ valid: isValid, phoneNumber });
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({ valid: false, message: 'Server error' });
    }
  });
  
module.exports = router;
