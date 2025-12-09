# Announcements Feature - Complete Integration Guide

## Overview
The announcements feature allows admins to create time-limited announcements that are automatically deleted after their duration expires. Students and counsellors can view these announcements, and the system tracks who has seen each announcement.

## Backend Architecture

### Database Schema
Located in: `migrations/006_create_announcements_tables.sql`

**Tables:**
1. **announcements** - Stores announcement data
   - `id` (UUID, PK)
   - `title` (varchar 255, required)
   - `content` (text, required)
   - `duration_days` (integer, required, 1-365)
   - `college_id` (UUID, FK to colleges)
   - `created_by` (UUID, FK to profiles)
   - `type` (enum: info, warning, urgent, event, maintenance)
   - `target_role` (enum: all, student, counsellor, admin)
   - `is_active` (boolean)
   - `expires_at` (timestamptz, auto-calculated)
   - `created_at`, `updated_at`

2. **announcement_views** - Tracks who has seen each announcement
   - `id` (UUID, PK)
   - `announcement_id` (UUID, FK)
   - `user_id` (UUID, FK)
   - `college_id` (UUID, FK)
   - `viewed_at` (timestamptz)
   - UNIQUE constraint on (announcement_id, user_id)

### Backend Endpoints

#### Admin Endpoints (`/api/admin`)
- **POST /announcements** - Create announcement
  ```json
  {
    "title": "string (3-200 chars)",
    "content": "string (10-5000 chars)",
    "duration_days": "number (1-365)",
    "type": "info|warning|urgent|event|maintenance",
    "target_role": "all|student|counsellor|admin"
  }
  ```

- **GET /announcements** - List all announcements (paginated)
  - Query params: `page`, `limit`, `type`, `is_active`
  - Returns: Paginated list with `seen_count` for each

- **PUT /announcements/:announcement_id** - Update announcement
  - Any of: `title`, `content`, `duration_days`, `type`, `target_role`, `is_active`

- **DELETE /announcements/:announcement_id** - Delete announcement

#### Student Endpoints (`/api/student`)
- **GET /announcements** - Get visible announcements
  - Filters by role and active/non-expired
  - Returns: List with `seen_count` and `has_seen` flags

- **POST /announcements/:announcement_id/seen** - Mark as seen
  - Increments view count

#### Counsellor Endpoints (`/api/counsellor`)
- Same as student endpoints

### Key Features
1. **Auto-Expiry**: Announcements are automatically deleted when `expires_at` passes
2. **Tenant Isolation**: Each college only sees their own announcements
3. **Role-Based Filtering**: Announcements can target specific roles
4. **View Tracking**: Unique views per user are tracked
5. **Cleanup on Read**: Expired announcements are removed before queries

## Frontend Architecture

### Files Created/Modified

1. **`src/services/announcementApi.js`** - API service layer
   - Handles all HTTP requests
   - Transforms data between frontend and backend formats
   - Provides reusable functions for all roles

2. **`src/context/AnnouncementContext.jsx`** - State management
   - Fetches announcements on mount based on user role
   - Provides CRUD operations
   - Handles loading and error states
   - Integrates with backend API

3. **`src/components/admin/AnnouncementManagement.jsx`** - Admin UI
   - Create new announcements
   - List all announcements
   - Delete announcements
   - Toggle visibility
   - Shows view counts

4. **`src/components/shared/AnnouncementList.jsx`** - Student/Counsellor UI
   - Display announcements in compact or full mode
   - Mark announcements as seen on click
   - Shows unread indicators
   - Filters by type with badges

### Context API Usage

```javascript
import { useAnnouncements } from '@context/AnnouncementContext';

function MyComponent() {
  const {
    announcements,        // Array of announcements
    loading,              // Loading state
    error,                // Error message
    addAnnouncement,      // async (data) => result
    updateAnnouncement,   // async (id, updates) => result
    deleteAnnouncement,   // async (id) => result
    incrementViews,       // async (id) => void
    refreshAnnouncements  // async () => void
  } = useAnnouncements();
}
```

### Data Transformation

**Frontend Format:**
```javascript
{
  id: 'uuid',
  title: 'string',
  content: 'string',
  type: 'info|warning|urgent|event',
  targetRole: 'all|student|counsellor',
  durationDays: 7,
  expiresAt: '2025-12-16T...',
  isActive: true,
  seenCount: 234,
  hasSeen: false,
  date: '12/9/2025',
  visible: true,
  views: 234
}
```

