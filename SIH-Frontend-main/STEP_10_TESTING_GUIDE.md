# Step 10: Testing Integration with All User Roles

## Overview
This step verifies that the complete appointment management system works correctly for all user roles:
- **Student**: Can book appointments, view their appointments, track session goals
- **Counsellor**: Can manage appointment requests, update sessions with notes/goals, manage availability

## Test Environment Setup

### Backend Server
```bash
cd SIH-Backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend Server
```bash
cd SIH-Frontend/SIH/SIH-Frontend-main/frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

### Database
- Ensure Supabase is configured and migrations are run
- Run migrations to enable pgvector and create embeddings tables:
  ```bash
  npm run migrate
  ```

## Test User Credentials

Use these test accounts from your Supabase user table:

**Student User:**
- Email: `student@example.com`
- Password: `[your test password]`
- Role: `student` (in user_metadata or app_metadata)

**Counsellor User:**
- Email: `counsellor@example.com`
- Password: `[your test password]`
- Role: `counsellor` (in user_metadata or app_metadata)

## Step 10.1: Student Flow Testing

### Setup
1. Log in as student user
2. Navigate to Appointments section
3. Verify the three tabs are visible: "Book", "My Appointments", "Session Goals & Progress"

### Test: Book Appointment
**Location:** StudentAppointments.jsx - Book tab

1. **Date Selection**
   - [ ] Can navigate calendar to select future dates
   - [ ] Selected date displays in calendar
   - [ ] Calendar updates available counsellors for selected date

2. **Counsellor Selection**
   - [ ] Counsellors load from API: `GET /api/student/college-counsellors?date=YYYY-MM-DD`
   - [ ] Shows counsellor name, specialty, and available time slots
   - [ ] Can click to select a counsellor
   - [ ] Selected counsellor displays highlighted

3. **Time Selection**
   - [ ] Available time slots display for selected counsellor
   - [ ] Can click to select a time slot
   - [ ] Selected time displays in UI
   - [ ] Time format is correct (12-hour with AM/PM)

4. **Session Notes**
   - [ ] Can enter pre-session notes
   - [ ] Can generate notes using AI (if implemented)
   - [ ] Can view preparation guide (if implemented)

5. **Booking Submission**
   - [ ] Click "Book Appointment" button
   - [ ] Success toast appears: "Appointment booked successfully!"
   - [ ] UI automatically switches to "My Appointments" tab
   - [ ] Newly booked appointment appears in My Appointments list
   - [ ] API call made: `POST /api/student/book-appointment` with:
     ```json
     {
       "counsellor_id": "uuid",
       "appointment_date": "YYYY-MM-DD",
       "appointment_time": "HH:MM",
       "pre_session_notes": "text"
     }
     ```

6. **Error Handling**
   - [ ] Booking without date/counsellor/time shows validation toast: "Please select a counsellor, date, and time"
   - [ ] Network error shows error toast with helpful message
   - [ ] Failed validation from backend shows detailed error message

### Test: My Appointments
**Location:** StudentAppointments.jsx - My Appointments tab

1. **Load Appointments**
   - [ ] Tab loads automatically when clicked
   - [ ] API call made: `GET /api/student/my-appointments`
   - [ ] Shows loading spinner while fetching
   - [ ] Appointments display after loading

2. **Appointment Display**
   - [ ] Each appointment shows:
     - Student's name
     - Counsellor's name
     - Date and time
     - Status badge (Upcoming, Completed, Cancelled)
   - [ ] Appointments separated into Upcoming and Completed sections
   - [ ] Correct date format (e.g., "January 15, 2024")

3. **Appointment Details**
   - [ ] Can expand appointment to see full details
   - [ ] Pre-session notes display
   - [ ] Post-session notes display (if completed)
   - [ ] Counsellor's profile info visible

4. **Cancellation (if implemented)**
   - [ ] Can cancel upcoming appointments
   - [ ] Confirmation dialog appears
   - [ ] Success toast shows after cancellation
   - [ ] Appointment disappears from list

