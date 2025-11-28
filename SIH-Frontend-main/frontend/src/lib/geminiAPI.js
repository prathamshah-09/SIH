/**
 * Gemini API Integration for Assessment AI Responses
 * Generates personalized insights based on assessment scores
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Generates AI response for assessment based on score and form type
 * @param {string} formName - Name of the assessment (PHQ-9, GAD-7, etc.)
 * @param {number} score - Total score from the assessment
 * @param {string} severityLevel - Severity level classification
 * @returns {Promise<string>} - AI-generated response
 */
export const generateAssessmentResponse = async (formName, score, severityLevel) => {
  try {
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not configured. Using fallback response.');
      return getFallbackResponse(formName, score, severityLevel);
    }

    const prompt = buildPrompt(formName, score, severityLevel);

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
          topK: 40,
          topP: 0.95,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
      params: {
        key: GEMINI_API_KEY
      }
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status}`);
      return getFallbackResponse(formName, score, severityLevel);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (content) {
      return content.trim();
    }

    return getFallbackResponse(formName, score, severityLevel);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getFallbackResponse(formName, score, severityLevel);
  }
};

/**
 * Builds the prompt for Gemini based on assessment details
 * @param {string} formName - Name of the assessment
 * @param {number} score - Total score
 * @param {string} severityLevel - Severity classification
 * @returns {string} - Formatted prompt
 */
const buildPrompt = (formName, score, severityLevel) => {
  const assessmentInfo = {
    'PHQ-9': { max: 27, type: 'depression' },
    'GAD-7': { max: 21, type: 'anxiety' },
    'C-SSRS': { max: 20, type: 'suicide risk' },
    'GHQ-12': { max: 36, type: 'general health' },
    'PSS-10': { max: 40, type: 'stress' },
    'WHO-5': { max: 25, type: 'well-being' },
    'IAT': { max: 100, type: 'internet addiction' },
    'PSQI': { max: 21, type: 'sleep quality' },
    'BHI-10': { max: 30, type: 'behavioral health' },
    'DERS-18': { max: 90, type: 'emotion regulation' }
  };

  const info = assessmentInfo[formName] || { max: 100, type: 'mental health' };

  return `You are a supportive mental health assistant providing brief, compassionate feedback on a mental health assessment.

Assessment: ${formName}
Score: ${score}/${info.max}
Severity Level: ${severityLevel}
Assessment Type: ${info.type}

Generate a brief (2-3 sentences), personalized, and supportive response that:
1. Acknowledges the person's current state
2. Provides relevant coping strategies or recommendations based on their score
3. Encourages seeking professional help if needed
4. Maintains a warm, non-judgmental tone

Keep the response practical, supportive, and actionable.`;
};

/**
 * Fallback responses when Gemini API is not available
 * @param {string} formName - Name of the assessment
 * @param {number} score - Total score
 * @param {string} severityLevel - Severity classification
 * @returns {string} - Fallback response
 */
const getFallbackResponse = (formName, score, severityLevel) => {
  const responses = {
    'minimal': 'Your assessment indicates minimal symptoms. Continue with healthy coping strategies and maintain regular self-care practices. If symptoms emerge, please reach out to a mental health professional.',
    'mild': 'You are experiencing some mild symptoms. Consider engaging in stress-reduction activities like exercise, meditation, or speaking with a trusted friend. If symptoms persist, consulting a mental health professional may be beneficial.',
    'moderate': 'Your assessment suggests moderate symptoms that would benefit from professional support. Consider reaching out to a counselor or therapist who can provide personalized guidance and evidence-based treatments.',
    'moderately-severe': 'Your assessment indicates moderately severe symptoms. It is important to seek professional support. Please contact a mental health professional or counselor as soon as possible for comprehensive care.',
    'severe': 'Your assessment indicates severe symptoms that require professional attention. Please reach out to a mental health professional, counselor, or crisis helpline immediately for support and guidance.'
  };

  const levelKey = severityLevel.toLowerCase().replace(/\s+/g, '-');
  return responses[levelKey] || responses['mild'];
};

export default {
  generateAssessmentResponse
};
