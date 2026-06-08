# 🚀 Deployment Checklist

## Pre-Deployment
- [ ] MongoDB Atlas cluster created & connected
- [ ] Database user credentials noted
- [ ] Backend code pushed to GitHub repo
- [ ] `.env` file created with MongoDB URI & JWT secret
- [ ] Local backend tested (`npm install && npm start`)

## Backend Deployment (Render)
- [ ] Signed up at render.com
- [ ] GitHub repo connected to Render
- [ ] Web Service created
- [ ] Environment variables added:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `PORT=5000`
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Deployment successful (check logs)
- [ ] Test API: Visit `https://pk-mathcare-api-xxx.onrender.com/`
- [ ] Copy Render URL for frontend

## Frontend Deployment (Netlify)
- [ ] Updated `frontend/index.html`:
  - [ ] Line 5: `const API = 'https://pk-mathcare-api-xxx.onrender.com/api';`
- [ ] Signed up at netlify.com
- [ ] File ready to deploy: `frontend/index.html`
- [ ] Deployed via "Deploy manually"
- [ ] Site is live: `https://pk-mathcare-xxx.netlify.app`
- [ ] Test login with demo accounts

## Post-Deployment Testing
- [ ] Homepage loads without errors
- [ ] Teacher login works (`teacher@demo.com` / `admin123`)
- [ ] Student login works (`student@demo.com` / `demo123`)
- [ ] New student registration works
- [ ] Pending approvals appear for teacher
- [ ] Teacher can approve/reject students
- [ ] Approved students can login
- [ ] Can add questions (teacher)
- [ ] Can schedule exams (teacher)
- [ ] Can take exam (student)
- [ ] Results save to MongoDB
- [ ] Leaderboard displays correctly

## Security Checklist (Before Production)
- [ ] Update CORS in `backend/server.js` with Netlify URL
- [ ] Remove demo accounts (or change passwords)
- [ ] Set strong JWT_SECRET
- [ ] Enable MongoDB password protection
- [ ] Restrict MongoDB IP whitelist to Render IP (if possible)
- [ ] Enable HTTPS (automatically on Render & Netlify)

## Monitoring
- [ ] Check Render deployment status daily
- [ ] Monitor MongoDB Atlas usage
- [ ] Review student applications regularly
- [ ] Back up MongoDB data periodically

---

## 📱 Live URLs
- Backend API: `https://pk-mathcare-api-xxx.onrender.com`
- Frontend: `https://pk-mathcare-xxx.netlify.app`

## 🔑 Demo Credentials
**Teacher:**
- Email: teacher@demo.com
- Pass: admin123

**Student:**
- Email: student@demo.com
- Pass: demo123

---

## ⚡ Performance Tips
1. MongoDB Atlas Auto-pause: Disable for free tier (always-on)
2. Render: Upgrade to paid plan for persistent uptime (free tier sleeps)
3. Netlify: Already has global CDN (fast)

---

## 📊 Database Size Estimate
- 100 students: ~50KB
- 1000 questions: ~200KB
- 10,000 exam results: ~500KB
- **Total:** Usually < 10MB (plenty for free tier)

---

Last updated: June 2026 ✨
