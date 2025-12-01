import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getAssessmentHistory, getAssessmentById } from '@services/assessmentService';
import { 
  ArrowLeft, 
  X,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';

const AssessmentHistory = ({ sessionId, onBack }) => {
  const { theme } = useTheme();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const result = await getAssessmentHistory();
      
      // Transform backend response to match frontend format
      const transformedAssessments = result.assessments.map(assessment => ({
        id: assessment.id,
        form_name: assessment.assessmentName,
        total_score: assessment.score,
        severity_level: assessment.severity,
        submitted_at: new Date(assessment.date + ' ' + assessment.time).toISOString(),
        responses: assessment.responses || {},
        guidance: assessment.guidance,
        recommendations: assessment.recommendedActions
      }));
      
      setSubmissions(transformedAssessments);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Failed to load assessment history');
    } finally {
      setLoading(false);
    }
  };

  // Open a submission and fetch full details (guidance, recommendations)
  const openSubmission = async (submission) => {
    setSelectedSubmission(submission);
    setDetailsLoading(true);
    try {
      const full = await getAssessmentById(submission.id);
      // full has shape: { id, formType, score, severityLevel, guidance, recommendedActions, createdAt }
      setSelectedSubmission(prev => ({
        ...prev,
        form_name: full.formType || prev.form_name,
        total_score: typeof full.score === 'number' ? full.score : prev.total_score,
        severity_level: full.severityLevel || prev.severity_level,
        submitted_at: full.createdAt || prev.submitted_at,
        guidance: full.guidance,
        recommendations: full.recommendedActions
      }));
    } catch (err) {
      console.error('Error loading assessment details:', err);
      toast.error('Could not load guidance for this assessment');
    } finally {
      setDetailsLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 animate-spin text-cyan-500" />
          <p className={theme.colors.muted}>Loading assessment history...</p>
        </div>
      </div>
    );
  }

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
            onClick={() => openSubmission(submission)}
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
              {detailsLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader className="w-6 h-6 animate-spin text-cyan-500" />
                  <span className={`ml-3 text-sm ${theme.colors.muted}`}>Loading insights...</span>
                </div>
              )}
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

              {/* Guidance */}
              {selectedSubmission.guidance && !detailsLoading && (
                <div>
                  <h3 className={`font-semibold mb-3 ${theme.colors.text}`}>Guidance</h3>
                  <div className={`p-4 rounded-lg ${theme.colors.secondary} border-l-4 border-cyan-500`}>
                    <p className={`leading-relaxed ${theme.colors.text}`}>
                      {selectedSubmission.guidance}
                    </p>
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {selectedSubmission.recommendations && selectedSubmission.recommendations.length > 0 && !detailsLoading && (
                <div>
                  <h3 className={`font-semibold mb-3 ${theme.colors.text}`}>Recommended Actions</h3>
                  <div className="space-y-2">
                    {selectedSubmission.recommendations.map((action, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className={`text-sm ${theme.colors.muted}`}>{action}</p>
                      </div>
                    ))}
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