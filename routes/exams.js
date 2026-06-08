const router = require('express').Router();
const auth   = require('../middleware/auth');
const Exam   = require('../models/Exam');

// GET /api/exams
router.get('/', auth, async (req, res) => {
  try {
    // Auto-update statuses based on date
    const today = new Date().toISOString().split('T')[0];
    await Exam.updateMany({ date: { $lt: today }, status: 'upcoming' }, { status: 'live' });
    await Exam.updateMany({ date: { $lt: today }, status: 'live',
      $where: function() {
        const examDate = new Date(this.date);
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return examDate < cutoff;
      }
    }, { status: 'completed' }).catch(() => {}); // ignore $where errors on Atlas free tier

    const exams = await Exam.find().sort({ date: -1 });
    res.json(exams);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/exams  — teacher only
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Teachers only' });
    const { title, subject, questionCount, duration, date, time } = req.body;
    if (!title || !subject || !questionCount || !duration || !date || !time)
      return res.status(400).json({ message: 'All fields required' });

    const today = new Date().toISOString().split('T')[0];
    const status = date <= today ? 'live' : 'upcoming';
    const exam = await Exam.create({ title, subject, questionCount, duration, date, time, status, createdBy: req.user.id });
    res.json(exam);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/exams/:id/status  — teacher only (manually set status)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Teachers only' });
    const exam = await Exam.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(exam);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/exams/:id  — teacher only
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Teachers only' });
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
