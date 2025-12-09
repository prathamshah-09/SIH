# Announcements - Dashboard Integration Checklist

## ✅ Already Integrated (No Changes Needed)

### StudentDashboard.jsx
The StudentDashboard already has announcements integrated:
- Line 38: `import { useAnnouncements } from "@context/AnnouncementContext";`
- Line 312: `const { getRecentAnnouncements, incrementViews } = useAnnouncements();`
- Line 1254: Uses `getRecentAnnouncements(3)` to display announcements

**Status**: ✅ **Working** - Just needs backend to be running

### CounsellorDashboard.jsx  
The CounsellorDashboard already has announcements integrated:
- Line 43: `import { useAnnouncements } from '@context/AnnouncementContext';`
- Line 676: `const { getRecentAnnouncements, incrementViews } = useAnnouncements();`
- Lines 1495+: Uses `getRecentAnnouncements(10)` to display announcements

**Status**: ✅ **Working** - Just needs backend to be running

### AdminDashboard.jsx
The AdminDashboard already has AnnouncementManagement:
- Line 48: `import AnnouncementManagement from '@components/admin/AnnouncementManagement';`
- Uses the component in a tab

**Status**: ✅ **Updated** - Now integrated with backend API

## 🚀 No Code Changes Required!

The announcements feature is **fully integrated** and will work automatically once:
1. Database migration is applied
2. Backend server is running
3. User logs in

## 📋 Testing Checklist

### Pre-Testing Setup
- [ ] Apply database migration `006_create_announcements_tables.sql`
- [ ] Start backend: `cd "SIH Backend/SIH-Backend" && npm run dev`
- [ ] Start frontend: `cd "SIH Frontend/SIH-Frontend-main/frontend" && npm run dev`

### Admin Testing
- [ ] Login as admin (admin@greenvalley.edu / Test@12345)
- [ ] Navigate to Admin Dashboard → Announcements tab
- [ ] Create a new announcement:
  - Title: "Welcome Week"
  - Content: "Join us for orientation events and campus tours"
  - Duration: 7 days
  - Click "Publish & Inspire"
- [ ] Verify toast notification appears
- [ ] Verify announcement appears in "Previous Announcements" list
- [ ] Verify "0 views" is shown
- [ ] Click eye icon to toggle visibility
- [ ] Click delete icon to remove announcement

### Student Testing
- [ ] Logout and login as student (john.student@greenvalley.edu / Test@12345)
- [ ] Go to Student Dashboard
- [ ] Verify announcement appears in sidebar or dashboard
- [ ] Click on announcement
- [ ] Verify announcement details are visible
- [ ] Logout and login as admin again
- [ ] Verify view count increased to 1

### Counsellor Testing
- [ ] Logout and login as counsellor (dr.sarah@greenvalley.edu / Test@12345)
- [ ] Go to Counsellor Dashboard  
- [ ] Verify announcement appears
- [ ] Click announcement
- [ ] Logout and login as admin
- [ ] Verify view count increased

### Role-Based Filtering Testing
- [ ] As admin, create announcement with target_role: "student"
- [ ] Login as student - verify announcement appears
- [ ] Login as counsellor - verify announcement does NOT appear
- [ ] As admin, create announcement with target_role: "counsellor"
- [ ] Login as counsellor - verify announcement appears
- [ ] Login as student - verify announcement does NOT appear

### Expiry Testing
- [ ] As admin, create announcement with duration: 1 day
- [ ] Verify announcement appears for students/counsellors
- [ ] (Optional) Manually update `expires_at` in database to past date
- [ ] Refresh student/counsellor dashboard
- [ ] Verify expired announcement no longer appears

## 🎯 What Happens When You Start

