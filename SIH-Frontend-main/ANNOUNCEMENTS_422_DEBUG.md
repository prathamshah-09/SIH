# Debugging 422 Validation Error

## What Changed
Updated both frontend and backend to provide detailed debugging information for the 422 validation error.

### Frontend Changes
1. **AnnouncementContext.jsx** - Enhanced error logging
   - Logs full error object
   - Logs complete response data  
   - Logs validation errors in JSON format
   
2. **announcementApi.js** - Improved data transformation
   - Explicitly converts all values to correct types
   - `title` → String
   - `content` → String
   - `duration_days` → Number
   - `type` → String (default 'info')
   - `target_role` → String (default 'all')

### Backend Changes
1. **validators.js** - Added console logging
   - Logs the exact request body being validated
   - Logs all validation errors with details

## How to Debug

### Step 1: Open Browser DevTools
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Keep it open while testing

### Step 2: Try Creating an Announcement
1. Fill in title, content, duration
2. Click "Publish"
3. Look at the console - you should see logs like:

```
Sending to backend: {
  title: "Test Announcement",
  content: "This is test content here with enough characters",
  duration_days: 7,
  type: "info",
  target_role: "all"
}
```

### Step 3: Check the Error Response
After clicking publish, if there's an error, check the console for:

```
Full error object: {status: 422, ...}
Error response: {data: {error: {message: "Validation failed", details: [...]
Validation errors: [
  {field: "title", message: "...", value: ...},
  ...
]
Details: [
  {
    "field": "...",
    "message": "...",
    "value": ...
  }
]
```

### Step 4: Check Backend Logs
In the terminal where your backend is running (`npm run dev`), look for:

```
Validating property: body
Request body: {
  title: "...",
  content: "...",
  duration_days: 7,
  type: "info",
  target_role: "all"
}
Validation errors: [...]
```

## Expected Values

### Correct Payload Example
```json
{
  "title": "Mental Health Awareness Week",
  "content": "Join us for a series of workshops and discussions about mental health. This announcement will be visible for 7 days.",
  "duration_days": 7,
  "type": "info",
  "target_role": "all"
}
```

### Validation Rules
| Field | Type | Min | Max | Required | Values |
|-------|------|-----|-----|----------|--------|
| title | string | 3 | 200 | ✅ | any |
| content | string | 10 | 5000 | ✅ | any |
| duration_days | number | 1 | 365 | ✅ | integer |
| type | string | - | - | ❌ | info, warning, urgent, event, maintenance |
| target_role | string | - | - | ❌ | all, student, counsellor, admin |

## Common Issues & Fixes

### Issue: Missing required field
**Error**: `"field": "duration_days", "message": "'duration_days' is required"`
**Fix**: Ensure the number input has a value, never empty

### Issue: Field value too short
**Error**: `"field": "title", "message": "length must be at least 3 characters long"`
**Fix**: Title must be 3+ characters, content must be 10+ characters

### Issue: Duration out of range
**Error**: `"field": "duration_days", "message": "must be less than or equal to 365"`
**Fix**: Duration must be between 1-365 days

### Issue: Invalid field type
**Error**: `"field": "duration_days", "message": "must be a number"`
**Fix**: Ensure duration is being sent as a number, not a string

### Issue: Unknown/extra fields
**Error**: `"field": "<fieldname>", "message": "is not allowed"`
**Fix**: Only send required + optional fields from the schema, no extra fields

## Next Steps

1. **Screenshot the Console Output**
   - Copy the "Validation errors" or "Details" from browser console
   - Share with debugging info

2. **Check Backend Terminal Output**
   - Look for "Request body:" in backend logs
   - Check if it matches expected format

3. **Verify Backend is Running**
   - Make sure backend started with `npm run dev`
   - Check if it's listening on port 5000

## Testing Checklist

- [ ] Title is 3+ characters
- [ ] Content is 10+ characters
- [ ] Duration is a number between 1-365
- [ ] Form validation passes (no red error messages on form)
- [ ] No extra fields being sent
- [ ] Backend is running on port 5000
- [ ] Frontend points to correct backend URL (check api.js VITE_BACKEND_URL)
- [ ] JWT token is present in cookies (check browser DevTools > Application > Cookies)
- [ ] User is logged in as admin

## If Still Failing

Please provide:
1. Browser console output (screenshot or copy-paste)
2. Backend terminal output (screenshot or copy-paste)
3. What values you tried to enter
4. Whether the form validation passed before clicking Publish
