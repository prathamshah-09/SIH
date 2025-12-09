# Announcements Feature - Visual Flow Diagram

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                         ANNOUNCEMENTS SYSTEM FLOW                              │
└───────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: ADMIN CREATES ANNOUNCEMENT                                          │
└─────────────────────────────────────────────────────────────────────────────┘

    Admin Dashboard
         │
         │ Opens Announcements tab
         ▼
    ┌─────────────────────────┐
    │ AnnouncementManagement  │
    │  - Title input          │
    │  - Content textarea     │
    │  - Duration picker      │
    │  - Type selector        │
    │  - Target role selector │
    └─────────────────────────┘
         │
         │ Fills form & clicks "Publish"
         ▼
    useAnnouncements().addAnnouncement({
      title: "Mental Health Week",
      content: "Join us...",
      durationDays: 7,
      type: "event",
      targetRole: "all"
    })
         │
         │ POST /api/admin/announcements
         ▼
    ┌─────────────────────────────────┐
    │ Backend: admin.controller.js    │
    │ 1. Validates input (Joi)        │
    │ 2. Calculates expires_at        │
    │    = now + 7 days               │
    │ 3. Saves to DB                  │
    └─────────────────────────────────┘
         │
         │ Returns created announcement
         ▼
    ┌─────────────────────────────────┐
    │ Database: announcements         │
    │ {                               │
    │   id: uuid                      │
    │   title: "Mental Health Week"   │
    │   content: "Join us..."         │
    │   duration_days: 7              │
    │   expires_at: 2025-12-16        │
    │   is_active: true               │
    │   created_by: admin-uuid        │
    │   college_id: college-uuid      │
    │ }                               │
    └─────────────────────────────────┘
         │
         │ Context updates state
         ▼
    Admin sees announcement in list
    with "0 views"


┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: STUDENT VIEWS ANNOUNCEMENT                                         │
└─────────────────────────────────────────────────────────────────────────────┘

    Student logs in
         │
         │ JWT token stored in HTTP-only cookies
         ▼
    StudentDashboard loads
         │
         │ useAnnouncements() initializes
         ▼
    AnnouncementContext.jsx
         │
         │ Detects role from localStorage
         │ role = "student"
         ▼
    GET /api/student/announcements
         │
         │ Backend filters:
         │ - college_id from JWT
         │ - is_active = true
         │ - expires_at > now
         │ - target_role IN ('all', 'student')
         ▼
    ┌─────────────────────────────────────────┐
    │ Backend: announcement.controller.js     │
    │ 1. Cleanup expired announcements        │
    │ 2. Fetch matching announcements         │
    │ 3. Get view stats for each              │
    │ 4. Add seen_count and has_seen flags    │
    └─────────────────────────────────────────┘
         │
         │ Returns array of announcements
         ▼
    [
      {
        id: "uuid",
        title: "Mental Health Week",
        content: "Join us...",
        type: "event",
        seen_count: 0,
        has_seen: false,
        expires_at: "2025-12-16",
        ...
      }
    ]
         │
         │ Context updates state
         ▼
    ┌─────────────────────────────────┐
    │ StudentDashboard displays:      │
    │                                 │
    │ 📢 Mental Health Week [NEW]     │
    │    Join us for workshops...     │
    │    📅 12/9/2025  👁 0 views     │
    │    [blue dot] = unread          │
    └─────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: STUDENT MARKS AS SEEN                                              │
└─────────────────────────────────────────────────────────────────────────────┘

    Student clicks announcement
         │
         ▼
    incrementViews(announcement.id)
         │
         │ Optimistic UI update (instant feedback)
         ▼
    UI shows: views = 1, has_seen = true
         │
         │ POST /api/student/announcements/:id/seen
         ▼
    ┌─────────────────────────────────────────┐
    │ Backend: announcement.controller.js     │
    │ 1. Verify announcement exists           │
    │ 2. Check not expired                    │
    │ 3. Insert into announcement_views       │
    │    (UNIQUE constraint prevents dups)    │
    │ 4. Count total views                    │
    └─────────────────────────────────────────┘
         │
         │ Returns updated count
         ▼
    ┌─────────────────────────────────┐
    │ Database: announcement_views    │
    │ {                               │
    │   id: uuid                      │
    │   announcement_id: uuid         │
    │   user_id: student-uuid         │
    │   college_id: college-uuid      │
    │   viewed_at: 2025-12-09         │
    │ }                               │
    └─────────────────────────────────┘
         │
         │ Response: { seen_count: 1 }
         ▼
    Context updates announcement:
    - seen_count = 1
    - has_seen = true
         │
         ▼
    ┌─────────────────────────────────┐
    │ StudentDashboard updates:       │
    │                                 │
    │ 📢 Mental Health Week           │
    │    Join us for workshops...     │
    │    📅 12/9/2025  👁 1 view      │
    │    [no blue dot] = read         │
    └─────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: ADMIN SEES UPDATED COUNT                                           │
└─────────────────────────────────────────────────────────────────────────────┘

    Admin refreshes dashboard
         │
         │ GET /api/admin/announcements
         ▼
    Backend counts views:
    SELECT COUNT(*) 
    FROM announcement_views 
    WHERE announcement_id = ...
         │
         │ Returns announcements with seen_count
         ▼
    ┌─────────────────────────────────┐
    │ AdminDashboard shows:           │
    │                                 │
    │ Mental Health Week              │
    │ 📅 12/9/2025  👁 1 view         │
    │ [Eye] [Trash]                   │
    └─────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: AUTO-EXPIRY (After 7 Days)                                        │
└─────────────────────────────────────────────────────────────────────────────┘

    Student opens dashboard
         │
         │ GET /api/student/announcements
         ▼
    Backend: cleanupExpiredAnnouncements()
         │
         │ DELETE FROM announcements
         │ WHERE college_id = ...
         │   AND expires_at <= now()
         ▼
    Announcement deleted from DB
         │
         │ Returns remaining announcements
         ▼
    Student no longer sees expired announcement


┌───────────────────────────────────────────────────────────────────────────────┐
│                              DATA STRUCTURES                                  │
└───────────────────────────────────────────────────────────────────────────────┘

Frontend Format (after transformation):
──────────────────────────────────────────
{
  id: "uuid",
  title: "Mental Health Week",
  content: "Join us for workshops and support sessions",
  type: "event",                    // info|warning|urgent|event|maintenance
  targetRole: "all",                // all|student|counsellor|admin
  durationDays: 7,
  expiresAt: "2025-12-16T10:00:00Z",
  isActive: true,
  seenCount: 1,                     // Total views
  hasSeen: false,                   // Current user seen?
  date: "12/9/2025",               // Formatted for display
  visible: true,                    // Alias for isActive
  views: 1                          // Alias for seenCount
}

Backend Format (raw from DB):
──────────────────────────────────
{
  id: "uuid",
  title: "Mental Health Week",
  content: "Join us for workshops and support sessions",
  duration_days: 7,
  type: "event",
  target_role: "all",
  expires_at: "2025-12-16T10:00:00Z",
  is_active: true,
  seen_count: 1,                    // Calculated via JOIN
  has_seen: false,                  // Calculated via JOIN
  created_at: "2025-12-09T10:00:00Z",
  created_by: {
    name: "Admin User"
  }
}


┌───────────────────────────────────────────────────────────────────────────────┐
│                              MULTI-TENANT FLOW                                │
└───────────────────────────────────────────────────────────────────────────────┘

College A (Green Valley)          College B (Blue Mountain)
────────────────────              ─────────────────────────

Admin creates announcement        Admin creates announcement
  college_id: A                     college_id: B
  ↓                                 ↓
Stored in announcements table     Stored in announcements table
  ↓                                 ↓
Student A logs in                 Student B logs in
  college_id: A (from JWT)          college_id: B (from JWT)
  ↓                                 ↓
Backend filters:                  Backend filters:
  WHERE college_id = A              WHERE college_id = B
  ↓                                 ↓
Returns only College A            Returns only College B
announcements                     announcements

✅ ISOLATION: Students never see other colleges' announcements


┌───────────────────────────────────────────────────────────────────────────────┐
│                           ROLE-BASED FILTERING                                │
└───────────────────────────────────────────────────────────────────────────────┘

Admin creates:
  target_role: "student"
  ↓
Database stores announcement
  ↓
  ├─ Student logs in
  │    Backend filters: target_role IN ('all', 'student')
  │    ✅ SEES announcement
  │
  └─ Counsellor logs in
       Backend filters: target_role IN ('all', 'counsellor')
       ❌ DOES NOT SEE announcement


┌───────────────────────────────────────────────────────────────────────────────┐
│                              KEY TECHNOLOGIES                                 │
└───────────────────────────────────────────────────────────────────────────────┘

Frontend:
  • React 18 with Hooks
  • Context API (state management)
  • Axios (HTTP client)
  • Cookie-based authentication

Backend:
  • Node.js + Express
  • Supabase (PostgreSQL)
  • JWT authentication
  • Joi validation

Database:
  • PostgreSQL (via Supabase)
  • UUID primary keys
  • Foreign key constraints
  • Indexes for performance

Security:
  • HTTP-only cookies
  • CSRF protection
  • Multi-tenant isolation
  • Role-based access control
```

## Quick Reference

### API Endpoints
```
Admin:
  POST   /api/admin/announcements           Create
  GET    /api/admin/announcements           List all (with seen_count)
  PUT    /api/admin/announcements/:id       Update
  DELETE /api/admin/announcements/:id       Delete

Student/Counsellor:
  GET    /api/{role}/announcements           Get visible
  POST   /api/{role}/announcements/:id/seen  Mark as seen
```

### React Hook Usage
```javascript
const {
  announcements,        // Array of announcements
  loading,              // Boolean
  error,                // String | null
  addAnnouncement,      // async (data) => result
  updateAnnouncement,   // async (id, updates) => result
  deleteAnnouncement,   // async (id) => result
  incrementViews,       // async (id) => void
  refreshAnnouncements  // async () => void
} = useAnnouncements();
```

### Database Tables
```
announcements
  - id, title, content, duration_days
  - college_id, created_by
  - type, target_role, is_active
  - expires_at, created_at

announcement_views
  - id, announcement_id, user_id
  - college_id, viewed_at
  - UNIQUE (announcement_id, user_id)
```
