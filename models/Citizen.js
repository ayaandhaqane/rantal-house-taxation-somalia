const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
  citizen_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],  
    default: 'active'
  },

  activation_date: { type: Date, default: Date.now },
  inactivation_date: { type: Date, default: null },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This should be the name of your User/Admin model
    required: false,
  },
  profile_image: { 
    type: String, 
    default: null 
    // Store filename or relative path like 'uploads/filename.jpg'
  },
});

// Auto-generate citizen_id before saving
citizenSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastCitizen = await this.constructor.findOne().sort('-citizen_id');
    if (lastCitizen) {
      this.citizen_id = lastCitizen.citizen_id + 1;
    } else {
      this.citizen_id = 1;
    }
  }
  next();
});

const Citizen = mongoose.model('Citizen', citizenSchema);

module.exports = Citizen;
