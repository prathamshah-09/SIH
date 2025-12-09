# Announcements Integration - Quick Start Guide

## ✅ What Was Completed

### Backend (Complete)
1. **Database Schema** - `migrations/006_create_announcements_tables.sql`
   - `announcements` table with auto-expiry
   - `announcement_views` table for tracking seen status
   - Proper indexes and constraints

2. **Service Layer** - `src/services/announcement.service.js`
   - `calculateAnnouncementExpiry()` - Auto-calculate expiry from duration
   - `cleanupExpiredAnnouncements()` - Remove expired announcements
   - `getAnnouncementViewStats()` - Get view counts and seen status

3. **Controllers** - `src/controllers/announcement.controller.js` & `admin.controller.js`
   - Admin: Create, list (with seen counts), update, delete
   - Student/Counsellor: View announcements, mark as seen

4. **Routes**
   - `/api/admin/announcements` (POST, GET, PUT /:id, DELETE /:id)
   - `/api/student/announcements` (GET, POST /:id/seen)
   - `/api/counsellor/announcements` (GET, POST /:id/seen)

5. **Validators** - `src/utils/validators.js`
   - `createAnnouncement` schema (title, content, duration_days required)
   - `updateAnnouncement` schema (all fields optional)

### Frontend (Complete)
1. **API Service** - `src/services/announcementApi.js`
   - Functions for all CRUD operations
   - Data transformation helpers
   - Role-based endpoint routing

2. **Context** - `src/context/AnnouncementContext.jsx`
   - Fetches announcements on mount based on user role
   - Manages loading and error states
   - Provides CRUD operations with async/await
   - Optimistic UI updates

3. **Components**
   - `src/components/admin/AnnouncementManagement.jsx` - Admin dashboard (already existed, now integrated)
   - `src/components/shared/AnnouncementList.jsx` - Student/Counsellor view (new)

4. **Integration Points**
   - StudentDashboard already imports `useAnnouncements`
   - CounsellorDashboard already imports `useAnnouncements`
   - AdminDashboard already has AnnouncementManagement tab

## 🚀 How to Use

### For Admins
```jsx
import { useAnnouncements } from '@context/AnnouncementContext';

function AdminComponent() {
  const { 
    announcements,        // All announcements with seen_count
    loading,
    addAnnouncement,      // async (data) => Promise
    updateAnnouncement,   // async (id, updates) => Promise
    deleteAnnouncement    // async (id) => Promise
  } = useAnnouncements();

  // Create announcement
  const handleCreate = async () => {
    const result = await addAnnouncement({
      title: "Important Update",
      content: "This is a test announcement",
      durationDays: 7,
      type: "info",
      targetRole: "all"
    });
    
    if (result.success) {
      console.log("Created:", result.data);
    }
  };

  return (
    <div>
      {announcements.map(a => (
        <div key={a.id}>
          <h3>{a.title}</h3>
          <p>{a.seenCount} views</p>
          <button onClick={() => deleteAnnouncement(a.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### For Students/Counsellors
```jsx
import { useAnnouncements } from '@context/AnnouncementContext';
import AnnouncementList from '@components/shared/AnnouncementList';

function StudentComponent() {
  const { 
    announcements,      // Only visible announcements for their role
    loading,
    incrementViews      // Mark as seen
  } = useAnnouncements();

  return (
    <div>
      {/* Compact list for sidebar/dashboard */}
      <AnnouncementList compact limit={3} />

      {/* Full list for dedicated page */}
      <AnnouncementList />
    </div>
  );
}
```

### Using the AnnouncementList Component
```jsx
import AnnouncementList from '@components/shared/AnnouncementList';

// Compact mode (for sidebars/dashboards)
<AnnouncementList compact limit={3} />

// Full mode (for dedicated pages)
<AnnouncementList />

// Show all announcements
<AnnouncementList limit={null} />
```

## 📝 API Examples

### Admin Creates Announcement
```bash
POST http://localhost:5000/api/admin/announcements
Cookie: sb-access-token=...; sb-refresh-token=...
Content-Type: application/json