**Backend Format:**
```javascript
{
  id: 'uuid',
  title: 'string',
  content: 'string',
  duration_days: 7,
  type: 'info',
  target_role: 'all',
  expires_at: '2025-12-16T...',
  is_active: true,
  seen_count: 234,
  has_seen: false,
  created_at: '2025-12-09T...',
  created_by: { name: 'Admin' }
}
```

## Integration Steps Completed

### 1. Backend Setup ✅
- Created migration for tables
- Implemented service layer with expiry calculation and cleanup
- Created controllers for admin/student/counsellor
- Added validators for input validation
- Updated routes with announcement endpoints

### 2. Frontend Setup ✅
- Created API service layer
- Updated AnnouncementContext with backend integration
- Modified AnnouncementManagement for async operations
- Created AnnouncementList component for students/counsellors
- Added error handling and loading states

### 3. Authentication ✅
- Uses existing cookie-based auth
- Role detection from localStorage
- Automatic tenant isolation via JWT

## Testing Guide

### 1. Run Database Migration
```bash
cd "SIH Backend/SIH-Backend"
# Apply migration to Supabase
```

### 2. Test Admin Flow
1. Login as admin: `admin@greenvalley.edu` / `Test@12345`
2. Navigate to Admin Dashboard → Announcements tab
3. Create announcement:
   - Title: "Welcome Week"
   - Content: "Join us for orientation events..."
   - Duration: 7 days
4. Verify announcement appears in list with 0 views
5. Test delete functionality

### 3. Test Student Flow
1. Login as student: `john.student@greenvalley.edu` / `Test@12345`
2. Navigate to dashboard
3. Verify announcement appears (with "New" badge if unseen)
4. Click announcement
5. Verify view count increments

### 4. Test Counsellor Flow
1. Login as counsellor: `dr.sarah@greenvalley.edu` / `Test@12345`
2. Same as student flow

### 5. Test Edge Cases
- Create announcement with 1 day duration, verify it appears
- Update announcement duration
- Toggle visibility
- Test role-based filtering (target_role)
- Verify tenant isolation (different colleges can't see each other's announcements)

## API Response Examples

### Create Announcement (Admin)
```json
POST /api/admin/announcements
{
  "title": "Mental Health Week",
  "content": "Join us for workshops and support sessions",
  "duration_days": 7,
  "type": "event",
  "target_role": "all"
}

Response:
{
  "success": true,
  "message": "Announcement created successfully",
  "data": {
    "id": "uuid",
    "title": "Mental Health Week",
    "content": "Join us for workshops and support sessions",
    "type": "event",
    "target_role": "all",
    "duration_days": 7,
    "expires_at": "2025-12-16T...",
    "is_active": true,
    "seen_count": 0,
    "created_at": "2025-12-09T...",
    "created_by": { "name": "Admin User" }
  }
}
```

### Get Announcements (Student)
```json
GET /api/student/announcements

Response:
{
  "success": true,
  "message": "Announcements fetched successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Mental Health Week",
      "content": "Join us for workshops...",
      "type": "event",
      "target_role": "all",
      "duration_days": 7,
      "expires_at": "2025-12-16T...",
      "is_active": true,
      "seen_count": 15,
      "has_seen": false,
      "created_at": "2025-12-09T...",
      "created_by": { "name": "Admin User" }
    }
  ]
}
```

### Mark as Seen (Student)
```json
POST /api/student/announcements/:announcement_id/seen

Response:
{
  "success": true,
  "message": "Announcement marked as seen",
  "data": {
    "announcement_id": "uuid",
    "seen_count": 16,
    "has_seen": true
  }
}
```

## Environment Variables
No additional environment variables needed. Uses existing:
- `VITE_BACKEND_URL` - Backend base URL (default: http://localhost:5000)
- Cookie-based authentication (automatic)

## Troubleshooting

### Announcements not appearing
- Check if backend is running
- Verify migration was applied
- Check browser console for API errors
- Verify user is logged in (check cookies)

### View count not incrementing
- Ensure user is authenticated
- Check network tab for 401/403 errors
- Verify college_id is set in JWT

### "Failed to fetch announcements" error
- Check CORS configuration in backend
- Verify `withCredentials: true` in axios
- Check backend logs for errors

## Future Enhancements
1. Push notifications for new announcements
2. Rich text editor for content
3. Image/file attachments
4. Scheduled announcements
5. Analytics dashboard
6. Email notifications
7. Announcement templates
8. Bulk actions

## Notes
- Announcements are soft-deleted (not actually purged from DB until expiry cleanup runs)
- View tracking is per-user, not per-session
- Expired announcements are cleaned up on every GET request (lazy deletion)
- Consider adding a cron job for active cleanup in production
