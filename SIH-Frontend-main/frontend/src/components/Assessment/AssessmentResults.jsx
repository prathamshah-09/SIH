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
  Shield,
  Loader
} from 'lucide-react';

const AssessmentResults = ({ submission, onBack, onViewHistory }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [currentSubmission, setCurrentSubmission] = useState(submission);

  // Update when submission changes (guidance loaded)
  useEffect(() => {
    if (submission) {
      setCurrentSubmission(submission);
    }
  }, [submission]);

  if (!currentSubmission) {
    return (
      <div className="text-center py-12">
        <p className={theme.colors.muted}>No results to display.</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const getScoreColor = (severity) => {
    if (!severity) return 'text-gray-600 bg-gray-100';
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
    if (!severity) return 'bg-gray-500';
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
    const scores = {
      'PHQ-9': 27,
      'GAD-7': 21,
      'GHQ-12': 36,
      'C-SSRS': 20,
      'CSSRS': 20,
      'PSS-10': 40,
      'WHO-5': 25,
      'IAT': 100,
      'PSQI': 21,
      'BHI-10': 30,
      'DERS-18': 90
    };
    return scores[formName] || 100;
  };

  // Ensure severity_level has a default value
  const severityLevel = currentSubmission.severity_level || 'Normal';
  const maxScore = getMaxScore(currentSubmission.form_name);
  const scorePercentage = (currentSubmission.total_score / maxScore) * 100;

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
                  {currentSubmission.form_name} • Completed on {new Date(currentSubmission.submitted_at).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
            <Badge className={`px-3 py-1 ${getScoreColor(severityLevel)}`}>
              {severityLevel}
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
                <span className={`text-4xl font-bold ${theme.colors.text}`}>{currentSubmission.total_score}</span>
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
                <div className={`w-24 h-24 rounded-full ${getScoreColor(severityLevel)} flex items-center justify-center mb-3 mx-auto`}>
                  {currentSubmission.form_name === 'PHQ-9' ? (
                    <Heart className="w-8 h-8" />
                  ) : (
                    <Brain className="w-8 h-8" />
                  )}
                </div>
                <p className={`font-semibold ${theme.colors.text}`}>Severity Level</p>
                <p className={`text-sm ${theme.colors.muted} capitalize`}>{severityLevel}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guidance */}
      <Card className={`${theme.colors.card} shadow-xl`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme.colors.text}`}>
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            Assessment Guidance
          </CardTitle>
          <CardDescription className={theme.colors.muted}>
            Personalized guidance based on your assessment results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentSubmission.isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader className="w-8 h-8 animate-spin text-cyan-500" />
              <p className={`text-sm ${theme.colors.muted}`}>Generating personalized guidance...</p>
              <p className={`text-xs ${theme.colors.muted}`}>This may take a few moments</p>
            </div>
          ) : currentSubmission.guidance ? (
            <>
              {/* Description */}
              <div className={`p-4 rounded-lg ${theme.colors.secondary}`}>
                <p className={theme.colors.text}>{currentSubmission.guidance}</p>
              </div>

              {/* Recommendations */}
              {currentSubmission.recommendations && currentSubmission.recommendations.length > 0 && (
                <div>
                  <h4 className={`font-semibold mb-3 ${theme.colors.text}`}>Recommended Actions:</h4>
                  <div className="space-y-3">
                    {currentSubmission.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className={`text-sm ${theme.colors.muted}`}>{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`p-4 rounded-lg ${theme.colors.secondary}`}>
              <p className={`text-sm ${theme.colors.muted}`}>Guidance will appear here once generated.</p>
            </div>
          )}

          {/* Crisis Support Notice for Severe Results */}
          {(severityLevel.toLowerCase().includes('severe') || 
            severityLevel.toLowerCase().includes('moderately severe')) && (
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