{
  "title": "Mental Health Week",
  "content": "Join us for workshops and support sessions",
  "duration_days": 7,
  "type": "event",
  "target_role": "all"
}
```

### Student Views Announcements
```bash
GET http://localhost:5000/api/student/announcements
Cookie: sb-access-token=...; sb-refresh-token=...
```

### Student Marks Announcement as Seen
```bash
POST http://localhost:5000/api/student/announcements/{announcement_id}/seen
Cookie: sb-access-token=...; sb-refresh-token=...
```

## 🧪 Testing Steps

1. **Apply Database Migration**
   ```bash
   # Apply migrations/006_create_announcements_tables.sql to your Supabase
   ```

2. **Start Backend**
   ```bash
   cd "SIH Backend/SIH-Backend"
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd "SIH Frontend/SIH-Frontend-main/frontend"
   npm run dev
   ```

4. **Test Admin Flow**
   - Login: admin@greenvalley.edu / Test@12345
   - Go to Admin Dashboard → Announcements tab
   - Create announcement
   - Verify it appears in list
   - Delete announcement

5. **Test Student Flow**
   - Login: john.student@greenvalley.edu / Test@12345
   - View announcements on dashboard
   - Click announcement (marks as seen)
   - Verify view count increments

## 🎨 Current Integration Status

### StudentDashboard
- ✅ Already imports `useAnnouncements`
- ✅ Already calls `getRecentAnnouncements(3)`
- ✅ Already has `incrementViews` handler
- 🔄 Just needs backend data (context will auto-fetch)

### CounsellorDashboard
- ✅ Already imports `useAnnouncements`
- ✅ Already calls `getRecentAnnouncements(10)`
- ✅ Already has `incrementViews` handler
- 🔄 Just needs backend data (context will auto-fetch)

### AdminDashboard
- ✅ Already has AnnouncementManagement component
- ✅ Now integrated with backend API
- ✅ Shows seen_count for each announcement
- ✅ CRUD operations work

## 🔧 Configuration

### Frontend (.env)
```bash
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (already configured)
- Cookie-based auth (automatic)
- Multi-tenant via JWT (automatic)
- No additional env vars needed

## 📊 Data Flow

```
1. Admin creates announcement
   ↓
2. Backend calculates expires_at (created_at + duration_days)
   ↓
3. Announcement saved to DB
   ↓
4. Student/Counsellor logs in
   ↓
5. AnnouncementContext fetches based on role
   ↓
6. Filters: is_active=true, expires_at > now, target_role matches
   ↓
7. Student clicks announcement
   ↓
8. incrementViews() → POST /announcements/:id/seen
   ↓
9. Backend creates record in announcement_views
   ↓
10. Returns updated seen_count
```

## ⚠️ Important Notes

1. **Auto-Expiry**: Expired announcements are deleted on every GET request
2. **Tenant Isolation**: Each college only sees their own announcements
3. **Unique Views**: Each user can only increment view count once
4. **Role Filtering**: Announcements can target specific roles (all/student/counsellor/admin)
5. **Active Status**: Announcements can be toggled active/inactive

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Verify backend is running on http://localhost:5000
- Check CORS is enabled with credentials
- Verify `withCredentials: true` in axios config

### "No announcements showing"
- Check if user is logged in (cookies present)
- Verify migration was applied
- Check browser console for API errors
- Test directly: `GET http://localhost:5000/api/student/announcements`

### "Failed to create announcement"
- Verify user role is admin
- Check all required fields: title, content, duration_days
- Verify duration_days is between 1-365
- Check backend logs for validation errors

## 📚 Additional Resources

- **Full Integration Guide**: `ANNOUNCEMENTS_INTEGRATION_GUIDE.md`
- **Backend API Docs**: `SIH Backend/SIH-Backend/docs/README.md`
- **Frontend Integration**: `SIH Backend/SIH-Backend/FRONTEND_INTEGRATION_GUIDE.md`

## ✨ What's Working Now

✅ Admin can create announcements with duration
✅ Admin can see all announcements with view counts
✅ Admin can delete announcements
✅ Admin can toggle visibility
✅ Students see only active, non-expired, role-targeted announcements
✅ Counsellors see only active, non-expired, role-targeted announcements
✅ View tracking increments on click
✅ Automatic expiry cleanup
✅ Multi-tenant isolation
✅ Cookie-based authentication
✅ Loading and error states
✅ Optimistic UI updates
