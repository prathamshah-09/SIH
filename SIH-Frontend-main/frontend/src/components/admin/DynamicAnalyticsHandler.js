/**
 * DynamicAnalyticsHandler.js
 * Intelligent form analytics with missing data handling
 * Auto-detects categories from questions and generates smart analytics
 */

export const ANALYTICS_CATEGORIES = {
  exam_stress: {
    name: 'Exam Stress Index',
    description: 'Performance pressure and academic anxiety',
    keywords: ['exam', 'test', 'assessment', 'pressure', 'academic', 'performance', 'study'],
    color: '#3b82f6'
  },
  sleep_health: {
    name: 'Sleep Health',
    description: 'Sleep quality and rest patterns',
    keywords: ['sleep', 'rest', 'fatigue', 'insomnia', 'tired', 'exhausted', 'awake'],
    color: '#8b5cf6'
  },
  emotional_wellness: {
    name: 'Emotional Wellness',
    description: 'Mood and emotional stability',
    keywords: ['mood', 'emotion', 'happy', 'sad', 'angry', 'frustrated', 'calm', 'peaceful'],
    color: '#ec4899'
  },
  social_connectivity: {
    name: 'Social Connectivity',
    description: 'Relationships and social engagement',
    keywords: ['friend', 'social', 'relationship', 'lonely', 'isolated', 'community', 'connection'],
    color: '#10b981'
  },
  burnout_index: {
    name: 'Burnout Index',
    description: 'Exhaustion and motivation levels',
    keywords: ['burnout', 'exhausted', 'overwhelmed', 'stressed', 'motivation', 'energy', 'overwhelm'],
    color: '#f59e0b'
  },
  productivity_score: {
    name: 'Productivity Score',
    description: 'Task completion and focus',
    keywords: ['productivity', 'focus', 'concentration', 'task', 'efficient', 'progress', 'accomplish'],
    color: '#06b6d4'
  }
};

/**
 * Detects the category of a question based on keywords
 * @param {string} questionText - The question text to analyze
 * @returns {string|null} - Category key or null if no match
 */
export const detectQuestionCategory = (questionText) => {
  if (!questionText) return null;
  
  const lowerText = questionText.toLowerCase();
  
  for (const [categoryKey, categoryData] of Object.entries(ANALYTICS_CATEGORIES)) {
    for (const keyword of categoryData.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return categoryKey;
      }
    }
  }
  
  return null;
};

/**
 * Analyzes form structure to determine which categories have data
 * @param {Array} formQuestions - Array of form questions
 * @returns {Object} - Coverage analysis with categories and counts
 */
export const analyzeFormStructure = (formQuestions = []) => {
  const coverage = {};
  
  // Initialize all categories
  Object.keys(ANALYTICS_CATEGORIES).forEach(key => {
    coverage[key] = {
      count: 0,
      questions: [],
      coverage: 0
    };
  });
  
  // Detect categories for each question
  formQuestions.forEach((question, index) => {
    const category = detectQuestionCategory(question.text || question);
    if (category) {
      coverage[category].count += 1;
      coverage[category].questions.push(index);
    }
  });
  
  // Calculate coverage percentage
  const totalQuestions = formQuestions.length || 1;
  Object.keys(coverage).forEach(key => {
    coverage[key].coverage = (coverage[key].count / totalQuestions) * 100;
  });
  
  return coverage;
};

/**
 * Generates smart analytics data only for available categories
 * @param {Array} formQuestions - Array of form questions
 * @param {Object} responseData - Raw response data from forms
 * @returns {Array} - Array of analytics items for available categories
 */
