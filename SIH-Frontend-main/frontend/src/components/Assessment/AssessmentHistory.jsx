import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BACKEND_ENABLED, API_BASE } from '../../lib/backendConfig';
import { 
  ArrowLeft, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Clock,
  Eye,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

const AssessmentHistory = ({ sessionId, onBack }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterForm, setFilterForm] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    if (sessionId) {
      loadSubmissions();
    }
  }, [sessionId]);

  const loadSubmissions = async () => {
    try {
      if (!BACKEND_ENABLED) {
        // No persistence: rely on ephemeral submissions passed via navigation in future or show empty history.
        setSubmissions([]);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const filteredSubmissions = filterForm === 'all' 
    ? submissions 
    : submissions.filter(s => s.form_name === filterForm);

  const uniqueForms = [...new Set(submissions.map(s => s.form_name))];

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

  const getTrendIcon = (currentScore, previousScore) => {
    if (!previousScore) return <Minus className="w-4 h-4 text-gray-400" />;
    if (currentScore > previousScore) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (currentScore < previousScore) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getMaxScore = (formName) => {
    switch (formName) {
      case 'PHQ-9': return 27;
      case 'GAD-7': return 21;
      case 'GHQ-28': return 28;
      default: return 100;
    }
  };

  const calculateTrendData = (formName) => {
    const formSubmissions = submissions
      .filter(s => s.form_name === formName)
      .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
    
    if (formSubmissions.length < 2) return null;
    
    const latest = formSubmissions[formSubmissions.length - 1];
    const previous = formSubmissions[formSubmissions.length - 2];
    const improvement = previous.total_score - latest.total_score;
    
    return {
      latest,
      previous,
      improvement,
      trend: improvement > 0 ? 'improving' : improvement < 0 ? 'worsening' : 'stable'
    };
  };

  if (submissions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className={`${theme.colors.card} text-center shadow-xl`}>
          <CardContent className="p-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${theme.colors.text}`}>No Assessment History</h3>
            <p className={`${theme.colors.muted} mb-6`}>
              You haven&apos;t completed any assessments yet. Start your mental health journey by taking your first assessment.
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`${theme.colors.card} shadow-lg`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className={`text-2xl ${theme.colors.text}`}>Assessment History</CardTitle>
                <CardDescription className={theme.colors.muted}>
                  Track your mental health journey over time
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={loadSubmissions}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className={`${theme.colors.card} shadow-sm`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className={`text-sm font-medium ${theme.colors.text}`}>Filter by form:</span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={filterForm === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterForm('all')}
              >
                All ({submissions.length})
              </Button>
              {uniqueForms.map(formName => {
                const count = submissions.filter(s => s.form_name === formName).length;
                return (
                  <Button
                    key={formName}
                    size="sm"
                    variant={filterForm === formName ? 'default' : 'outline'}
                    onClick={() => setFilterForm(formName)}
                  >
                    {formName} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Summary */}
      {uniqueForms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueForms.map(formName => {
            const trendData = calculateTrendData(formName);
            if (!trendData) return null;

            return (
              <Card key={formName} className={`${theme.colors.card} shadow-lg`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${theme.colors.text}`}>{formName}</h3>
                    {getTrendIcon(trendData.latest.total_score, trendData.previous.total_score)}
                  </div>
                  <div className="flex items-end space-x-2 mb-2">
                    <span className={`text-2xl font-bold ${theme.colors.text}`}>
                      {trendData.latest.total_score}
                    </span>
                    <span className={`text-sm ${theme.colors.muted}`}>
                      / {getMaxScore(formName)}
                    </span>
                  </div>
                  {trendData.improvement !== 0 && (
                    <p className={`text-xs ${
                      trendData.improvement > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trendData.improvement > 0 ? '↓' : '↑'} {Math.abs(trendData.improvement)} points from last assessment
                    </p>
                  )}
                  <Badge className={`mt-2 ${getScoreColor(trendData.latest.severity_level)} text-xs`}>
                    {trendData.latest.severity_level}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Assessment List */}
      <Card className={`${theme.colors.card} shadow-xl`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme.colors.text}`}>
            <BarChart3 className="w-5 h-5 mr-2" />
            Assessment Timeline ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredSubmissions.map((submission, index) => {
              const previousSubmission = filteredSubmissions
                .filter(s => s.form_name === submission.form_name)
                .find((s, i, arr) => arr[i + 1] && arr[i + 1].id === submission.id);
              
              return (
                <div 
                  key={submission.id}
                  className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                    index === filteredSubmissions.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`font-semibold ${theme.colors.text}`}>
                          {submission.form_name}
                        </h3>
                        <Badge className={`${getScoreColor(submission.severity_level)} text-xs`}>
                          {submission.severity_level}
                        </Badge>
                        {getTrendIcon(
                          submission.total_score, 
                          previousSubmission?.total_score
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className={theme.colors.muted}>Score:</span>
                          <p className={`font-medium ${theme.colors.text}`}>
                            {submission.total_score} / {getMaxScore(submission.form_name)}
                          </p>
                        </div>
                        <div>
                          <span className={theme.colors.muted}>Date:</span>
                          <p className={`font-medium ${theme.colors.text}`}>
                            {new Date(submission.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className={theme.colors.muted}>Time:</span>
                          <p className={`font-medium ${theme.colors.text}`}>
                            {new Date(submission.submitted_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>
                          <span className={theme.colors.muted}>Trend:</span>
                          <p className={`font-medium ${
                            previousSubmission 
                              ? submission.total_score > previousSubmission.total_score 
                                ? 'text-red-600' 
                                : submission.total_score < previousSubmission.total_score 
                                ? 'text-green-600' 
                                : 'text-gray-600'
                              : 'text-gray-600'
                          }`}>
                            {previousSubmission 
                              ? submission.total_score > previousSubmission.total_score 
                                ? `+${submission.total_score - previousSubmission.total_score}` 
                                : submission.total_score < previousSubmission.total_score 
                                ? `${submission.total_score - previousSubmission.total_score}` 
                                : 'No change'
                              : 'First assessment'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="px-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessments
        </Button>
      </div>

      {/* Detailed View Modal (Simple version) */}
      {selectedSubmission && (
        <Card className={`${theme.colors.card} shadow-2xl border-2 border-cyan-500`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={theme.colors.text}>
                {selectedSubmission.form_name} - Detailed Results
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold mb-2 ${theme.colors.text}`}>Assessment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={theme.colors.muted}>Form:</span>
                    <span className={theme.colors.text}>{selectedSubmission.form_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.colors.muted}>Score:</span>
                    <span className={theme.colors.text}>
                      {selectedSubmission.total_score} / {getMaxScore(selectedSubmission.form_name)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.colors.muted}>Severity:</span>
                    <Badge className={`${getScoreColor(selectedSubmission.severity_level)} text-xs`}>
                      {selectedSubmission.severity_level}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.colors.muted}>Date:</span>
                    <span className={theme.colors.text}>
                      {new Date(selectedSubmission.submitted_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className={`font-semibold mb-2 ${theme.colors.text}`}>Response Summary</h4>
                <div className="text-sm">
                  <div className={`p-3 rounded-lg ${theme.colors.secondary}`}>
                    <p className={theme.colors.muted}>
                      Total responses: {Object.keys(selectedSubmission.responses || {}).length}
                    </p>
                    <p className={theme.colors.muted}>
                      Assessment ID: {selectedSubmission.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssessmentHistory;