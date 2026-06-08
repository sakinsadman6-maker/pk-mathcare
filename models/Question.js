const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  subject:   { type: String, required: true },
  options:   { type: [String], required: true, validate: v => v.length === 4 },
  correct:   { type: Number, required: true, min: 0, max: 3 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
