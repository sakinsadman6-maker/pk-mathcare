const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  exam:        { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  examTitle:   { type: String },
  examSubject: { type: String },
  score:       { type: Number, required: true },
  total:       { type: Number, required: true },
  pct:         { type: Number, required: true },
  answers:     { type: [Number], default: [] },
  submittedAt: { type: Date, default: Date.now }
});

// One result per student per exam
resultSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
