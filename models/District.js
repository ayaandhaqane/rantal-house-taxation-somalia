// const mongoose = require('mongoose');

// const districtSchema = new mongoose.Schema({
//     district_name: { type: String, required: true }
// });

// const District = mongoose.model('District', districtSchema);
// module.exports = District;


const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  district_name: { type: String, required: true }
});

const District = mongoose.model('District', districtSchema);
module.exports = District;
