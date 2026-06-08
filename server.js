require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: '*', // After Netlify deploy, replace with your Netlify URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ── MongoDB Connection ──────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ Missing MONGO_URI environment variable. Set it in .env or in your deployment settings.');
  process.exit(1);
}

mongoose.set('strictQuery', false);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });

    console.log('✅ MongoDB connected successfully');
    await seedDatabase(); // seed demo data on first run

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();

// ── Routes ──────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/exams',     require('./routes/exams'));
app.use('/api/results',   require('./routes/results'));
app.use('/api/students',  require('./routes/students'));

// ── Health check ────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'PK Mathcare API running ✅' }));

// ── Seed demo data ──────────────────────────────────────
async function seedDatabase() {
  const User     = require('./models/User');
  const Question = require('./models/Question');
  const Exam     = require('./models/Exam');
  const bcrypt   = require('bcryptjs');

  // Seed teacher account
  const teacherExists = await User.findOne({ role: 'teacher' });
  if (!teacherExists) {
    await User.create({
      name: 'Teacher Admin',
      email: 'teacher@demo.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'teacher',
      class: 'N/A',
      approvalStatus: 'approved'
    });
    console.log('👨‍🏫 Demo teacher account created');
  }

  // Seed demo student
  const studentExists = await User.findOne({ email: 'student@demo.com' });
  if (!studentExists) {
    await User.create({
      name: 'Fatima Khatun',
      email: 'student@demo.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'student',
      class: 'Class 12 (HSC)',
      approvalStatus: 'approved'
    });
    console.log('👩‍🎓 Demo student account created');
  }

  // Seed questions
  const qCount = await Question.countDocuments();
  if (qCount === 0) {
    await Question.insertMany([
      { text: "Which of the following is Newton's Second Law of Motion?", subject: 'Physics', options: ['F = ma','E = mc²','PV = nRT','v = u + at'], correct: 0 },
      { text: 'Speed of light in vacuum is?', subject: 'Physics', options: ['3×10⁸ m/s','3×10⁶ m/s','3×10¹⁰ m/s','3×10⁴ m/s'], correct: 0 },
      { text: "What is Ohm's Law?", subject: 'Physics', options: ['V = IR','V = I/R','V = R/I','V = I²R'], correct: 0 },
      { text: 'What is the chemical symbol for Gold?', subject: 'Chemistry', options: ['Go','Gd','Au','Ag'], correct: 2 },
      { text: 'Which gas is most abundant in the atmosphere?', subject: 'Chemistry', options: ['Oxygen','Hydrogen','Carbon dioxide','Nitrogen'], correct: 3 },
      { text: 'Atomic number of Hydrogen?', subject: 'Chemistry', options: ['2','1','3','0'], correct: 1 },
      { text: 'The powerhouse of the cell is?', subject: 'Biology', options: ['Nucleus','Ribosome','Mitochondria','Golgi body'], correct: 2 },
      { text: 'DNA stands for?', subject: 'Biology', options: ['Deoxyribose Nucleic Acid','Deoxyribonucleic Acid','Deoxyribose Nitrogen Acid','Dideoxyribonucleic Acid'], correct: 1 },
      { text: 'What is the value of π (pi) approximately?', subject: 'Mathematics', options: ['2.718','3.14159','1.618','1.414'], correct: 1 },
      { text: 'What is the quadratic formula?', subject: 'Mathematics', options: ['x = -b ± √(b²-4ac) / 2a','x = b ± √(b²+4ac) / 2a','x = -b / 2a','x = -(b²-4ac)'], correct: 0 },
      { text: 'Who wrote "Romeo and Juliet"?', subject: 'English 1st Paper', options: ['Charles Dickens','William Shakespeare','Jane Austen','Mark Twain'], correct: 1 },
      { text: 'Which of the following is a correct sentence?', subject: 'English 1st Paper', options: ['He go to school','She is going to school','They goes to school','We was happy'], correct: 1 },
      { text: 'The synonym of "Brave" is?', subject: 'English 1st Paper', options: ['Coward','Timid','Courageous','Weak'], correct: 2 },
      { text: 'Identify the correct spelling:', subject: 'English 2nd Paper', options: ['Accomodate','Accommodate','Acommodate','Acomodate'], correct: 1 },
      { text: 'Capital of Bangladesh?', subject: 'BGS', options: ['Chittagong','Sylhet','Dhaka','Rajshahi'], correct: 2 },
      { text: 'বাংলাদেশ কত সালে স্বাধীনতা লাভ করে?', subject: 'BGS', options: ['১৯৭০','১৯৭১','১৯৭২','১৯৬৯'], correct: 1 },
      { text: 'বাংলাদেশের মুক্তিযুদ্ধে কতজন শহীদ হন?', subject: 'BGS', options: ['২০ লক্ষ','২৫ লক্ষ','৩০ লক্ষ','৩৫ লক্ষ'], correct: 2 },
      { text: 'বাংলাদেশের জাতীয় কবি কে?', subject: 'বাংলা ১ম পত্র', options: ['রবীন্দ্রনাথ ঠাকুর','কাজী নজরুল ইসলাম','জসীমউদ্দীন','শামসুর রাহমান'], correct: 1 },
      { text: '"আমার সোনার বাংলা" কবিতাটি কে লিখেছেন?', subject: 'বাংলা ১ম পত্র', options: ['কাজী নজরুল ইসলাম','রবীন্দ্রনাথ ঠাকুর','জীবনানন্দ দাশ','মাইকেল মধুসূদন দত্ত'], correct: 1 },
      { text: 'বাংলা বর্ণমালায় মোট বর্ণ কতটি?', subject: 'বাংলা ২য় পত্র', options: ['৪৮','৫০','৪৬','৫২'], correct: 0 },
      { text: 'ইসলামের স্তম্ভ কয়টি?', subject: 'Islam & Moral Education', options: ['৩টি','৪টি','৫টি','৬টি'], correct: 2 },
      { text: 'পবিত্র কুরআন শরীফে কতটি সূরা আছে?', subject: 'Islam & Moral Education', options: ['১১২টি','১১৪টি','১১৬টি','১২০টি'], correct: 1 },
      { text: 'হিন্দু ধর্মের পবিত্র গ্রন্থের নাম কী?', subject: 'Hinduism & Moral Education', options: ['বেদ','কুরআন','বাইবেল','ত্রিপিটক'], correct: 0 },
      { text: 'দুর্গাপূজায় কতদিন পূজা করা হয়?', subject: 'Hinduism & Moral Education', options: ['৩ দিন','৫ দিন','৭ দিন','১০ দিন'], correct: 1 },
    ]);
    console.log('❓ Demo questions seeded');
  }

  // Seed demo exams
  const eCount = await Exam.countDocuments();
  if (eCount === 0) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    await Exam.insertMany([
      { title: 'Physics Fundamentals', subject: 'Physics', questionCount: 5, duration: 15, date: today, time: '10:00', status: 'live' },
      { title: 'BGS & General Knowledge', subject: 'BGS', questionCount: 5, duration: 20, date: tomorrow, time: '14:00', status: 'upcoming' },
      { title: 'Chemistry Basics', subject: 'Chemistry', questionCount: 4, duration: 12, date: yesterday, time: '09:00', status: 'completed' },
    ]);
    console.log('📅 Demo exams seeded');
  }
}

// ── Start server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