export const generateSmartAnalytics = (formQuestions = [], responseData = {}) => {
  const coverage = analyzeFormStructure(formQuestions);
  const analyticsItems = [];
  
  // Only include categories that have questions
  Object.entries(coverage).forEach(([categoryKey, categoryInfo]) => {
    if (categoryInfo.count > 0) {
      const categoryData = ANALYTICS_CATEGORIES[categoryKey];
      
      // Generate dummy data based on category
      const data = generateDummyData(categoryKey);
      const trend = getTrendIndicator();
      
      analyticsItems.push({
        id: categoryKey,
        category: categoryData.name,
        description: categoryData.description,
        color: categoryData.color,
        data,
        trend,
        coverage: categoryInfo.coverage,
        questionCount: categoryInfo.count,
        chart: getChartType(categoryKey)
      });
    }
  });
  
  return analyticsItems;
};

/**
 * Generates warnings for missing data or low coverage
 * @param {Array} formQuestions - Array of form questions
 * @returns {Array} - Array of warning objects
 */
export const generateDataWarnings = (formQuestions = []) => {
  const coverage = analyzeFormStructure(formQuestions);
  const warnings = [];
  
  Object.entries(coverage).forEach(([categoryKey, categoryInfo]) => {
    if (categoryInfo.count === 0) {
      warnings.push({
        type: 'missing',
        category: ANALYTICS_CATEGORIES[categoryKey].name,
        message: `No questions tagged with "${categoryKey.replace(/_/g, ' ')}" in the form`
      });
    } else if (categoryInfo.coverage < 50) {
      warnings.push({
        type: 'low-coverage',
        category: ANALYTICS_CATEGORIES[categoryKey].name,
        message: `Low coverage (${Math.round(categoryInfo.coverage)}%) for this category`,
        coverage: categoryInfo.coverage
      });
    }
  });
  
  return warnings;
};

/**
 * Gets category name from key
 * @param {string} categoryKey - The category key
 * @returns {string} - Category name
 */
export const getCategoryName = (categoryKey) => {
  return ANALYTICS_CATEGORIES[categoryKey]?.name || 'Unknown Category';
};

/**
 * Gets all category names
 * @returns {Array} - Array of category names
 */
export const getAllCategoryNames = () => {
  return Object.values(ANALYTICS_CATEGORIES).map(cat => cat.name);
};

// ========== Helper Functions ==========

/**
 * Determines chart type based on category
 * @param {string} categoryKey - The category key
 * @returns {string} - Chart type (line, bar, or doughnut)
 */
const getChartType = (categoryKey) => {
  const chartTypes = {
    exam_stress: 'line',
    sleep_health: 'bar',
    emotional_wellness: 'doughnut',
    social_connectivity: 'bar',
    burnout_index: 'line',
    productivity_score: 'bar'
  };
  
  return chartTypes[categoryKey] || 'bar';
};

/**
 * Generates dummy data for visualization
 * @param {string} categoryKey - The category key
 * @returns {Object} - Data object with labels and values
 */
const generateDummyData = (categoryKey) => {
  const timeLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
  
  const dataRanges = {
    exam_stress: [45, 52, 48, 55, 60, 58, 62],
    sleep_health: [6.5, 6.2, 7.1, 6.8, 7.3, 7.0, 7.5],
    emotional_wellness: [65, 70, 72, 68, 75, 78, 80],
    social_connectivity: [4, 4.5, 5, 4.2, 5.5, 5.8, 6],
    burnout_index: [55, 58, 54, 60, 52, 48, 45],
    productivity_score: [6, 6.5, 7, 6.8, 7.5, 8, 8.2]
  };
  
  return {
    labels: timeLabels,
    values: dataRanges[categoryKey] || [0, 0, 0, 0, 0, 0, 0]
  };
};

/**
 * Gets a trend indicator
 * @returns {string} - Trend indicator (up, down, or stable)
 */
const getTrendIndicator = () => {
  const trends = ['up', 'down', 'stable'];
  return trends[Math.floor(Math.random() * trends.length)];
};

export default {
  ANALYTICS_CATEGORIES,
  detectQuestionCategory,
  analyzeFormStructure,
  generateSmartAnalytics,
  generateDataWarnings,
  getCategoryName,
  getAllCategoryNames
};
