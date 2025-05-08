const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);  // Import mongoose-sequence

// Create Tax schema
const taxSchema = new mongoose.Schema({
  tax_id: {
    type: Number,
    unique: true,  // Ensure tax_id is unique
  },
  property_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',  // Reference to Property model
    required: true,
  },
  tax_amount: {
    type: mongoose.Schema.Types.Decimal128,  // Decimal type for tax amount
    required: true,
  },
});

// Add auto-increment plugin to tax_id field
taxSchema.plugin(AutoIncrement, { inc_field: 'tax_id' });  // This will auto-increment tax_id

// Create the Tax model
const Tax = mongoose.model('Tax', taxSchema);

module.exports = Tax;
