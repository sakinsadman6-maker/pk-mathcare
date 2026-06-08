# PK Mathcare MCQ Platform - Full Setup Guide

A complete MCQ examination platform with MongoDB, Node.js backend, and Netlify frontend deployment.

## System Features ✨

### For Students 👩‍🎓
- **User Registration** (requires teacher approval)
- **Live Exam Taking** with timer
- **Score Tracking & Results**
- **Leaderboard & Rankings**
- **Answer Review System**
- **Multiple Subjects Support**

### For Teachers 👨‍🏫
- **Student Approval System** (pending, approved, rejected)
- **Ban/Unban Students**
- **Question Bank Management**
- **Exam Scheduling**
- **Results Dashboard**
- **Student Management**

---

## 🚀 Quick Start (5 Steps)

### Step 1: Setup MongoDB Atlas (Free)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create M0 cluster
3. Add database user:
   - Username: `salmaict12020_db_user`
   - Password: `gxWqj8FZU6omRVzv`
4. Network Access → Add IP `0.0.0.0/0`
5. Click "Connect" → Copy connection string (already in `.env`)

### Step 2: Deploy Backend to Render
1. **Push backend to GitHub:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pk-mathcare-backend.git
   git push -u origin main
   ```

2. **Deploy to Render:**
   - Go to [render.com](https://render.com) → New → Web Service
   - Connect your GitHub repo (`pk-mathcare-backend`)
   - Settings:
     - Runtime: `Node`
     - Build Command: `npm install`
     - Start Command: `node server.js`
   - Add Environment Variables:
     - `MONGO_URI`: (from your .env)
     - `JWT_SECRET`: (from your .env)
   - Click "Deploy"
   - Copy your Render URL: `https://pk-mathcare-api-xxxx.onrender.com`

### Step 3: Update Frontend API URL
1. Open `frontend/index.html`
2. Find line: `const API = 'https://pk-mathcare-api.onrender.com/api';`
3. Replace with your Render URL:
   ```javascript
   const API = 'https://pk-mathcare-api-xxxx.onrender.com/api';
   ```

### Step 4: Deploy Frontend to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag & drop `frontend/index.html`
4. Done! You get a live URL like `https://pk-mathcare.netlify.app`

### Step 5: Update CORS (Optional Security)
In `backend/server.js`, line ~13:
```javascript
// Before production, restrict to your Netlify URL:
app.use(cors({ origin: 'https://pk-mathcare.netlify.app' }));
```

---

## 📋 Demo Accounts

### Teacher (Admin)
- Email: `teacher@demo.com`
- Password: `admin123`
- Auto-approved

### Student (Pre-approved for demo)
- Email: `student@demo.com`
- Password: `demo123`
- Auto-approved

---

## 🔑 Key Features

### Registration & Approval
1. New students register
2. Account status: **Pending** (waiting for teacher)
3. Teacher reviews and approves/rejects
4. Student can login only if **Approved**
5. Login blocked if account is **Banned**

### Ban System
- Teachers can ban students
- Banned students cannot login
- Optional ban reason displayed
- Teachers can unban anytime

### Exam Management
- Auto-status update based on date:
  - **Upcoming** (future date)
  - **Live** (today or past date)
  - **Completed** (manually marked or 24hrs old)

### Result Submission
- One result per student per exam (prevents duplicate submissions)
- Automatic leaderboard generation
- Score breakdown & statistics

---

## 📁 Project Structure

```
pk-mathcare/
├── backend/                    # Node.js + Express API
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   ├── .env                   # MongoDB & JWT config
│   ├── models/
│   │   ├── User.js            # Student/Teacher schema
│   │   ├── Question.js
│   │   ├── Exam.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── auth.js            # Login, register, approvals
│   │   ├── questions.js       # CRUD questions
│   │   ├── exams.js           # CRUD exams
│   │   ├── results.js         # Submit & fetch results
│   │   └── students.js        # Ban/unban students
│   └── middleware/
│       └── auth.js            # JWT verification
│
└── frontend/                   # HTML/CSS/JS SPA
    └── index.html             # Single-page app (update API URL here)
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Register new student (pending approval)
- `POST /api/auth/login` - Login (checks approval & ban status)
- `GET /api/auth/pending-approvals` - List pending students (teacher only)
- `POST /api/auth/approve/:userId` - Approve student (teacher only)
- `POST /api/auth/reject/:userId` - Reject student (teacher only)

### Questions
- `GET /api/questions?subject=Physics` - Fetch questions
- `POST /api/questions` - Add question (teacher only)
- `DELETE /api/questions/:id` - Delete question (teacher only)

### Exams
- `GET /api/exams` - List all exams
- `POST /api/exams` - Create exam (teacher only)
- `PUT /api/exams/:id/status` - Update status (teacher only)

### Results
- `POST /api/results` - Submit exam result
- `GET /api/results/my` - Get student's results
- `GET /api/results/exam/:examId` - Get leaderboard
- `GET /api/results/all` - All results (teacher only)

### Students
- `GET /api/students` - List all students (teacher only)
- `POST /api/students/ban/:id` - Ban student (teacher only)
- `POST /api/students/unban/:id` - Unban student (teacher only)

---

## 🛠 Local Development

### Run Backend Locally
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### Run Frontend Locally
```bash
cd frontend
# Open index.html in browser
# Or use Live Server in VS Code
```

### Change API to Local
In `frontend/index.html`:
```javascript
const API = 'http://localhost:5000/api';
```

---

## 📱 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🔐 Security Notes
1. **Passwords** are hashed with bcrypt (10 rounds)
2. **JWT tokens** expire in 7 days
3. **CORS** restricted to frontend domain in production
4. **Never commit** .env to GitHub
5. **MongoDB credentials** from MongoDB Atlas

---

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
- Check `.env` has correct `MONGO_URI`
- Verify IP whitelist in MongoDB Atlas (add `0.0.0.0/0`)
- Test connection: `mongodb+srv://username:password@cluster.mongodb.net/test?authSource=admin`

### "Frontend can't reach API"
- Verify Render URL is correctly set in `frontend/index.html`
- Check CORS policy in `backend/server.js`
- Test API directly: `https://pk-mathcare-api-xxx.onrender.com/`

### "Student can't login after registration"
- Teacher must approve the registration first
- Check `Pending Approvals` section in teacher admin
- Student status should change to "approved"

### "Banned students still logging in"
- Clear browser cache & localStorage
- Logout first with `localStorage.clear()`
- Verify banned flag in MongoDB

---

## 📞 Support
For issues, check:
1. MongoDB Atlas connection status
2. Render deployment logs
3. Browser console (F12)
4. Network tab for API errors

---

## 📄 License
Educational project - Free to use & modify

## ✨ Made with ❤️ for PK Mathcare
