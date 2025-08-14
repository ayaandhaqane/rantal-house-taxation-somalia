const mongoose = require('mongoose');
const District = require('../models/District'); // Import District model
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  district: { 
    type: mongoose.Schema.Types.ObjectId, // HADII AAD ISKA HAYSO ObjectID
    ref: 'District', // REFERENCE MODEL
    required: function() { return this.role === 'user'; } 
  },
  avatarUrl: { type: String },
  userId: { type: String, unique: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  otp: Number,
  otpExpires: Date,
  
}, 
{ timestamps: true });

// Pre-save hook to generate userId
UserSchema.pre('save', async function(next) {
  if (!this.userId) {
    try {
      if (this.role === 'admin') {
        // ADMIN: adm-001, adm-002, ...
        const lastAdmin = await this.constructor.findOne({ role: 'admin' }).sort({ userId: -1 });
        let seq = lastAdmin ? parseInt(lastAdmin.userId.split('-')[1]) + 1 : 1;
        this.userId = `adm-${String(seq).padStart(3, '0')}`;
      } else {
        // USER: emp-{district3letters}-001
        if (!this.district) throw new Error('User must have a district!');
        
        // HAYSO MAGACA DISTRICT-KA (HADII AY ObjectID YIHIIN)
        const districtDoc = await mongoose.model('District').findById(this.district);
        if (!districtDoc) throw new Error('District not found!');
        
        const districtName = districtDoc.district_name; // TUSHAALE: "Mogadishu"
        const districtPrefix = districtName.toLowerCase().substring(0, 3); // "mog"
        
        // USER COUNT IN THIS DISTRICT
        const lastUserInDistrict = await this.constructor.findOne({ 
          role: 'user', 
          district: this.district 
        }).sort({ userId: -1 });
        
        let seq = 1;
        if (lastUserInDistrict && lastUserInDistrict.userId) {
          const parts = lastUserInDistrict.userId.split('-');
          seq = parseInt(parts[2]) + 1; // TUSHAALE: "emp-mog-003" → seq = 4
        }
        
        this.userId = `emp-${districtPrefix}-${String(seq).padStart(3, '0')}`; 
      }
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});
// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('User', UserSchema);