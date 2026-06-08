const router   = require('express').Router();
const auth     = require('../middleware/auth');
const Question = require('../models/Question');

// GET /api/questions  — optionally filter by ?subject=Physics
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.query.subject ? { subject: req.query.subject } : {};
    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/questions  — teacher only
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Teachers only' });
    const { text, subject, options, correct } = req.body;
    if (!text || !subject || !options || options.length !== 4 || correct === undefined)
      return res.status(400).json({ message: 'All fields required (text, subject, 4 options, correct index)' });
    const q = await Question.create({ text, subject, options, correct });
    res.json(q);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/questions/:id  — teacher only
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher')
      return res.status(403).json({ message: 'Teachers only' });
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
