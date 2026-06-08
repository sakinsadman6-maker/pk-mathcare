const router = require('express').Router();
const auth   = require('../middleware/auth');
const User   = require('../models/User');

// GET /api/students  — teacher: list all students
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Teachers only' });
    const students = await User.find({ role: 'student' }, '-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/students/ban/:id — teacher: ban a student
router.post('/ban/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Teachers only' });
    const { reason } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { banned: true, banReason: reason || 'Banned by teacher' },
      { new: true }
    ).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student banned', student });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/students/unban/:id — teacher: unban a student
router.post('/unban/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Teachers only' });
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { banned: false, banReason: '' },
      { new: true }
    ).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student unbanned', student });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

