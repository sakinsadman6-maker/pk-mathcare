const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true },
  password:         { type: String, required: true, minlength: 6 },
  role:             { type: String, enum: ['student', 'teacher'], default: 'student' },
  class:            { type: String, default: '' },
  approvalStatus:   { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  banned:           { type: Boolean, default: false },
  banReason:        { type: String, default: '' },
  createdAt:        { type: Date, default: Date.now }
});

// Hash password before save (only if not already hashed by seeder)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // Only hash if not already a bcrypt hash
  if (!this.password.startsWith('$2')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
