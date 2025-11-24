# Backend Migration Guide

## Current Status
✅ **Python/MongoDB backend removed**
✅ **Frontend running with mock data (localStorage fallback)**

## What Was Removed
- `backend/` folder (Python Flask/MongoDB)
- `backend_test.py`
- Backend environment configuration

## Current Frontend Setup

### Mock Data Sources
The frontend now uses mock data from:
- `frontend/src/mock/mockData.js` - Contains all mock data for users, announcements, assessments, communities, etc.
- `localStorage` - Used as a fallback database for runtime data (communities, assessments, submissions)

### Frontend Components Ready for Backend
All frontend components already have fallback logic for when `VITE_BACKEND_URL` is not set:

1. **Authentication** (`AuthContext.jsx`) - Uses `mockUsers` + localStorage
2. **Assessment** - Uses `mockForms` + localStorage for submissions
3. **Community** - Uses `mockCommunityChats` + localStorage
4. **Direct Messages** - Fully frontend-based

### Environment Variable
The `.env` file is configured:
```
VITE_BACKEND_URL=
```
This empty value tells the frontend to use mock data only.

---

## Building Your Node/Express + Supabase Backend

### 1. Create Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js (Supabase connection)
│   │   └── env.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── assessment.js
│   │   ├── community.js
│   │   ├── appointments.js
│   │   └── admin.js
│   ├── controllers/
│   ├── middleware/
│   └── app.js
├── .env
├── .env.example
├── package.json
└── server.js
```

### 2. Required API Endpoints

#### Authentication
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/register`
- `PUT /api/users/:id/profile`
- `POST /api/users/:id/change-password`

#### Assessments
- `POST /api/assessment/session` - Create assessment session
- `GET /api/assessment/forms` - Get all assessment forms
- `POST /api/assessment/submit` - Submit form responses
- `GET /api/assessment/submissions/:sessionId` - Get user submissions
- `GET /api/assessment/guidance/:formId/:score` - Get guidance based on score
- `GET /api/admin/assessment/aggregate` - Admin aggregate data

#### Community
- `GET /api/communities` - List all communities
- `POST /api/communities` - Create community
- `PUT /api/communities/:id` - Update community
- `DELETE /api/communities/:id` - Delete community
- `GET /api/users/:id/communities` - Get user's communities
- `GET /api/communities/:id/messages` - Get community messages

#### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `GET /api/counsellors` - List available counsellors

#### Admin
- `GET /api/admin/assessment/aggregate` - Assessment statistics

### 3. Database Schema (Supabase)

Key tables to create:
- `users` (id, email, password_hash, role, name, avatar, created_at)
- `assessment_forms` (id, name, type, questions_json)
- `assessment_submissions` (id, user_id, form_id, responses_json, score, severity, created_at)
- `communities` (id, title, description, created_by, created_at)
- `community_messages` (id, community_id, user_id, content, created_at)
- `appointments` (id, student_id, counsellor_id, date, time, status, type)
- `announcements` (id, title, content, type, created_at)

### 4. Environment Variables (.env)
```
NODE_ENV=development
PORT=5000

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 5. Frontend Integration

Update `.env` when backend is ready:
```
VITE_BACKEND_URL=http://localhost:5000
```

The frontend will automatically detect this and use the real API instead of mock data.

---

## Tips for Development

1. **Use localStorage for offline testing** - The frontend will persist data during development
2. **Test with mock data first** - Verify UI/UX before backend integration
3. **Implement API gradually** - Start with auth, then assessments, then communities
4. **Use Supabase realtime** - For live community chat updates
5. **Test CORS carefully** - Ensure backend allows frontend requests

---

## Files to Keep/Reference
- `frontend/src/mock/mockData.js` - Reference for data structure
- `frontend/src/context/AuthContext.jsx` - See how fallback logic works
- `frontend/src/components/Assessment/` - Complex fallback examples
- `frontend/src/components/Community*` - API wrapper patterns

---

## Next Steps
1. Initialize Node/Express project
2. Setup Supabase project and connect via `supabase-js`
3. Implement authentication
4. Create assessment endpoints
5. Update frontend `.env` to point to backend
6. Test integration thoroughly
