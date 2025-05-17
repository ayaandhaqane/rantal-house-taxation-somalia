// // const mongoose = require('mongoose');

// // // Create Property schema
// // const propertySchema = new mongoose.Schema({
// //   property_id: {
// //     type: Number,
// //     unique: true,  // Ensure property_id is unique
// //   },
// //   citizen_id: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Citizen', // Reference to the Citizen model
// //     required: true,
// //   },
// //   house_no: {
// //     type: String,
// //     required: true,
// //   },
// //   district_id: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'District', // Reference to the District model
// //     required: true,
// //   },
// //   branch_id: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Branch', // Reference to the Branch model
// //     required: true,
// //   },
// //   zone_id: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Zone', // Reference to the Zone model
// //     required: true,
// //   },
// //   house_rent: {
// //     type: mongoose.Schema.Types.Decimal128, // Using Decimal128 for monetary values
// //     required: true,
// //   },
// //   tax: {
// //     type: mongoose.Schema.Types.Decimal128, // Using Decimal128 for monetary values
// //     required: true,
// //   },
// // });

// // // Hook to auto-generate property_id before saving
// // propertySchema.pre('save', async function (next) {
// //   if (this.isNew) {
// //     // Find the latest property_id and increment it
// //     const lastProperty = await this.constructor.findOne().sort('-property_id'); // Sort descending by property_id
// //     if (lastProperty) {
// //       this.property_id = lastProperty.property_id + 1; // Increment the latest property_id
// //     } else {
// //       this.property_id = 1; // Start from 1 if no property exists
// //     }
// //   }
// //   next();
// // });

// // // Create the Property model
// // const Property = mongoose.model('Property', propertySchema);

// // module.exports = Property;





// const mongoose = require('mongoose');

// const propertySchema = new mongoose.Schema({
//   property_id: {
//     type: Number,
//     unique: true,
//   },
//   citizen_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Citizen',
//     required: true,
//   },
//   house_no: {
//     type: String,
//     required: true,
//   },
//   district_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'District',
//     required: true,
//   },
//   branch_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Branch',
//     required: true,
//   },
//   zone_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Zone',
//     required: true,
//   },
//   house_rent: {
//     type: mongoose.Schema.Types.Decimal128,
//     required: true,
//   },
//   tax: {
//     type: mongoose.Schema.Types.Decimal128,
//     required: true,
//   },
//   register_date: {
//     type: Date,
//     required: true,
//   }
// });

// // Auto increment property_id before saving
// propertySchema.pre('save', async function(next) {
//   if (this.isNew) {
//     const lastProperty = await this.constructor.findOne().sort('-property_id');
//     this.property_id = lastProperty ? lastProperty.property_id + 1 : 1;
//   }
//   next();
// });

// const Property = mongoose.model('Property', propertySchema);

// module.exports = Property;





const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  property_id: {
    type: Number,
    unique: true,
  },
  citizen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true,
  },
  house_no: {
    type: String,
    required: true,
  },
  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  zone_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone',
    required: true,
  },
  house_rent: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  register_date: {
    type: Date,
    default: Date.now,
  },
});

// Auto-increment property_id before saving
propertySchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastProperty = await this.constructor.findOne().sort('-property_id');
    this.property_id = lastProperty ? lastProperty.property_id + 1 : 1;
  }
  next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
