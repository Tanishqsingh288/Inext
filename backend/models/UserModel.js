const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  dob:       { type: Date, required: true },
  address:   { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, required: true, unique: true },
  photo:     { type: String }, // Store photo path
  password:  { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
