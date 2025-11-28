import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BACKEND_ENABLED, API_BASE } from '../../lib/backendConfig';
import { 
  ArrowLeft, 
  X
} from 'lucide-react';

const AssessmentHistory = ({ sessionId, onBack }) => {
  const { theme } = useTheme();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Dummy data with AI responses
  const dummySubmissions = [
    {
      id: 'sub_001',
      form_name: 'PHQ-9',
      total_score: 8,
      severity_level: 'Mild',
      submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      ai_response: 'Your recent PHQ-9 assessment shows mild depressive symptoms. This is a positive sign of awareness. Consider engaging in regular physical activity, maintaining social connections, and ensuring adequate sleep. If symptoms persist for more than 2 weeks, consider consulting a mental health professional.',
      responses: { q1: 1, q2: 1, q3: 2, q4: 1, q5: 1, q6: 1, q7: 0, q8: 0, q9: 0 }
    },
    {
      id: 'sub_002',
      form_name: 'GAD-7',
      total_score: 5,
      severity_level: 'Mild',
      submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      ai_response: 'Your GAD-7 score indicates mild anxiety symptoms. This level of anxiety is manageable with self-care strategies. Try deep breathing exercises, progressive muscle relaxation, or mindfulness meditation. Limiting caffeine intake and maintaining a regular sleep schedule can also help reduce anxiety.',
      responses: { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 0, q7: 0 }
    },
    {
      id: 'sub_003',
      form_name: 'PHQ-9',
      total_score: 5,
      severity_level: 'Minimal',
      submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      ai_response: 'Excellent progress! Your PHQ-9 score has improved significantly. You are showing resilience and effective coping strategies. Continue with the activities that have been helping you. Regular exercise, social engagement, and adequate sleep remain important for maintaining your mental wellbeing.',
      responses: { q1: 0, q2: 1, q3: 1, q4: 1, q5: 0, q6: 0, q7: 1, q8: 0, q9: 0 }
    },
    {
      id: 'sub_004',
      form_name: 'GAD-7',
      total_score: 12,
      severity_level: 'Moderate',
      submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      ai_response: 'Your GAD-7 assessment indicates moderate anxiety levels. This suggests it might be beneficial to seek support from a mental health professional who can provide evidence-based treatments like cognitive-behavioral therapy (CBT). In the meantime, practice relaxation techniques, maintain regular exercise, and avoid excessive stress triggers when possible.',
      responses: { q1: 2, q2: 2, q3: 2, q4: 2, q5: 1, q6: 2, q7: 1 }
    },
    {
      id: 'sub_005',
      form_name: 'PHQ-9',
      total_score: 15,
      severity_level: 'Moderate',
      submitted_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      ai_response: 'Your PHQ-9 score indicates moderate depression. This is an important time to take action. Consider reaching out to a mental health professional for personalized guidance. Professional support, combined with lifestyle changes like exercise, social connection, and addressing sleep issues, can significantly improve your wellbeing.',
      responses: { q1: 2, q2: 2, q3: 2, q4: 2, q5: 1, q6: 2, q7: 1, q8: 1, q9: 0 }
    },
    {
      id: 'sub_006',
      form_name: 'BDI-II',
      total_score: 18,
      severity_level: 'Mild',
      submitted_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      ai_response: 'Your BDI-II assessment shows mild depressive symptoms. This indicates you may be experiencing some difficulty, but it is manageable. Focus on maintaining social connections, engaging in activities you enjoy, and ensuring proper rest. Consider speaking with a counselor if you feel the need for additional support.',
      responses: { q1: 1, q2: 1, q3: 1, q4: 0, q5: 1, q6: 0, q7: 1, q8: 0, q9: 0 }
    }
  ];

  useEffect(() => {
    if (sessionId) {
      loadSubmissions();
    }
  }, [sessionId]);

  const loadSubmissions = async () => {
    try {
      if (!BACKEND_ENABLED) {
        // Use dummy data for frontend-only mode
        setSubmissions(dummySubmissions);
        return;
      }

      const response = await fetch(
        `${API_BASE}/api/assessment/submissions/${sessionId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const getScoreColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'minimal':
      case 'normal':
      case 'no risk':
        return 'bg-green-100 text-green-800';
      case 'mild':
      case 'low risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
      case 'moderate risk':
      case 'moderate distress':
        return 'bg-orange-100 text-orange-800';
      case 'moderately severe':
      case 'moderate-severe':
        return 'bg-red-100 text-red-800';
      case 'severe':
      case 'high risk':
      case 'severe distress':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaxScore = (formName) => {
    const scores = {
      'PHQ-9': 27, 'GAD-7': 21, 'GHQ-12': 36, 'C-SSRS': 20, 'GHQ-28': 28,
      'PSS-10': 40, 'WHO-5': 25, 'IAT': 100, 'PSQI': 21, 'BHI-10': 30, 'DERS-18': 90
    };
    return scores[formName] || 100;
  };

  if (submissions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className={`${theme.colors.card} text-center shadow-xl`}>
          <CardContent className="p-12">
            <h3 className={`text-xl font-semibold mb-2 ${theme.colors.text}`}>No Assessment History</h3>
            <p className={`${theme.colors.muted} mb-6`}>
              You haven&apos;t completed any assessments yet.
            </p>
            <Button 
              onClick={onBack}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg"
            >
              Take Your First Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort submissions by date (newest first)
  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(b.submitted_at) - new Date(a.submitted_at)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${theme.colors.text}`}>Assessment History</h1>
          <p className={`${theme.colors.muted} text-sm mt-1`}>
            You have completed {submissions.length} assessment{submissions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSubmissions.map((submission) => (
          <Card
            key={submission.id}
            className={`${theme.colors.card} cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105`}
            onClick={() => setSelectedSubmission(submission)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className={`text-xl font-semibold ${theme.colors.text}`}>
                  {submission.form_name}
                </h3>
              </div>

              {/* Score Display */}
              <div className="mb-4">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className={`text-4xl font-bold ${theme.colors.text}`}>
                    {submission.total_score}
                  </span>
                  <span className={`text-lg ${theme.colors.muted}`}>
                    / {getMaxScore(submission.form_name)}
                  </span>
                </div>
              </div>

              {/* Severity Badge */}
              <div className="mb-4">
                <Badge className={`${getScoreColor(submission.severity_level)}`}>
                  {submission.severity_level}
                </Badge>
              </div>

              {/* Date */}
              <p className={`text-xs ${theme.colors.muted}`}>
                {new Date(submission.submitted_at).toLocaleDateString()} at{' '}
                {new Date(submission.submitted_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>

              {/* Click hint */}
              <p className={`text-xs ${theme.colors.muted} mt-3 italic`}>
                Click to view AI insights
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`${theme.colors.card} max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl`}>
            <CardHeader className="sticky top-0 bg-inherit border-b">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-2xl ${theme.colors.text}`}>
                  {selectedSubmission.form_name}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Assessment Details */}
              <div className={`p-4 rounded-lg ${theme.colors.secondary}`}>
                <h3 className={`font-semibold mb-4 ${theme.colors.text}`}>Assessment Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className={`${theme.colors.muted}`}>Score:</span>
                    <p className={`font-semibold ${theme.colors.text} text-lg`}>
                      {selectedSubmission.total_score} / {getMaxScore(selectedSubmission.form_name)}
                    </p>
                  </div>
                  <div>
                    <span className={`${theme.colors.muted}`}>Severity:</span>
                    <p>
                      <Badge className={`${getScoreColor(selectedSubmission.severity_level)} mt-1`}>
                        {selectedSubmission.severity_level}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className={`${theme.colors.muted}`}>Date:</span>
                    <p className={`font-semibold ${theme.colors.text}`}>
                      {new Date(selectedSubmission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`${theme.colors.muted}`}>Time:</span>
                    <p className={`font-semibold ${theme.colors.text}`}>
                      {new Date(selectedSubmission.submitted_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Generated Response */}
              {selectedSubmission.ai_response && (
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <h3 className={`font-semibold text-lg ${theme.colors.text}`}>Personalized Insights</h3>
                  </div>
                  <div className={`p-4 rounded-lg ${theme.colors.secondary} border-l-4 border-cyan-500`}>
                    <p className={`leading-relaxed ${theme.colors.text}`}>
                      {selectedSubmission.ai_response}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;