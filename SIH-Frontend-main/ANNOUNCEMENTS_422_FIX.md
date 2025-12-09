# 422 Validation Error Fix - Announcements

## Problem
When creating announcements, the frontend received a **422 Unprocessable Entity** error from the backend.

## Root Cause
The frontend was sending extra fields that the backend validation schema doesn't accept:

```javascript
// ❌ BEFORE (sent extra 'visible' field)
addAnnouncement({
  title: "Test",
  content: "Content",
  visible: true,        // ← Not in backend schema
  durationDays: 7
})
```

Backend validation middleware uses `allowUnknown: false`, which **rejects any fields not defined in the schema**:

```javascript
// Backend validator.js
createAnnouncement: Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(10).max(5000).required(),
  type: Joi.string().valid('info', 'warning', 'urgent', 'event', 'maintenance').default('info'),
  target_role: Joi.string().valid('all', 'student', 'counsellor', 'admin').default('all'),
  duration_days: Joi.number().integer().min(1).max(365).required()
  // ❌ No 'is_active', 'visible', 'is_pinned' fields
})
```

## Solution
Removed the `visible: true` field from the frontend call:

```javascript
// ✅ AFTER (only send required fields)
addAnnouncement({
  title: "Test",
  content: "Content",
  durationDays: 7        // Transformed to duration_days by transform function
})
```

### Files Modified
1. **AnnouncementManagement.jsx** - Removed `visible: true` from addAnnouncement call
2. **announcementApi.js** - Ensured `transformAnnouncementForBackend` only returns schema-compliant fields

## Why This Works
- New announcements are **automatically set to `is_active: true`** in the backend controller
- No need to send `visible` from frontend
- The `transformAnnouncementForBackend` function now ensures **only schema-compliant fields** are sent

## Complete Flow
```
Frontend: { title, content, durationDays }
    ↓
Transform: { title, content, duration_days, type, target_role }
    ↓
Backend Validator: ✅ All fields match schema
    ↓
Controller: Saves with is_active: true by default
```

## Testing
After this fix:
1. ✅ Admin can create announcements without 422 errors
2. ✅ Backend validation passes
3. ✅ New announcements are active by default
4. ✅ All required fields are properly transformed (camelCase → snake_case)

## Key Takeaway
**Always ensure frontend data matches backend validation schemas exactly.** Extra fields will be rejected when `allowUnknown: false`.
