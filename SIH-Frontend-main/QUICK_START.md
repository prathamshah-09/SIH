# Quick Start Guide - Appointment Management System

## 🚀 Running the Complete System

### Prerequisites
- Node.js v16+ and npm v8+
- Supabase account with PostgreSQL database
- Git for cloning/updating code

---

## 📦 Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd SIH-Backend

# Install dependencies
npm install

# Create .env file with your Supabase credentials:
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_KEY=xxxxx
# JWT_SECRET=your_secret_key

# Run database migrations (first time only)
npm run migrate

# Start the server
npm start
```

**Expected Output:**
```
Server is running on port 5000
```

**Verify**: Open http://localhost:5000/health in browser (if health endpoint exists)

---

## 🎨 Step 2: Frontend Setup (5 minutes)

```bash
# Navigate to frontend directory
cd SIH-Frontend/SIH/SIH-Frontend-main/frontend

# Install dependencies
npm install

# Create .env file:
# REACT_APP_API_URL=http://localhost:5000/api

# Start the development server
npm start
```

**Expected Output:**
```
webpack compiled with X warnings
Compiled successfully!
To create a production build, run npm run build.
```

**Auto-opens**: http://localhost:3000

---

## 👤 Step 3: Create Test Accounts (One-time)

### In Supabase Console:

**Account 1 - Student**
1. Go to Authentication → Users
2. Click "Add user"
3. Email: `student@example.com`
4. Password: `TestPassword123!`
5. Click "Create user"
6. Edit user → Custom claims / User metadata:
   ```json
   { "role": "student" }
   ```

**Account 2 - Counsellor**
1. Repeat above steps with:
   - Email: `counsellor@example.com`
   - Password: `TestPassword123!`
   - Metadata: `{ "role": "counsellor" }`

---

## ✅ Step 4: Test the System

### Login & Initial Setup

**As Student:**
1. Visit http://localhost:3000
2. Click "Sign In"
3. Enter: `student@example.com` / `TestPassword123!`
4. Navigate to "Appointments"

**As Counsellor:**
1. Sign out (top-right menu)
2. Click "Sign In"
3. Enter: `counsellor@example.com` / `TestPassword123!`
4. Navigate to "Appointments"

---

## 🧪 Step 5: Quick Feature Test (10 minutes)

### As Student:
1. Click "Book Appointment" tab
2. Select a date in calendar
3. Select a counsellor
4. Select a time slot
5. Add optional notes
6. Click "Book Appointment"
7. ✅ See success toast notification

### As Counsellor:
1. Click "Requests" tab
2. You should see the student's request
3. Click "Accept"
4. ✅ See success toast
5. Go to "Sessions" tab
6. ✅ See the appointment now in sessions
7. Click "Edit Notes"
8. Add notes and save
9. ✅ See success toast

---

## 🔍 Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process if needed
kill -9 <PID>

# Try again
npm start
```

### Frontend Won't Connect to Backend
```bash
# Verify backend is running
curl http://localhost:5000

# Check .env file in frontend has correct API URL
cat .env | grep REACT_APP_API_URL

# Should show: REACT_APP_API_URL=http://localhost:5000/api
```

### 403 Forbidden Error
**Problem**: Counsellor can't access endpoints  
**Solution**: Verify user metadata in Supabase:
1. Go to Supabase → Auth → Users
2. Click counsellor user
3. Check "User metadata" contains: `{ "role": "counsellor" }`

### Database Errors
```bash
# Check migrations ran
npm run migrate

# Check Supabase credentials in .env

# Verify tables exist in Supabase console
# Tables needed: appointments, profiles, counsellor_availability
```

---

## 📊 Checking System Health

### Backend Health Checks
```bash
# Check if backend is running
curl http://localhost:5000

# Check specific endpoint
curl http://localhost:5000/api/student/college-counsellors

# View backend logs in terminal
# Look for: [Auth], [Role Check], API response logs
```

### Frontend Health Checks
```bash
# Browser DevTools (F12)
# → Network tab: Check API calls
# → Console tab: Look for errors
# → Application tab: Check localStorage for auth token
```

### Database Health Checks
1. Supabase Console → SQL Editor
2. Run:
   ```sql
   SELECT COUNT(*) as appointment_count FROM appointments;
   SELECT COUNT(*) as user_count FROM auth.users;
   ```

---

## 🎯 Common Tasks

### Add Another Counsellor
1. In Supabase → Auth → Users
2. Add user with email: `counsellor2@example.com`
3. Set metadata: `{ "role": "counsellor" }`
4. In counsellor profile, update college/specialization

### View Booking Logs
1. Student books appointment → Check browser console
2. Backend receives request → Check terminal logs
3. Database stores → Check Supabase appointments table

### Debug API Calls
```javascript
// In browser console (F12)
// View last request/response
window.__lastResponse

// Check stored auth token
localStorage.getItem('sb-token')
```

---

## 📱 Testing on Mobile

### Using ngrok (for external access)
```bash
# Install ngrok: https://ngrok.com/download

# Expose backend
ngrok http 5000
# Note the URL: https://xxxxx.ngrok.io

# Update frontend .env:
# REACT_APP_API_URL=https://xxxxx.ngrok.io/api

# Restart frontend
npm start
```

### On Mobile Device
1. Find your computer's IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
2. On mobile: `http://[YOUR_IP]:3000`
3. Works on same WiFi network

---

## 🚀 Production Deployment

### Before Deploying
- [ ] All Step 10 tests pass
- [ ] No console errors
- [ ] Environment variables set securely
- [ ] Database backups taken
- [ ] API rate limiting configured
- [ ] CORS settings finalized

### Deploy Backend
```bash
# Using Heroku, Vercel, Railway, etc.
git push heroku main
# or equivalent for your platform
```

### Deploy Frontend
```bash
# Build for production
npm run build

# Deploy to Netlify, Vercel, AWS S3, etc.
npm run deploy
# or equivalent for your platform
```

---

## 📚 Documentation Reference

- **STEP_10_TESTING_GUIDE.md** - Comprehensive testing procedures
- **INTEGRATION_SUMMARY.md** - Complete system overview
- **STEP_9_ERROR_HANDLING.md** - Toast notification details
- **Backend README** - Backend-specific configuration
- **Frontend README** - Frontend-specific setup

---

## 💬 Getting Help

### Check These First
1. Verify backend is running: `http://localhost:5000`
2. Check frontend env: `frontend/.env`
3. View browser console for errors
4. Check backend terminal for logs
5. Verify user credentials and roles in Supabase

### Debug Mode
```bash
# Enable detailed logging in backend
DEBUG=* npm start

# Enable React DevTools in browser
# Install React Developer Tools extension
```

---

## ⏱️ Quick Reference

| Task | Command | Time |
|------|---------|------|
| Start backend | `npm start` (in SIH-Backend) | 5s |
| Start frontend | `npm start` (in frontend dir) | 10s |
| View logs | Check terminal where npm started | - |
| Stop server | Ctrl+C in terminal | 1s |
| Restart | Kill process, run npm start again | 5s |

---

## 🎉 You're Ready!

The system is now running and ready for testing. Start with Step 10 testing guide to verify all features work correctly.

**Next Steps:**
1. Follow STEP_10_TESTING_GUIDE.md
2. Test all features (student and counsellor)
3. Document any issues found
4. Fix issues and retest
5. Deploy when ready

---

**Status**: ✅ System ready for testing and deployment
