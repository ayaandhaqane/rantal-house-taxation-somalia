const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const taxSchema = new mongoose.Schema({
  tax_id: {
    type: Number,
    unique: true,
  },
  property_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  tax_amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
});

taxSchema.plugin(AutoIncrement, { inc_field: 'tax_id' });

const Tax = mongoose.model('Tax', taxSchema);

module.exports = Tax;
