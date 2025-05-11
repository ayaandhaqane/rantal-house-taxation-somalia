// const mongoose = require('mongoose');

// // Define the schema for Admin
// const AdminSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, default: "admin" },
// }, {
//   timestamps: true // Automatically adds createdAt and updatedAt fields
// });

// module.exports = mongoose.model('Admin', AdminSchema);

const mongoose = require('mongoose');

// Define the schema for Admin
const AdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Admin', AdminSchema);
