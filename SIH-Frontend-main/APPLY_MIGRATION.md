# Apply Announcements Database Migration

## Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

## Step 2: Copy and Run the Migration

Copy the entire contents of this file and paste into the SQL Editor:

```sql
-- Migration: Create announcements and announcement_views tables
-- Purpose: Enable admin announcements with duration-based expiry and view tracking
-- Date: December 9, 2025

-- Announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  content text NOT NULL,
  duration_days integer NOT NULL CHECK (duration_days > 0),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type varchar(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'urgent', 'event', 'maintenance')),
  target_role varchar(20) DEFAULT 'all' CHECK (target_role IN ('all', 'student', 'counsellor', 'admin')),
  is_active boolean DEFAULT true,
  is_pinned boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  attachment_url varchar(500),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for announcements
CREATE INDEX IF NOT EXISTS idx_announcements_college ON public.announcements(college_id);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON public.announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON public.announcements(target_role);
CREATE INDEX IF NOT EXISTS idx_announcements_expires_at ON public.announcements(expires_at);
CREATE INDEX IF NOT EXISTS idx_announcements_college_role ON public.announcements(college_id, target_role, is_active);

-- Track which users have seen an announcement
CREATE TABLE IF NOT EXISTS public.announcement_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE (announcement_id, user_id)
);

-- Indexes for views
CREATE INDEX IF NOT EXISTS idx_announcement_views_announcement ON public.announcement_views(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_views_user ON public.announcement_views(user_id);
CREATE INDEX IF NOT EXISTS idx_announcement_views_college ON public.announcement_views(college_id);
CREATE INDEX IF NOT EXISTS idx_announcement_views_announcement_college ON public.announcement_views(announcement_id, college_id);
```

## Step 3: Run the Query

1. Click the **Run** button (or press Ctrl+Enter / Cmd+Enter)
2. Wait for the success message
3. Verify tables were created:
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_name IN ('announcements', 'announcement_views');
   ```

## Step 4: Verify Installation

Run this query to confirm everything is set up correctly:

```sql
-- Check tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_name IN ('announcements', 'announcement_views')
  AND table_schema = 'public';

-- Check indexes
SELECT 
  indexname,
  tablename
FROM pg_indexes
WHERE tablename IN ('announcements', 'announcement_views')
  AND schemaname = 'public'
ORDER BY tablename, indexname;
```

Expected output:
- 2 tables created
- `announcements` table with 13 columns
- `announcement_views` table with 5 columns
- Multiple indexes on both tables

## Step 5: Test with Sample Data (Optional)

You can insert a test announcement to verify everything works:

```sql
-- Insert test announcement (replace UUIDs with actual values from your database)
INSERT INTO public.announcements (
  title,
  content,
  duration_days,
  college_id,
  created_by,
  expires_at,
  type,
  target_role
) VALUES (
  'Test Announcement',
  'This is a test announcement to verify the system works',
  7,
  (SELECT id FROM public.colleges LIMIT 1),  -- First college
  (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1),  -- First admin
  now() + interval '7 days',
  'info',
  'all'
);

-- Verify it was created
SELECT 
  id,
  title,
  content,
  duration_days,
  type,
  target_role,
  is_active,
  expires_at,
  created_at
FROM public.announcements
ORDER BY created_at DESC
LIMIT 1;
```

## Troubleshooting

### Error: "relation already exists"
This means the tables were already created. You can either:
- Skip this migration (it's already done)
- Or drop the tables and recreate:
  ```sql
  DROP TABLE IF EXISTS public.announcement_views CASCADE;
  DROP TABLE IF EXISTS public.announcements CASCADE;
  -- Then run the migration again
  ```

### Error: "foreign key constraint violation"
Make sure the `colleges` and `profiles` tables exist first:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('colleges', 'profiles') 
  AND table_schema = 'public';
```

### Error: "permission denied"
You need to have proper permissions in Supabase. Make sure you're logged in as the project owner or have admin privileges.

## Next Steps

After successfully applying the migration:
1. Start the backend server: `cd "SIH Backend/SIH-Backend" && npm run dev`
2. Start the frontend: `cd "SIH Frontend/SIH-Frontend-main/frontend" && npm run dev`
3. Login as admin and test creating announcements
4. Login as student and verify announcements appear

## Files Reference

- Migration SQL: `SIH Backend/SIH-Backend/migrations/006_create_announcements_tables.sql`
- Backend Service: `SIH Backend/SIH-Backend/src/services/announcement.service.js`
- Backend Controller: `SIH Backend/SIH-Backend/src/controllers/announcement.controller.js`
- Frontend API: `SIH Frontend/SIH-Frontend-main/frontend/src/services/announcementApi.js`
- Frontend Context: `SIH Frontend/SIH-Frontend-main/frontend/src/context/AnnouncementContext.jsx`

Done! Your announcements feature is now ready to use. 🎉
