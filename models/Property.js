const mongoose = require('mongoose');

/**
 * Creates a 3-letter prefix from a name.
 * It uppercases the name, collapses consecutive identical characters, and takes the first 3 letters.
 * e.g., "Daarusalam" -> "DAR", "Boondheere" -> "BON"
 * @param {string} name - The name to process.
 * @returns {string} A 3-letter prefix.
 */
const createPrefix = (name = '') => {
  if (!name) return 'XXX'; // Fallback for safety
  // 1. Uppercase, 2. Collapse consecutive letters (e.g., 'AA' -> 'A'), 3. Take first 3 chars.
  return name
    .toUpperCase()
    .replace(/(.)\1+/g, '$1') 
    .substring(0, 3);
};

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
    unique: true,
    // The 'required' flag is removed because this field is now generated automatically by the logic below.
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
  status: {
    type: String,
    enum: ['active', 'inactive',"pending"],
    default: 'active',
  },
  activation_date: {
    type: Date,
    default: Date.now,
  },
  inactivation_date: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Pre-save hook to generate property_id and house_no automatically
propertySchema.pre('save', async function (next) {
  if (this.isNew) {
    // --- Block 1: Auto-increment the numeric property_id ---
    const lastPropertyById = await this.constructor.findOne().sort({ property_id: -1 });
    this.property_id = lastPropertyById ? lastPropertyById.property_id + 1 : 1;

    // --- Block 2: Generate the custom house_no ---
    try {
      // Find the related district and branch to get their names
      // This assumes 'District' and 'Branch' are the registered model names in Mongoose
      const district = await mongoose.model('District').findById(this.district_id);
      const branch = await mongoose.model('Branch').findById(this.branch_id);

      if (!district || !branch) {
        throw new Error('Could not find District or Branch to generate house number.');
      }

      // Create the prefixes (e.g., "DAR" and "BON")
      const districtPrefix = createPrefix(district.district_name);
      const branchPrefix = createPrefix(branch.branch_name);
      const fullPrefix = `${districtPrefix}-${branchPrefix}`;

      // Find the last property with the same prefix to ensure the number is sequential
      // Note: This sorts by creation time. For extremely high-traffic sites, a separate counter collection would be more robust.
      const lastPropertyWithPrefix = await this.constructor
        .findOne({ house_no: { $regex: `^${fullPrefix}-` } })
        .sort({ createdAt: -1 });

      let nextNumber = 1;
      if (lastPropertyWithPrefix) {
        // Extract the number from the last house_no and increment it
        const lastNumberStr = lastPropertyWithPrefix.house_no.split('-').pop();
        const lastNumber = parseInt(lastNumberStr, 10);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }

      // Assign the newly generated house number
      this.house_no = `${fullPrefix}-${nextNumber}`;

    } catch (error) {
      // If any error occurs during generation, prevent the property from being saved.
      return next(error);
    }
  }
  next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;