### Test: Session Goals & Progress
**Location:** StudentAppointments.jsx - Goals tab

1. **Load Session Goals**
   - [ ] Tab loads automatically when clicked
   - [ ] API call made: `GET /api/student/sessions-summary`
   - [ ] Shows loading spinner while fetching
   - [ ] Goals display after loading

2. **Session Goals Display**
   - [ ] Shows sessions with counsellor-assigned goals
   - [ ] Each goal displays:
     - Goal text
     - Session date
     - Completion status (checkbox)
   - [ ] Goals from past sessions clearly visible

3. **Goal Completion**
   - [ ] Can check/uncheck goal completion status
   - [ ] UI updates immediately when clicked
   - [ ] Changes persist (if save button exists, click it)
   - [ ] Success toast shows: "Goals updated successfully" (if applicable)

---

## Step 10.2: Counsellor Flow Testing

### Setup
1. Log in as counsellor user
2. Navigate to Appointments section
3. Verify the three tabs are visible: "Requests", "Sessions", "Manage Availability"

### Test: Appointment Requests
**Location:** CounsellorAppointments.jsx - Requests tab

1. **Load Requests**
   - [ ] Tab loads automatically when clicked
   - [ ] API call made: `GET /api/counsellor/appointment-requests`
   - [ ] Shows loading spinner: "Loading appointment requests..."
   - [ ] Pending requests display after loading

2. **Request Display**
   - [ ] Each request shows:
     - Student name
     - Student college/institution
     - Preferred date
     - Preferred time
     - Pre-session notes from student
   - [ ] Status badge shows "Pending"

3. **Accept Request**
   - [ ] Click "Accept" button on a request
   - [ ] Success toast appears: "Appointment request accepted!"
   - [ ] Request disappears from Requests tab
   - [ ] API call made: `POST /api/counsellor/appointment-requests/:id/accept`
   - [ ] Appointment appears in Sessions tab

4. **Decline Request**
   - [ ] Click "Decline" button on a request
   - [ ] Success toast appears: "Appointment request declined."
   - [ ] Request disappears from Requests tab
   - [ ] API call made: `POST /api/counsellor/appointment-requests/:id/decline`

5. **Error Handling**
   - [ ] Network error shows error toast with details
   - [ ] Concurrent operations handled gracefully
   - [ ] Action buttons disabled during processing

### Test: Sessions
**Location:** CounsellorAppointments.jsx - Sessions tab

1. **Load Sessions**
   - [ ] Tab loads automatically when clicked
   - [ ] API call made: `GET /api/counsellor/sessions?status=upcoming&status=completed`
   - [ ] Shows loading spinner: "Loading sessions..."
   - [ ] Sessions display after loading

2. **Session Display**
   - [ ] Sessions separated into Upcoming and Completed sections
   - [ ] Each session shows:
     - Student name
     - Date and time
     - Status (Upcoming/Completed)
     - Expandable details section

3. **Edit Session Notes**
   - [ ] Click "Edit Notes" on a session
   - [ ] Text area appears for editing
   - [ ] Can add/modify session notes
   - [ ] Click "Save" button
   - [ ] Success toast appears: "Session notes saved successfully!"
   - [ ] API call made: `PATCH /api/counsellor/sessions/:id` with notes and goals
   - [ ] Notes persist after save
   - [ ] Click "Cancel" to discard changes

4. **Manage Action Items**
   - [ ] Can see existing action items for session
   - [ ] Can add new action item:
     - Type action item text
     - Click "Add" button
     - Item appears in list
   - [ ] Can mark action item as completed (checkbox)
   - [ ] Can delete action item:
     - Click trash icon
     - Confirmation dialog
     - Item disappears
   - [ ] Click "Save" to persist changes
   - [ ] Success toast appears: "Action items saved successfully!"

### Test: Manage Availability
**Location:** CounsellorAppointments.jsx - Availability tab

1. **Load Availability Calendar**
   - [ ] Tab loads automatically when clicked
   - [ ] Calendar displays current month
   - [ ] Can navigate months with prev/next arrows
   - [ ] Days with availability slots marked with blue dot

2. **Add Time Slot**
   - [ ] Click on a date
   - [ ] Date selector updates
   - [ ] Enter time in format: "09:00 AM" or "2:30 PM"
   - [ ] Click "Add" button
   - [ ] Success toast appears: "Availability added successfully!"
   - [ ] API call made: `POST /api/counsellor/manage-availability` with:
     ```json
     {
       "date": "YYYY-MM-DD",
       "start_time": "HH:MM"
     }
     ```
   - [ ] New time slot appears in calendar below date
   - [ ] Blue dot appears on calendar date

3. **Validate Time Format**
   - [ ] Invalid formats show error toast: "Please enter a valid time format"
   - [ ] Examples of invalid: "9 AM", "09AM", "25:00"
   - [ ] Examples of valid: "09:00 AM", "2:30 PM", "11:45 AM"

4. **Remove Time Slot**
   - [ ] Click trash icon next to time slot
   - [ ] Confirmation dialog: "Are you sure you want to remove this time slot?"
   - [ ] Click OK to confirm
   - [ ] Success toast appears: "Availability removed successfully!"
   - [ ] API call made: `DELETE /api/counsellor/manage-availability/:availability_id`
   - [ ] Time slot disappears from UI
   - [ ] If last slot for date, blue dot disappears

5. **Error Handling**
   - [ ] Network error shows error toast: "Failed to add/remove availability"
   - [ ] Empty time field shows validation toast
   - [ ] Duplicate slots prevented (optional)

---

## Step 10.3: Cross-Role Integration Testing

### Test: Complete Booking Workflow

1. **Student Books Appointment**
   - [ ] As student: Book appointment with counsellor
   - [ ] Toast shows success
   - [ ] Appointment appears in student's "My Appointments"

2. **Counsellor Sees Request**
   - [ ] Log in as counsellor
   - [ ] New request appears in "Requests" tab
   - [ ] Request shows student's name and details
   - [ ] Correct date/time from student's booking

3. **Counsellor Accepts**
   - [ ] Click "Accept" on request
   - [ ] Toast shows success
   - [ ] Request disappears from Requests tab
   - [ ] Appointment appears in Sessions tab

4. **Student Confirms**
   - [ ] Log back in as student
   - [ ] Appointment status shows as "Upcoming" (not "Pending")
   - [ ] Can still view in My Appointments
   - [ ] Can track session goals if completed

### Test: Date/Timezone Consistency

1. **Date Handling**
   - [ ] Counsellor adds availability for Dec 11
   - [ ] Student sees Dec 11 in calendar (not Dec 10 or 12)
   - [ ] Student books for Dec 11
   - [ ] Counsellor sees appointment on Dec 11
   - [ ] Both roles show same date

2. **Time Format**
   - [ ] All times show in 12-hour format (e.g., "2:30 PM")
   - [ ] Backend stores 24-hour format (e.g., "14:30")
   - [ ] Conversion happens transparently

---

## Step 10.4: Error Scenarios Testing

### Network Errors

1. **Connection Loss During API Call**
   - [ ] Disconnect network
   - [ ] Try to book appointment
   - [ ] Error toast appears with network error message
   - [ ] UI remains functional, no crashes

2. **Server Down**
   - [ ] Stop backend server
   - [ ] Try to fetch appointments
   - [ ] Error toast appears: "Failed to load..." 
   - [ ] UI handles gracefully with empty state

3. **API Response Errors**
   - [ ] Invalid data returns API error
   - [ ] Error message from backend displays in toast
   - [ ] Toast shows variant="destructive" (red styling)

### Validation Errors

1. **Booking Validation**
   - [ ] Book without selecting time: "Please select a counsellor, date, and time"
   - [ ] Invalid time format: Shows appropriate error

