const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const zoneSchema = new mongoose.Schema({
  zone_id: { type: Number, unique: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  zone_name: { type: String, required: true },
});

// Auto-increment zone_id
zoneSchema.plugin(AutoIncrement, { inc_field: 'zone_id' });

const Zone = mongoose.model('Zone', zoneSchema);
module.exports = Zone;
