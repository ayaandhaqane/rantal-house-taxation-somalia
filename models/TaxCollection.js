// models/TaxCollection.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const taxCollectionSchema = new mongoose.Schema({
  tax_collection_id: {
    type: Number,
    unique: true,
  },
  citizen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true,
  },
  property_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  tax_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tax',
    required: true,
  },
  quarter: {
    type: String, // 'Q1', 'Q2', 'Q3', 'Q4'
    required: true,
  },
  property_register_date: {
    type: Date,
    required: true, // This will hold the property registration date
  },
  due_date: {
    type: Date,
    required: true,
  },
  amount_due: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  status: {
    type: String, // 'due', 'paid', 'overdue'
    default: 'due',
  },
  paid_at: {
    type: Date,
  },

  // New fields
  total_unpaid_quarters: { type: Number, default: 0 },
  amount_per_quarter: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  total_due: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  earliest_due_date: { type: Date },
  latest_due_date: { type: Date },
  message: { type: String },
});

taxCollectionSchema.plugin(AutoIncrement, { inc_field: 'tax_collection_id' });

const TaxCollection = mongoose.model('TaxCollection', taxCollectionSchema);
module.exports = TaxCollection;