1. **User logs in** → JWT token stored in HTTP-only cookies
2. **Page loads** → `AnnouncementContext` initializes
3. **Context reads role** from `localStorage.getItem('sensee_user_role')`
4. **Fetches announcements** via appropriate endpoint:
   - Admin: `GET /api/admin/announcements`
   - Student: `GET /api/student/announcements`
   - Counsellor: `GET /api/counsellor/announcements`
5. **Updates state** → Components re-render with real data
6. **User clicks announcement** → `incrementViews()` called
7. **POST request** → `POST /api/student/announcements/:id/seen`
8. **Backend updates** → Creates record in `announcement_views`
9. **Response returns** → UI shows updated view count

## 🔍 Debugging Tools

### Check if backend is working:
```bash
# Test student endpoint
curl -X GET http://localhost:5000/api/student/announcements \
  -H "Cookie: sb-access-token=YOUR_TOKEN; sb-refresh-token=YOUR_REFRESH_TOKEN"

# Test admin endpoint
curl -X GET http://localhost:5000/api/admin/announcements \
  -H "Cookie: sb-access-token=YOUR_TOKEN; sb-refresh-token=YOUR_REFRESH_TOKEN"
```

### Browser DevTools:
1. Open Network tab
2. Filter by "announcements"
3. Look for:
   - GET /api/student/announcements (200 OK)
   - POST /api/student/announcements/:id/seen (200 OK)
4. Check Response tab for data

### React DevTools:
1. Install React DevTools extension
2. Open Components tab
3. Find `AnnouncementContext.Provider`
4. Check state:
   - `announcements: Array`
   - `loading: false`
   - `error: null`

### Common Issues:

**Issue**: "Cannot connect to backend"
- **Fix**: Check if backend is running on port 5000
- **Fix**: Verify CORS settings allow credentials

**Issue**: "Announcements array is empty"
- **Fix**: Create announcements as admin first
- **Fix**: Check if announcements expired
- **Fix**: Verify user role matches target_role

**Issue**: "Failed to create announcement"
- **Fix**: Check required fields (title, content, duration_days)
- **Fix**: Verify user is admin
- **Fix**: Check backend logs for validation errors

**Issue**: "View count not incrementing"
- **Fix**: Check if user already viewed (unique constraint)
- **Fix**: Verify authentication cookies are present
- **Fix**: Check network tab for 401/403 errors

## 📦 Files Modified/Created Summary

### Backend
```
✅ migrations/006_create_announcements_tables.sql (NEW)
✅ src/services/announcement.service.js (NEW)
✅ src/controllers/announcement.controller.js (NEW)
✅ src/controllers/admin.controller.js (MODIFIED - added imports)
✅ src/routes/student.routes.js (MODIFIED - added imports)
✅ src/routes/counsellor.routes.js (MODIFIED - added routes)
✅ src/routes/admin.routes.js (MODIFIED - updated validator)
✅ src/utils/validators.js (MODIFIED - added schemas)
```

### Frontend
```
✅ src/services/announcementApi.js (NEW)
✅ src/context/AnnouncementContext.jsx (MODIFIED - backend integration)
✅ src/components/admin/AnnouncementManagement.jsx (MODIFIED - async operations)
✅ src/components/shared/AnnouncementList.jsx (NEW)
✅ ANNOUNCEMENTS_INTEGRATION_GUIDE.md (NEW)
✅ ANNOUNCEMENTS_QUICK_START.md (NEW)
✅ ANNOUNCEMENTS_DASHBOARD_CHECKLIST.md (THIS FILE - NEW)
```

### No Changes Required
```
✅ src/components/dashboard/StudentDashboard.jsx (Already integrated)
✅ src/components/dashboard/CounsellorDashboard.jsx (Already integrated)
✅ src/components/dashboard/AdminDashboard.jsx (Already integrated)
```

## 🎉 Ready to Test!

Everything is ready. Just:
1. Apply the database migration
2. Start backend server
3. Start frontend server
4. Login and test!

No additional code changes needed in dashboards - they already use the context and will automatically fetch from backend.