2. **Availability Validation**
   - [ ] Invalid time format for availability: "Please enter a valid time format"
   - [ ] Valid format: "09:00 AM" accepts and saves

### Permission/Authorization Errors

1. **403 Forbidden** (if user role not set)
   - [ ] Counsellor endpoint returns 403
   - [ ] Error toast shows helpful message
   - [ ] Check server logs for role validation details
   - [ ] Verify user_metadata.role is set to "counsellor" in Supabase

---

## Testing Checklist

### Student Account
- [ ] Login successful
- [ ] Book appointment: Complete flow
- [ ] My Appointments: Load and display
- [ ] Session Goals: Load and display
- [ ] Toast notifications appear for all operations
- [ ] Error handling works (try with invalid inputs)

### Counsellor Account
- [ ] Login successful  
- [ ] Requests tab: Load and display
- [ ] Accept appointment: Success toast
- [ ] Decline appointment: Success toast
- [ ] Sessions tab: Load and display
- [ ] Edit session notes: Save with success
- [ ] Add action items: Save with success
- [ ] Manage availability: Add slot with success
- [ ] Manage availability: Remove slot with success
- [ ] Toast notifications appear for all operations

### Integration
- [ ] Student books → Counsellor sees request
- [ ] Counsellor accepts → Student sees appointment
- [ ] Dates consistent across both roles
- [ ] No timezone offset issues

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Validation errors show helpful messages
- [ ] All toasts styled appropriately
- [ ] UI remains responsive during errors

---

## Debugging Tips

### Check Console Logs
```javascript
// Backend logs (in terminal running npm start)
[Auth] User authenticated - ID: ..., Email: ..., Role: ...
[Role Check] User: ..., Role: ..., Required: ...

// Frontend logs (in browser DevTools console)
Error logs from API calls will show response structure
```

### Common Issues

**403 Forbidden on Counsellor Endpoints**
- Problem: User role not set in Supabase
- Solution: Set user_metadata: { "role": "counsellor" } in Supabase user record
- Verify in browser Network tab under Authorization header

**Dates Off by One Day**
- Problem: Timezone offset issue
- Status: FIXED - formatDateToKey() uses local date, not UTC
- Verify in both StudentAppointments and CounsellorAppointments

**Sessions Endpoint Returns Empty**
- Problem: Status filter logic
- Status: FIXED - uses conditional filter (in/eq based on params)
- Should return both upcoming and completed appointments

**Missing Counsellor Data**
- Problem: Relationship query failed
- Status: FIXED - separate queries for student/counsellor data
- Backend now fetches student separately after appointment query

---

## After Testing

Once all tests pass:
1. Document any bugs found
2. Create issues for bugs needing fixes
3. Update frontend README with test credentials
4. Prepare for production deployment
5. Consider adding automated tests for regression prevention

---

## Test Results Template

Use this template to document your test results:

```
## Test Date: [DATE]
## Tester: [NAME]

### Student Flow
- [ ] Login: PASS / FAIL
- [ ] Book Appointment: PASS / FAIL
  - Issues: [list any]
- [ ] My Appointments: PASS / FAIL
  - Issues: [list any]
- [ ] Session Goals: PASS / FAIL
  - Issues: [list any]

### Counsellor Flow
- [ ] Login: PASS / FAIL
- [ ] Requests: PASS / FAIL
  - Issues: [list any]
- [ ] Sessions: PASS / FAIL
  - Issues: [list any]
- [ ] Availability: PASS / FAIL
  - Issues: [list any]

### Integration
- [ ] End-to-end flow: PASS / FAIL
  - Issues: [list any]
- [ ] Error handling: PASS / FAIL
  - Issues: [list any]

### Overall Status
✅ READY FOR DEPLOYMENT / ⚠️ NEEDS FIXES / ❌ BLOCKED

### Notes
[Any additional observations]
```
