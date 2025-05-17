// // const mongoose = require('mongoose');

// // // Create Citizen schema
// // const citizenSchema = new mongoose.Schema({
// //   citizen_id: {
// //     type: Number,
// //     unique: true,  // Ensure citizen_id is unique
// //   },
// //   name: {
// //     type: String,
// //     required: true,
// //   },
// //   phone_number: {
// //     type: String,
// //     required: true,
// //   },
// //   password: {
// //     type: String,
// //     required: true,
// //   },
// //   status: {
// //     type: String,
// //     enum: ['Active', 'Inactive'],  // Only 'Active' or 'Inactive'
// //     default: 'Active',  // Default to 'Active' if no status is specified
// //   },
// // });

// // // Hook to auto-generate citizen_id before saving
// // citizenSchema.pre('save', async function (next) {
// //   if (this.isNew) {
// //     // Find the latest citizen_id and increment it
// //     const lastCitizen = await this.constructor.findOne().sort('-citizen_id');  // Sort descending by citizen_id
// //     if (lastCitizen) {
// //       this.citizen_id = lastCitizen.citizen_id + 1;  // Increment the latest citizen_id
// //     } else {
// //       this.citizen_id = 1;  // Start from 1 if no citizen exists
// //     }
// //   }
// //   next();
// // });

// // // Create the Citizen model
// // const Citizen = mongoose.model('Citizen', citizenSchema);

// // module.exports = Citizen;




// const mongoose = require('mongoose');

// const citizenSchema = new mongoose.Schema({
//   citizen_id: {
//     type: Number,
//     unique: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   phone_number: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['Active', 'Inactive'],
//     default: 'Active',
//   },
// });

// citizenSchema.pre('save', async function (next) {
//   if (this.isNew) {
//     const lastCitizen = await this.constructor.findOne().sort('-citizen_id');
//     this.citizen_id = lastCitizen ? lastCitizen.citizen_id + 1 : 1;
//   }
//   next();
// });

// const Citizen = mongoose.model('Citizen', citizenSchema);

// module.exports = Citizen;



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
    enum: ['Active', 'Inactive'],
    default: 'Active',
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
