# Gemini API Integration - Quick Reference

## What Was Added

### 1. **New File: `src/lib/geminiAPI.js`**
- Main API integration module
- `generateAssessmentResponse(formName, score, severityLevel)` - Main function
- Automatically falls back to predefined responses if API is unavailable
- Supports all 8 assessment types with proper score ranges

### 2. **Updated: `src/components/Assessment/AssessmentForm.jsx`**
- Imported Gemini API service
- Added AI response generation after score calculation
- Shows loading toast while generating response
- Gracefully handles API failures with fallback responses
- Integrated for all assessment types

### 3. **Documentation: `GEMINI_SETUP.md`**
- Complete setup instructions
- Troubleshooting guide
- Security best practices
- Testing procedures

### 4. **Template: `.env.example`**
- Environment variable template
- Instructions for configuration
- Security warnings

## How to Enable Gemini API

### Step 1: Get API Key
1. Go to https://console.cloud.google.com/
2. Enable "Generative Language API"
3. Create an API key in "Credentials"

### Step 2: Configure Locally
1. Create `.env.local` file in `frontend/` directory
2. Add: `REACT_APP_GEMINI_API_KEY=your_key_here`
3. Restart dev server

### Step 3: Test
1. Complete any assessment
2. You'll see "Generating personalized insights..." toast
3. After submission, view detailed assessment to see AI-generated response

## Features

✅ **Personalized AI Responses**
- Score-specific insights
- Contextual recommendations
- Supportive, non-judgmental tone

✅ **Supported Assessments**
- PHQ-9 (Depression)
- GAD-7 (Anxiety)
- PHQ-2 (Depression screening)
- GAD-2 (Anxiety screening)
- BDI-II (Beck Depression Inventory)
- MMSE (Cognitive assessment)
- C-SSRS (Suicide risk screening)
- GHQ-12 (General health questionnaire)

✅ **Fallback Support**
- Works without API key (uses predefined responses)
- Graceful error handling
- No disruption to assessment flow

✅ **Security**
- API key stored in environment variables
- No hardcoded credentials
- Safe to commit code (but not `.env.local`)

## Current Behavior

### With API Key Configured
1. User completes assessment
2. Score calculated → Severity determined
3. **NEW**: Gemini API called to generate personalized response
4. Response displayed in Assessment History with AI badge

### Without API Key
1. User completes assessment
2. Score calculated → Severity determined
3. Predefined fallback response used (based on severity)
4. Assessment completes normally

## File Locations

```
frontend/
├── src/
│   ├── lib/
│   │   └── geminiAPI.js          (NEW - API integration)
│   └── components/Assessment/
│       ├── AssessmentForm.jsx     (UPDATED - calls Gemini API)
│       └── AssessmentHistory.jsx  (Already displays AI response)
├── .env.example                   (NEW - template)
└── GEMINI_SETUP.md               (NEW - documentation)
```

## API Request Flow

```
User Submits Assessment
         ↓
Calculate Score & Severity
         ↓
Call generateAssessmentResponse()
         ↓
Build Prompt with Assessment Details
         ↓
Send to Gemini API (with API key)
         ↓
Get AI-Generated Response
         ↓
Store with Submission
         ↓
Display in Assessment History
```

## Example Response

**Assessment:** PHQ-9  
**Score:** 12 / 27  
**Severity:** Moderate

**AI Response:**
> "Your recent PHQ-9 assessment shows moderate depressive symptoms. Consider engaging in regular physical activity, maintaining consistent sleep patterns, and reaching out to a therapist or counselor who can provide evidence-based treatment. If you have thoughts of self-harm, please contact a crisis helpline immediately."

## Severity Levels by Assessment

| Assessment | Minimal | Mild | Moderate | Moderately Severe | Severe |
|-----------|---------|------|----------|-------------------|--------|
| PHQ-9     | 0-4     | 5-9  | 10-14    | 15-19             | 20+    |
| GAD-7     | 0-4     | 5-9  | 10-14    | —                 | 15+    |
| BDI-II    | 0-13    | 14-19| 20-28    | —                 | 29+    |
| PHQ-2     | 0-2     | —    | 3-6      | —                 | —      |
| GAD-2     | 0-2     | —    | 3-6      | —                 | —      |

## Troubleshooting

**Question:** "Generating personalized insights..." shows but never completes
- **Answer:** Check API key is valid in `.env.local`
- Restart dev server after adding `.env.local`

**Question:** Assessment completes but no AI response appears
- **Answer:** API key might not be configured; fallback response is being used
- Check browser console for errors

**Question:** How do I know if Gemini API is being used?
- **Answer:** Check browser console; you'll see no errors
- In Network tab, look for requests to `generativelanguage.googleapis.com`

## Next Steps (Optional)

1. **Rate Limiting** - Add per-user API call limits
2. **Caching** - Cache responses for identical scores
3. **Analytics** - Track which responses are most helpful
4. **Multi-language** - Generate responses in different languages
5. **Conversation** - Allow follow-up questions to AI
6. **Backend Integration** - Move API calls to backend for security

## Important Notes

⚠️ **Security**
- Never commit `.env.local` to version control
- API keys should be kept confidential
- Consider moving to backend in production

⚠️ **Costs**
- Gemini API free tier has usage limits
- Monitor costs in GCP console
- Implement rate limiting if needed

✅ **Status**
- Production ready with fallback support
- Works with or without API key
- Graceful error handling implemented

---

**Need Help?** See `GEMINI_SETUP.md` for detailed instructions
