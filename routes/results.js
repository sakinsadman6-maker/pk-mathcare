const router = require('express').Router();
const auth   = require('../middleware/auth');
const Result = require('../models/Result');
const Exam   = require('../models/Exam');

// POST /api/results  — submit exam result
router.post('/', auth, async (req, res) => {
  try {
    const { examId, score, total, pct, answers } = req.body;
    if (!examId || score === undefined || !total || pct === undefined)
      return res.status(400).json({ message: 'examId, score, total, pct required' });

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Check if already submitted
    const existing = await Result.findOne({ student: req.user.id, exam: examId });
    if (existing) return res.status(400).json({ message: 'You already submitted this exam' });

    const result = await Result.create({
      student: req.user.id,
      studentName: req.user.name,
      exam: examId,
      examTitle: exam.title,
      examSubject: exam.subject,
      score, total, pct,
      answers: answers || []
    });
    res.json(result);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/results/my  — current student's results
router.get('/my', auth, async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id }).sort({ submittedAt: -1 });
    res.json(results);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/results/exam/:examId  — leaderboard for an exam
router.get('/exam/:examId', auth, async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId }).sort({ pct: -1 });
    res.json(results);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/results/all  — teacher: all results
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Teachers only' });
    const results = await Result.find().sort({ submittedAt: -1 }).populate('exam', 'title subject');
    res.json(results);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
