const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  subject:       { type: String, required: true },
  questionCount: { type: Number, required: true },
  duration:      { type: Number, required: true },
  date:          { type: String, required: true },
  time:          { type: String, required: true },
  status:        { type: String, enum: ['live', 'upcoming', 'completed'], default: 'upcoming' },
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema);
