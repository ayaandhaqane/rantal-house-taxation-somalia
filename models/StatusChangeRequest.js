const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusChangeRequestSchema = new Schema(
  {
    // This new field tells us what kind of request this is.
    requestType: {
      type: String,
      enum: ['statusChange', 'deleteCitizen'],
      required: true,
    },
    // This is now only required for status change requests.
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: function() { return this.requestType === 'statusChange'; },
    },
    // This new field is for delete requests.
    citizen_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Citizen',
      required: function() { return this.requestType === 'deleteCitizen'; },
    },
    // This is also only required for status change requests.
    requestedStatus: {
      type: String,
      enum: ['active', 'inactive'],
      required: function() { return this.requestType === 'statusChange'; },
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approval_date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const StatusChangeRequest = mongoose.model('StatusChangeRequest', statusChangeRequestSchema);

module.exports = StatusChangeRequest;