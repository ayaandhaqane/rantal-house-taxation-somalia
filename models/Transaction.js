// // // models/Transaction.js

// // const mongoose = require('mongoose');

// // const transactionSchema = new mongoose.Schema({
// //   property_id: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Property',
// //     required: true,
// //   },
// //   tax_collection_id: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'TaxCollection',
// //     required: true,
// //   },
// //   payment_id: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Payment',
// //   },
// //   amount_paid: {
// //     type: mongoose.Schema.Types.Decimal128,
// //     required: true,
// //   },
// //   amount_due: {
// //     type: mongoose.Schema.Types.Decimal128,
// //     required: true,
// //   },
// //   status: {
// //     type: String,
// //     enum: ['paid', 'partial', 'overdue'],
// //     required: true,
// //   },
// //   created_at: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // const Transaction = mongoose.model('Transaction', transactionSchema);

// // module.exports = Transaction;




// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   property_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Property',
//     required: true,
//   },
//   tax_collection_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'TaxCollection',
//     required: true,
//   },
//   payment_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Payment',
//   },
//   amount_paid: {
//     type: mongoose.Schema.Types.Decimal128,
//     required: true,
//   },
//   amount_due: {
//     type: mongoose.Schema.Types.Decimal128,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['paid', 'partial', 'overdue'],
//     required: true,
//   },
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// module.exports = Transaction;



// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   property_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Property',
//     required: true,
//   },
//   tax_collection_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'TaxCollection',
//     required: true,
//   },
//   payment_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Payment',
//   },
//   citizen_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Citizen',  // assuming you have a Citizen model that you link the transaction to
//     required: true,
//   },
//   amount_paid: {
//     type: mongoose.Schema.Types.Decimal128,
//     required: true,
//   },
//   amount_due: {
//     type: mongoose.Schema.Types.Decimal128,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['paid', 'partial', 'overdue'],
//     required: true,
//   },
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// module.exports = Transaction;



const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  property_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  tax_collection_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaxCollection',
    required: true,
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  citizen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true,
  },
  amount_paid: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  amount_due: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  status: {
  type: String,
  enum: ['paid', 'overdue', ], // Add 'due' as a valid option
  required: true,
},

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
