const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);  // Import mongoose-sequence for auto-increment

// Create Zone schema
const zoneSchema = new mongoose.Schema({
  zone_id: {
    type: Number,
    unique: true,  // Ensure zone_id is unique
  },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',  // Reference to Branch model
    required: true,
  },
  zone_name: {
    type: String,
    required: true,
  },
});

// Add auto-increment plugin to zone_id field
zoneSchema.plugin(AutoIncrement, { inc_field: 'zone_id' });  // Auto-increment the zone_id

// Create the Zone model
const Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;
