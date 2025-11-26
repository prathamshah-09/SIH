# Gemini API Integration Setup

This guide explains how to configure and use the Gemini API for generating AI-powered personalized assessment responses.

## Overview

The assessment system now integrates with Google's Gemini API to generate personalized, AI-powered insights after users complete mental health assessments. When a user submits an assessment (PHQ-9, GAD-7, BDI-II, etc.), the system:

1. Calculates their score and severity level
2. Calls the Gemini API with assessment details
3. Generates a personalized response with insights and recommendations
4. Displays the response in the assessment history with an AI badge

## Prerequisites

- Google Cloud Platform (GCP) account
- Gemini API access enabled
- API key with necessary permissions

## Setup Steps

### 1. Get a Gemini API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Generative Language API:
   - Go to "APIs & Services" → "Library"
   - Search for "Generative Language API"
   - Click "Enable"
4. Create an API key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

### 2. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory (same level as `package.json`):

```env
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

**Important:** 
- Never commit this file to version control
- Add `.env.local` to `.gitignore`
- Keep your API key confidential

### 3. Alternative: Using .env file

If you prefer, you can add the variable to a regular `.env` file:

```env
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

**Note:** Vite uses `VITE_` prefix for environment variables, but this project is configured to use `REACT_APP_` prefix. Make sure your `vite.config.js` properly exports these variables.

### 4. Verify Configuration

After setting the environment variable:

1. Restart your development server
2. Complete an assessment to test:
   - The system should call Gemini API
   - A personalized response will appear after submission
   - The response displays in assessment history with "AI" badge

## API Details

### Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

### Request Format
The system sends structured prompts that include:
- Assessment name (PHQ-9, GAD-7, etc.)
- User's score
- Severity level (Minimal, Mild, Moderate, Severe, etc.)

### Response Format
The API returns a supportive, actionable response (2-3 sentences) that:
- Acknowledges the person's current state
- Provides relevant coping strategies
- Encourages professional help if needed
- Maintains a warm, non-judgmental tone

## Fallback Behavior

If the API key is not configured or the API call fails:
- The system uses pre-written fallback responses
- Responses are generated based on severity level
- The assessment still completes successfully
- Users receive supportive guidance without AI generation

## Cost Considerations

- Gemini API is free with usage limits
- Free tier includes generous quotas for testing
- Consider implementing rate limiting for production
- Monitor usage in GCP Console

## Troubleshooting

### API Key Not Working
- Verify the key is correctly set in `.env.local`
- Check that Generative Language API is enabled in GCP
- Ensure the key has no extra spaces or quotes
- Restart the development server after changes

### "API key not configured" Warning
- This is normal if `.env.local` is not set
- Fallback responses will be used
- Set `REACT_APP_GEMINI_API_KEY` to enable Gemini

### "Gemini API error" in Console
- Check network tab in browser DevTools
- Verify API key has proper permissions
- Check GCP quota and billing settings
- Review API response in browser console

### Timeout Issues
- Default timeout is reasonable for most requests
- If slow, verify API key is valid
- Check internet connection
- Consider adding retry logic

## Security Best Practices

1. **Never hardcode API keys** - Always use environment variables
2. **Use `.env.local`** - Add to `.gitignore` to prevent accidental commits
3. **Rotate keys regularly** - Delete old keys and create new ones
4. **Restrict API key scope** - Use Application restrictions in GCP
5. **Monitor usage** - Check GCP Console for unusual activity
6. **Consider server-side calls** - For production, consider calling Gemini API from backend instead

## Implementation Details

### File: `src/lib/geminiAPI.js`

Main function:
```javascript
generateAssessmentResponse(formName, score, severityLevel)
```

- Accepts assessment details
- Builds contextual prompt
- Calls Gemini API
- Returns AI-generated response or fallback

### File: `src/components/Assessment/AssessmentForm.jsx`

Integration point:
- Imported `generateAssessmentResponse` from geminiAPI
- Called after severity level calculation
- Attached AI response to submission data
- Shows loading toast during generation

### File: `src/components/Assessment/AssessmentHistory.jsx`

Display:
- Shows AI badge in detailed submission view
- Displays response in "Personalized Insights" section
- Styled with gradient background and border accent

## Testing

### Manual Testing
1. Complete an assessment form
2. View detailed submission in Assessment History
3. Verify "Personalized Insights" section appears with AI response
4. Check browser console for any errors

### Without API Key (Fallback Testing)
1. Remove `REACT_APP_GEMINI_API_KEY` from `.env.local`
2. Complete an assessment
3. Verify fallback response appears based on severity level

## Future Enhancements

Potential improvements:
- Implement response caching to reduce API calls
- Add retry logic with exponential backoff
- Implement rate limiting per user
- Add conversation history for follow-up questions
- Support multiple languages
- Add streaming responses for longer text
- Implement server-side API calls for better security

## Support

For issues or questions:
- Check [Gemini API Documentation](https://ai.google.dev/)
- Review [Google Cloud Documentation](https://cloud.google.com/docs)
- Check browser console for error messages
- Verify network requests in DevTools

---

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready with Fallback Support
