import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft, 
  CheckCircle,
  AlertTriangle,
  Heart,
  Brain,
  Phone,
  ExternalLink,
  Download,
  Clock,
  TrendingUp,
  AlertCircle,
  Shield
} from 'lucide-react';

import { BACKEND_ENABLED, API_BASE } from '../../lib/backendConfig';

const AssessmentResults = ({ submission, onBack, onViewHistory }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (submission) {
      loadGuidance();
    }
  }, [submission]);

  const loadGuidance = async () => {
    try {
      if (!BACKEND_ENABLED) {
        // compute guidance locally
        const createGuidance = (formName, severity) => {
          const title = `${formName} Guidance`;
          const description = severity.toLowerCase().includes('severe')
            ? 'Your score suggests higher severity; consider reaching out for professional support and urgent help if needed.'
            : severity.toLowerCase().includes('moderate')
              ? 'Your score indicates moderate symptoms. Consider counseling and self-help strategies.'
              : 'Your score is in the lower range. Maintain self-care and monitor changes.';

          const recommendations = [];
          if (severity.toLowerCase().includes('severe') || severity.toLowerCase().includes('moderately severe')) {
            recommendations.push('Seek professional mental health support (counselor, therapist).');
            recommendations.push('If you have thoughts of self-harm, contact emergency services or a crisis hotline immediately.');
          } else if (severity.toLowerCase().includes('moderate')) {
            recommendations.push('Consider brief therapy or speaking with a counselor.');
            recommendations.push('Practice stress-management techniques and monitor symptoms.');
          } else if (severity.toLowerCase().includes('mild')) {
            recommendations.push('Self-help strategies: sleep, exercise, mindfulness, and routine.');
          } else {
            recommendations.push('Keep up healthy habits and reassess if symptoms change.');
          }

          return { guidance: { title, description, recommendations } };
        };

        const data = createGuidance(submission.form_name, submission.severity_level || 'normal');
        setGuidance(data);
        return;
      }

      const response = await fetch(
        `${API_BASE}/api/assessment/guidance/${submission.form_id}/${submission.total_score}`
      );
      if (response.ok) {
        const data = await response.json();
        setGuidance(data);
      }
    } catch (error) {
      console.error('Error loading guidance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className={theme.colors.muted}>No results to display.</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const getScoreColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'none-minimal':
      case 'minimal':
      case 'normal':
        return 'text-green-600 bg-green-100';
      case 'mild':
      case 'mild distress':
        return 'text-yellow-600 bg-yellow-100';
      case 'moderate':
      case 'moderate distress':
        return 'text-orange-600 bg-orange-100';
      case 'moderately severe':
      case 'severe':
      case 'severe distress':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'none-minimal':
      case 'minimal':
      case 'normal':
        return 'bg-green-500';
      case 'mild':
      case 'mild distress':
        return 'bg-yellow-500';
      case 'moderate':
      case 'moderate distress':
        return 'bg-orange-500';
      case 'moderately severe':
      case 'severe':
      case 'severe distress':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMaxScore = (formName) => {
    switch (formName) {
      case 'PHQ-9': return 27;
      case 'GAD-7': return 21;
      case 'GHQ-28': return 28;
      default: return 100;
    }
  };

  const maxScore = getMaxScore(submission.form_name);
  const scorePercentage = (submission.total_score / maxScore) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`${theme.colors.card} shadow-xl`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className={`text-2xl ${theme.colors.text}`}>Assessment Complete</CardTitle>
                <CardDescription className={theme.colors.muted}>
                  {submission.form_name} • Completed on {new Date(submission.submitted_at).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <Badge className={`px-3 py-1 ${getScoreColor(submission.severity_level)}`}>
              {submission.severity_level}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Score Summary */}
      <Card className={`${theme.colors.card} shadow-xl border-l-4 border-l-cyan-500`}>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${theme.colors.text}`}>Your Score</h3>
              <div className="flex items-end space-x-2 mb-4">
                <span className={`text-4xl font-bold ${theme.colors.text}`}>{submission.total_score}</span>
                <span className={`text-xl ${theme.colors.muted} pb-1`}>/ {maxScore}</span>
              </div>
              <Progress 
                value={scorePercentage} 
                className="h-3 mb-2"
              />
              <p className={`text-sm ${theme.colors.muted}`}>
                {scorePercentage.toFixed(1)}% of maximum possible score
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full ${getScoreColor(submission.severity_level)} flex items-center justify-center mb-3 mx-auto`}>
                  {submission.form_name === 'PHQ-9' ? (
                    <Heart className="w-8 h-8" />
                  ) : (
                    <Brain className="w-8 h-8" />
                  )}
                </div>
                <p className={`font-semibold ${theme.colors.text}`}>Severity Level</p>
                <p className={`text-sm ${theme.colors.muted} capitalize`}>{submission.severity_level}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guidance */}
      {guidance && (
        <Card className={`${theme.colors.card} shadow-xl`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${theme.colors.text}`}>
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
              {guidance.guidance.title}
            </CardTitle>
            <CardDescription className={theme.colors.muted}>
              Personalized guidance based on your assessment results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div className={`p-4 rounded-lg ${theme.colors.secondary}`}>
              <p className={theme.colors.text}>{guidance.guidance.description}</p>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className={`font-semibold mb-3 ${theme.colors.text}`}>Recommended Actions:</h4>
              <div className="space-y-3">
                {guidance.guidance.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className={`text-sm ${theme.colors.muted}`}>{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Crisis Support Notice for Severe Results */}
            {(submission.severity_level.toLowerCase().includes('severe') || 
              submission.severity_level.toLowerCase().includes('moderately severe')) && (
              <div className="border-l-4 border-l-red-500 bg-red-50 p-4 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900">Immediate Support Available</h4>
                    <p className="text-sm text-red-800 mt-1 mb-3">
                      Your results suggest you may benefit from immediate professional support. Please don&apos;t hesitate to reach out.
                    </p>
                    <div className="space-y-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white mr-2">
                        <Phone className="w-4 h-4 mr-2" />
                        Crisis Helpline
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                        Find Counselor
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Privacy & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Privacy Notice */}
        <Card className={`${theme.colors.card} shadow-lg`}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className={`font-semibold mb-2 ${theme.colors.text}`}>Your Privacy</h3>
                <p className={`text-sm ${theme.colors.muted} leading-relaxed`}>
                  This assessment is completely anonymous. Your results are not linked to your identity and are stored securely.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className={`${theme.colors.card} shadow-lg`}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className={`font-semibold mb-2 ${theme.colors.text}`}>Track Progress</h3>
                <p className={`text-sm ${theme.colors.muted} leading-relaxed`}>
                  Regular assessments help track your mental health over time. Consider retaking assessments periodically.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Take Another Assessment
        </Button>
        
        <Button 
          onClick={onViewHistory}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg"
        >
          <Clock className="w-4 h-4 mr-2" />
          View Assessment History
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1"
          onClick={() => window.print()}
        >
          <Download className="w-4 h-4 mr-2" />
          Save Results
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className={`${theme.colors.card} shadow-sm`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className={`text-xs ${theme.colors.muted} leading-relaxed`}>
              <strong>Disclaimer:</strong> This assessment is for screening purposes only and is not a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of qualified health providers with any questions you may have regarding a medical condition.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentResults;