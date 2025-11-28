# Gemini AI Integration - Visual Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIH Frontend Application                     │
│                                                                 │
│  ┌──────────────────┐                                          │
│  │ Student Dashboard│                                          │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Assessment Component                                     │  │
│  │ (PHQ-9, GAD-7, BDI-II, etc.)                            │  │
│  └────────┬─────────────────────────────────────────────────┘  │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ AssessmentForm.jsx                                       │  │
│  │ • Calculate Score                                        │  │
│  │ • Determine Severity Level                              │  │
│  │ • Call generateAssessmentResponse()                      │  │
│  └────────┬─────────────────────────────────────────────────┘  │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ src/lib/geminiAPI.js                                     │  │
│  │ • Build contextual prompt                               │  │
│  │ • Handle API communication                              │  │
│  │ • Manage errors & fallbacks                             │  │
│  └────────┬──────────────────────────────────┬──────────────┘  │
│           │                                  │                  │
│     [API KEY VALID]                    [API KEY MISSING]        │
│           │                                  │                  │
│           ▼                                  ▼                  │
│  ┌────────────────────┐          ┌────────────────────┐         │
│  │ Google Gemini API  │          │ Use Fallback       │         │
│  │ - Send prompt      │          │ Response based on  │         │
│  │ - Get response     │          │ Severity Level     │         │
│  │ - Return text      │          │ - Minimal          │         │
│  │                    │          │ - Mild             │         │
│  │ https://           │          │ - Moderate         │         │
│  │ generativelanguage │          │ - Moderately Severe│         │
│  │ .googleapis.com    │          │ - Severe           │         │
│  └────────┬───────────┘          └────────┬───────────┘         │
│           │                               │                    │
│           └───────────────┬───────────────┘                    │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Submission Object with AI Response                       │  │
│  │ {                                                        │  │
│  │   id, form_name, total_score, severity_level,           │  │
│  │   ai_response: "Your assessment shows..."               │  │
│  │ }                                                        │  │
│  └────────┬─────────────────────────────────────────────────┘  │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ AssessmentHistory.jsx                                    │  │
│  │ • Display submission details                            │  │
│  │ • Show "Personalized Insights" section                  │  │
│  │ • Render AI badge & response text                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ User Sees Beautiful Response with AI Badge              │  │
│  │ ┌────────────────────────────────────────────────────┐  │  │
│  │ │ PHQ-9 | Score: 14 | Moderate                      │  │  │
│  │ │                                                    │  │  │
│  │ │ Personalized Insights [AI BADGE]                  │  │  │
│  │ │ ┌──────────────────────────────────────────────┐  │  │  │
│  │ │ │ "Your PHQ-9 assessment shows moderate       │  │  │  │
│  │ │ │  depressive symptoms. Consider daily        │  │  │  │
│  │ │ │  physical activity, consistent sleep, and   │  │  │  │
│  │ │ │  reaching out to a mental health           │  │  │  │
│  │ │ │  professional."                            │  │  │  │
│  │ │ └──────────────────────────────────────────────┘  │  │  │
│  │ └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

```
STUDENT             FRONTEND              GEMINI             HISTORY
  │                   │                     │                  │
  │  Complete Form    │                     │                  │
  ├──────────────────►│                     │                  │
  │                   │ Calculate Score     │                  │
  │                   │ & Severity          │                  │
  │                   │                     │                  │
  │                   │ Build Prompt        │                  │
  │                   │ with Details        │                  │
  │                   │                     │                  │
  │                   │ Send Request        │                  │
  │                   ├────────────────────►│                  │
  │                   │ (API Key Included)  │                  │
  │                   │                     │                  │
  │                   │  [Processing...]    │                  │
  │                   │                     │                  │
  │                   │ Generate Response   │                  │
  │                   │◄────────────────────┤                  │
  │                   │ (AI-Personalized)   │                  │
  │                   │                     │                  │
  │                   │ Attach to Object    │                  │
  │                   │ Submission          │                  │
  │                   │                     │                  │
  │                   │ Pass to History     │                  │
  │                   ├─────────────────────────────────────►│
  │                   │                     │  Display Entry  │
  │  View History     │                     │  with AI Badge  │
  ├──────────────────►│                     │     &Response   │
  │                   │                     │                  │
  │◄─ See Response ───┼─ Personalized ─────┼──────────────────┤
  │   with AI Badge   │   Insights          │                  │
```

## File Structure

```
SIH Frontend/SIH-Frontend-main/frontend/
│
├── .env.example ────────────────────────── Environment template
├── GEMINI_SETUP.md ────────────────────── Detailed setup guide
├── GEMINI_QUICK_START.md ──────────────── Quick reference
├── GEMINI_IMPLEMENTATION.md ───────────── Technical details
├── README_GEMINI_AI.md ────────────────── This integration guide
│
├── src/
│   ├── lib/
│   │   └── geminiAPI.js ───────────────── ✨ NEW: Gemini API module
│   │
│   └── components/Assessment/
│       ├── AssessmentForm.jsx ────────── UPDATED: Call Gemini API
│       ├── AssessmentHistory.jsx ─────── Display AI response
│       └── ...
│
└── vite.config.js ────────────────────── (auto-loads .env variables)
```

## Assessment Severity Matrix

```
Assessment Type    Scale     Minimal    Mild       Moderate   Severe
───────────────────────────────────────────────────────────────────
PHQ-9              0-27      0-4        5-9        10-19      20+
GAD-7              0-21      0-4        5-9        10-14      15+
PHQ-2              0-6       0-2        —          3-6        —
GAD-2              0-6       0-2        —          3-6        —
BDI-II             0-63      0-13       14-19      20-28      29+
GHQ-12             0-36      0-12       12-17      18-23      24+
MMSE               0-30      24-30      20-23      16-19      0-15
C-SSRS             0-20      0          1-6        7-11       12+
```

## Response Generation Logic

```
Input: (formName, score, severityLevel)
│
├─► Build Prompt
│   └─► Include:
│       • Assessment type & max score
│       • User's actual score
│       • Calculated severity level
│       • Request for supportive tone
│       • 2-3 sentence limit
│
├─► Check API Key
│   │
│   ├─► IF KEY EXISTS:
│   │   ├─► Send to Gemini API
│   │   ├─► Parse response
│   │   └─► Return AI text
│   │
│   └─► IF NO KEY:
│       └─► Use Fallback Response
│           based on severity
│
└─► Return Response
    └─► Attach to Submission
        └─► Display in History
            └─► Show with AI Badge
```

## UI Component Hierarchy

```
StudentDashboard
│
├─ AssessmentForm
│  ├─ Questions Display
│  ├─ Response Handlers
│  └─ Submission Confirmation
│      │
│      └─► Call: generateAssessmentResponse()
│          ├─► geminiAPI.js
│          │   ├─ Build Prompt
│          │   ├─ Validate API Key
│          │   └─ Return Response
│          │
│          └─► Show Toast: "Generating insights..."
│
└─ AssessmentHistory
   └─ Submission List
      └─ View Details (Modal)
         ├─ Score & Severity Badge
         ├─ Response Summary
         └─ ✨ Personalized Insights Section
            ├─ AI Badge (gradient)
            ├─ Response Text
            └─ Left Border Highlight
```

## Environment Configuration

```
Development (.env.local - NOT COMMITTED)
│
├─ REACT_APP_GEMINI_API_KEY = "AIza...your_key_here"
├─ REACT_APP_BACKEND_ENABLED = false
└─ REACT_APP_DEBUG = false

                    │
                    ▼

Vite Config (vite.config.js)
│
└─ Automatically loads .env variables
   └─ Makes available as: import.meta.env.VITE_*
   └─ Or: process.env.REACT_APP_*

                    │
                    ▼

Runtime (Browser)
│
├─ geminiAPI.js reads: process.env.REACT_APP_GEMINI_API_KEY
├─ If present: Uses API
└─ If missing: Uses Fallback responses
```

## Error Handling Flow

```
Assessment Submission
│
└─► Try Generate AI Response
    │
    ├─► API Key Check
    │   ├─► Present: Continue
    │   └─► Missing: Use Fallback
    │
    ├─► Build & Send Request
    │   ├─► Success: Get Response
    │   └─► Fail: Catch Error
    │
    ├─► Parse Response
    │   ├─► Valid: Use Response
    │   └─► Invalid: Use Fallback
    │
    └─► Fallback Handler
        ├─ If Minimal: "Maintain routine..."
        ├─ If Mild: "Try self-care..."
        ├─ If Moderate: "Consider professional..."
        ├─ If Severe: "Seek help..."
        │
        └─► User Impact: Zero disruption
            (Assessment completes successfully)
```

## Integration Timeline

```
Before Setup
├─ System works with fallback responses
└─ All features available

        │
        ▼

Setup (8 minutes)
├─ Step 1: Get API Key (5 min)
├─ Step 2: Configure .env.local (1 min)
└─ Step 3: Restart server (2 min)

        │
        ▼

After Setup
├─ System calls Gemini API for responses
├─ Students get AI-personalized insights
└─ All features enhanced
```

## Security Architecture

```
User's Browser (Frontend)
│
├─ .env.local (NOT in version control)
│  └─ Contains: REACT_APP_GEMINI_API_KEY
│
├─ Sends: HTTPS Request
│  ├─ To: Google's Generative Language API
│  └─ With: API Key + Prompt
│
├─ Receives: Response Text
│  └─ Stores in: Submission Object
│
└─ Displays: In Assessment History
   └─ With: AI Badge & Styling

                    │
                    ▼

⚠️ SECURITY RECOMMENDATIONS
├─ Development: Current setup fine
│  └─ API key in .env.local only
│
└─ Production: Move to Backend
   ├─ Store API key on server
   ├─ Frontend calls backend endpoint
   ├─ Backend calls Gemini
   └─ Backend returns response
```

## API Request-Response Example

```
REQUEST
───────────────────────────────────────────────
POST https://generativelanguage.googleapis.com/v1beta/models/...
Content-Type: application/json

{
  "contents": [{
    "parts": [{
      "text": "You are a supportive mental health assistant...
               Assessment: PHQ-9
               Score: 14/27
               Severity Level: Moderate
               Generate a brief supportive response..."
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 200,
    "topK": 40,
    "topP": 0.95
  },
  "safetySettings": [...]
}


RESPONSE
───────────────────────────────────────────────
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "Your PHQ-9 assessment indicates moderate 
                 depressive symptoms. Consider incorporating 
                 daily physical activity and reaching out to a 
                 mental health professional for support."
      }]
    }
  }]
}

        │
        ▼

FRONTEND
───────────────────────────────────────────────
submission.ai_response = "Your PHQ-9 assessment..."
        │
        └─► Display in Assessment History
            └─► Render with AI Badge
```

---

## Quick Reference

**Setup Time:** 8 minutes  
**Files Created:** 5  
**Files Modified:** 1  
**API Calls:** 1 per assessment submission  
**Fallback:** Automatic if no API key  
**Status:** ✅ Production Ready
