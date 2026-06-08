const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, class: cls, profilePhoto } = req.body;
    if (!name || !email || !password || !cls)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      class: cls,
      profilePhoto: profilePhoto || '',
      role: 'student',
      approvalStatus: 'pending'
    });
    res.json({ message: 'Registration successful! Please wait for teacher approval.' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email, role: role || 'student' });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if banned
    if (user.banned) 
      return res.status(403).json({ message: `Account banned${user.banReason ? ': ' + user.banReason : ''}` });

    // Check if approved (for students only, teachers auto-approved)
    if (user.role === 'student' && user.approvalStatus !== 'approved') {
      if (user.approvalStatus === 'pending')
        return res.status(403).json({ message: 'Your account is pending teacher approval' });
      if (user.approvalStatus === 'rejected')
        return res.status(403).json({ message: 'Your account registration was rejected. Contact your teacher.' });
    }

    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        class: user.class,
        profilePhoto: user.profilePhoto || ''
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// GET /api/auth/pending-approvals — teacher only
router.get('/pending-approvals', require('../middleware/auth'), async (req, res) => {
  try {
    if (req.user.role !== 'teacher') 
      return res.status(403).json({ message: 'Teachers only' });
    const pending = await User.find({ approvalStatus: 'pending' }).select('-password').sort({ createdAt: -1 });
    res.json(pending);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/approve/:userId — teacher only
router.post('/approve/:userId', require('../middleware/auth'), async (req, res) => {
  try {
    if (req.user.role !== 'teacher') 
      return res.status(403).json({ message: 'Teachers only' });
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { approvalStatus: 'approved' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Student approved', user });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/reject/:userId — teacher only
router.post('/reject/:userId', require('../middleware/auth'), async (req, res) => {
  try {
    if (req.user.role !== 'teacher') 
      return res.status(403).json({ message: 'Teachers only' });
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { approvalStatus: 'rejected' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Student rejected', user });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
