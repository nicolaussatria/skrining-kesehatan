
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  weight: Number,
  height: Number,
  education: String,
  familyContact: {
    name: String,
    address: String,
    phone: String,
    email: String,
  },
  healthQuestions: {
    klinis: { type: Object, default: {} },
    kesehatanDiri: { type: Object, default: {} },
    kesehatanKeluarga: { type: Object, default: {} },
    konsumsiMakanan: { type: Object, default: {} },
  },
  riskLevel: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
