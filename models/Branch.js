const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    district_id: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
    branch_name: { type: String, required: true }
});

const Branch = mongoose.model('Branch', branchSchema);
module.exports = Branch;
