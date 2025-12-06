# Form Management & Assessment API Specification

## Overview
This document outlines the data structure and API endpoints for the Form Management system. The frontend currently uses localStorage for data persistence, and these specifications are designed for seamless backend integration.

---

## Data Structures

### 1. Form Object
Represents a form created by admins.

```json
{
  "id": 1,
  "title": "Weekly Wellness Check-in",
  "description": "A comprehensive wellness assessment to monitor student mental health and stress levels.",
  "createdBy": "admin@college.edu",
  "createdAt": "2025-12-05T10:30:00.000Z",
  "updatedAt": "2025-12-05T10:30:00.000Z",
  "status": "active",
  "responses": 45,
  "questions": [
    {
      "id": 101,
      "text": "How would you rate your overall stress level this week?",
      "type": "MCQ",
      "options": ["Very Low", "Low", "Moderate", "High", "Very High"],
      "required": true,
      "order": 1
    },
    {
      "id": 102,
      "text": "Which areas are affecting your wellbeing? (Select all that apply)",
      "type": "Multiple Select",
      "options": ["Academic Pressure", "Social Issues", "Financial Concerns", "Health Problems", "Family Matters"],
      "required": true,
      "order": 2
    },
    {
      "id": 103,
      "text": "What support do you need most right now?",
      "type": "Text Input",
      "options": [],
      "required": false,
      "order": 3
    }
  ]
}
```

### 2. Form Submission Object
Represents a student's completed form response.

```json
{
  "id": 1001,
  "formId": 1,
  "studentId": "student_001",
  "studentName": "Raj Kumar",
  "submittedAt": "2025-12-04T14:25:00.000Z",
  "responses": {
    "101": "High",
    "102": ["Academic Pressure", "Financial Concerns"],
    "103": "Need financial aid and stress management guidance"
  }
}
```

### 3. Question Types & Response Formats

#### MCQ (Single Choice)
- **Type**: `"MCQ"`
- **Response Format**: String (single option value)
- **Example**: `"High"`

#### Multiple Select
- **Type**: `"Multiple Select"`
- **Response Format**: Array of strings
- **Example**: `["Academic Pressure", "Financial Concerns"]`

#### Text Input
- **Type**: `"Text Input"`
- **Response Format**: String (free text)
- **Example**: `"Need financial aid and stress management guidance"`

---

## API Endpoints

### Forms Management

#### 1. Get All Forms
```
GET /api/forms
```
**Response:**
```json
{
  "success": true,
  "data": [
    { /* Form Object */ }
  ],
  "count": 3
}
```

#### 2. Create Form
```
POST /api/forms
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "questions": [
    {
      "text": "string",
      "type": "MCQ | Multiple Select | Text Input",
      "options": ["string"],
      "required": boolean,
      "order": number
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Created Form Object */ },
  "message": "Form created successfully"
}
```

#### 3. Update Form
```
PUT /api/forms/:formId
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "questions": [...]
}
```

#### 4. Delete Form
```
DELETE /api/forms/:formId
```

**Response:**
```json
{
  "success": true,
  "message": "Form deleted successfully"
}
```

#### 5. Duplicate Form
```
POST /api/forms/:formId/duplicate
```

**Response:**
```json
{
  "success": true,
  "data": { /* Duplicated Form Object */ },
  "message": "Form duplicated successfully"
}
```

---

### Form Submissions

#### 1. Submit Form Response
```
POST /api/forms/:formId/submit
Content-Type: application/json
Authorization: Bearer <student_token>

{
  "responses": {
    "101": "High",
    "102": ["Academic Pressure", "Financial Concerns"],
    "103": "Need support"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Form Submission Object */ },
  "message": "Form submitted successfully"
}
```

#### 2. Get Form Submissions
```
GET /api/forms/:formId/submissions
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)
- `studentId` (optional): Filter by student ID

**Response:**
```json
{
  "success": true,
  "data": [
    { /* Form Submission Objects */ }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

#### 3. Get Student's Submission for a Form
```
GET /api/forms/:formId/submissions/student/:studentId
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "success": true,
  "data": { /* Form Submission Object */ },
  "message": "Submission retrieved successfully"
}
```

#### 4. Get Form Analytics
```
GET /api/forms/:formId/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formId": 1,
    "title": "Weekly Wellness Check-in",
    "totalSubmissions": 45,
    "submissionRate": 85.5,
    "questionAnalytics": [
      {
        "questionId": 101,
        "text": "How would you rate your overall stress level this week?",
        "type": "MCQ",
        "responseDistribution": {
          "Very Low": 5,
          "Low": 12,
          "Moderate": 18,
          "High": 8,
          "Very High": 2
        }
      },
      {
        "questionId": 102,
        "text": "Which areas are affecting your wellbeing?",
        "type": "Multiple Select",
        "topResponses": {
          "Academic Pressure": 35,
          "Social Issues": 22,
          "Financial Concerns": 18,
          "Health Problems": 8,
          "Family Matters": 5
        }
      }
    ]
  }
}
```

---

## localStorage Keys (Current Frontend Implementation)

### Key: `saved_forms`
- **Type**: Array of Form Objects
- **Usage**: Stores all created forms
- **Example**:
```javascript
localStorage.getItem('saved_forms')
// Returns: JSON array of forms
```

### Key: `form_submissions`
- **Type**: Array of Form Submission Objects
- **Usage**: Stores all form responses
- **Example**:
```javascript
localStorage.getItem('form_submissions')
// Returns: JSON array of submissions
```

---

## Migration Strategy

### Phase 1: Parallel Storage
- Keep localStorage as primary cache
- Sync with backend on save/submit
- Fallback to localStorage if backend unavailable

### Phase 2: Backend Primary
- Backend becomes primary data store
- Fetch forms/submissions from backend on app load
- Use localStorage as session cache

### Phase 3: Full Integration
- Remove localStorage dependency
- Implement real-time sync with WebSockets (optional)

---

## Frontend Integration Points

### FormManagement Component
- **File**: `src/components/admin/FormManagement.jsx`
- **Functions to Update**:
  - `saveForm()` → POST `/api/forms`
  - `deleteForm()` → DELETE `/api/forms/:id`
  - `duplicateForm()` → POST `/api/forms/:id/duplicate`
  - `loadAdminForms()` → GET `/api/forms`

### AdminFormResponse Component
- **File**: `src/components/Assessment/AdminFormResponse.jsx`
- **Functions to Update**:
  - `handleSubmit()` → POST `/api/forms/:formId/submit`

### AssessmentDashboard Component
- **File**: `src/components/Assessment/AssessmentDashboard.jsx`
- **Functions to Update**:
  - `loadAdminForms()` → GET `/api/forms`
  - Add new method: `loadFormSubmissions()` → GET `/api/forms/:formId/submissions`

---

## Dummy Data Summary

### Demo Forms (3)
1. **Weekly Wellness Check-in** - 3 questions, 45 responses
2. **Mental Health Assessment** - 3 questions, 38 responses
3. **Academic Performance & Burnout** - 3 questions, 52 responses

### Demo Submissions (4)
- Student 001: Raj Kumar - Weekly Wellness submission
- Student 002: Priya Singh - Weekly Wellness submission
- Student 003: Arjun Patel - Mental Health submission
- Student 004: Sneha Desai - Academic Performance submission

All dummy data is available in localStorage under the keys mentioned above.

---

## Error Handling

### Expected HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (invalid form data)
- **401**: Unauthorized (invalid token)
- **403**: Forbidden (permission denied)
- **404**: Not Found (form/submission not found)
- **422**: Unprocessable Entity (validation error)
- **500**: Server Error

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## Testing Recommendations

1. **Form Creation**: Test with all question types
2. **Form Submission**: Test with required/optional questions
3. **Data Persistence**: Verify localStorage sync with backend
4. **Analytics**: Check response distribution calculations
5. **Pagination**: Test with large submission sets
6. **Error Cases**: Test with invalid/malformed data

---

## Notes for Backend Development

- All timestamps should be in ISO 8601 format
- Form IDs and Question IDs should be unique (use UUID or auto-increment)
- Store student responses with timestamp for audit trail
- Implement role-based access (admin only for form CRUD, student for submission)
- Add soft delete for forms (don't permanently remove, just mark inactive)
- Consider indexing formId and studentId for faster queries
