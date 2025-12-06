# 🚀 Quick Test Guide - Resource Management

## Prerequisites
- ✅ Backend running on `http://localhost:5000`
- ✅ Frontend running on Vite dev server
- ✅ Logged in as counsellor

## Test Credentials
```
Email: dr.sarah@greenvalley.edu
Password: Test@12345
```

## Quick Test Checklist

### 1. View Resources ✅
```
1. Navigate to Dashboard → Resources section
2. Should see loading spinner briefly
3. Then see list of resources OR empty state message
```

### 2. Upload Resource ✅
```
1. Click "Add Resource" button (cyan)
2. Enter: Resource Name = "Test PDF"
3. Enter: Description = "Testing upload"
4. Click file selector → Choose a PDF file
5. Click "Upload Resource" (green button)
6. Wait for "Uploading..." → Success alert
7. Verify new resource appears in list
```

### 3. Download Resource ✅
```
1. Find any resource in the list
2. Click "Download" button
3. New tab should open with the file
4. File should download to your device
```

### 4. Delete Resource ✅
```
1. Find a test resource
2. Click "Delete" button (red)
3. Confirm in dialog
4. Resource should disappear immediately
5. Success alert should show
```

## Expected UI States

### Loading
- Spinner with "Loading resources..." text

### Empty State
- File icon
- "No resources uploaded yet. Start by adding your first resource!"

### Resource Card Shows
- ✅ Resource name (title)
- ✅ Description
- ✅ Upload date (📅)
- ✅ File type (📄)
- ✅ File size (💾)
- ✅ Download button (cyan)
- ✅ Delete button (red)

### Upload Form Shows
- ✅ Resource Name field (required)
- ✅ Description field (optional)
- ✅ File selector with drag-drop style
- ✅ Upload button (disabled during upload)
- ✅ Clear button

## API Endpoints Being Used

| Action | Endpoint |
|--------|----------|
| List | GET /api/counsellor/resources |
| Upload | POST /api/counsellor/resources |
| Download | GET /api/counsellor/resources/:id/download |
| Delete | DELETE /api/counsellor/resources/:id |

## Common Issues & Solutions

### Resources not loading
- Check: Backend is running
- Check: Logged in as counsellor (not student/admin)
- Check: Browser console for errors

### Upload fails
- Check: File is under 50MB
- Check: File type is allowed (PDF, DOC, DOCX, PPT, PPTX, MP4, JPG, PNG, TXT)
- Check: Resource name is filled

### Download fails
- Check: Supabase storage bucket exists
- Check: Backend can generate signed URLs
- Check: Network tab for API errors

## Success Indicators ✅

- Resources load without errors
- Can upload files successfully
- Can download files (opens in new tab)
- Can delete resources (disappears from list)
- Loading states show during operations
- Error messages display when something fails

## Files Modified

1. **Created:** `frontend/src/services/resourceService.js`
2. **Modified:** `frontend/src/components/dashboard/CounsellorDashboard.jsx`
3. **Documented:** `RESOURCE_MANAGEMENT_INTEGRATION.md`

---

**Status:** ✅ Integration Complete
**Last Updated:** December 6, 2025
