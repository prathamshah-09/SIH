import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  Settings,
  Users,
  BarChart3,
  TrendingUp,
  FileText,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Chekc kr rha hu 
// hello

const AdminFormManagement = ({ onBack }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [aggregateData, setAggregateData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadAggregateData();
  }, []);

  const loadAggregateData = async () => {
    try {
      if (!BACKEND_ENABLED) {
        // Generate mock aggregate data from localStorage submissions
        const mockAggregate = [
          {
            form_name: 'PHQ-9',
            total_submissions: 45,
            average_score: 12.3,
            severity_distribution: {
              'None-Minimal': 8,
              'Mild': 15,
              'Moderate': 18,
              'Moderately Severe': 3,
              'Severe': 1
            }
          },
          {
            form_name: 'GAD-7',
            total_submissions: 38,
            average_score: 10.5,
            severity_distribution: {
              'Normal': 12,
              'Mild': 14,
              'Moderate': 10,
              'Severe': 2
            }
          },
          {
            form_name: 'GHQ-12',
            total_submissions: 32,
            average_score: 8.7,
            severity_distribution: {
              'Normal': 20,
              'Mild': 8,
              'Moderate': 4
            }
          }
        ];
        setAggregateData(mockAggregate);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/admin/assessment/aggregate`);
      if (response.ok) {
        const data = await response.json();
        setAggregateData(data);
      }
    } catch (error) {
      console.error('Error loading aggregate data:', error);
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`${theme.colors.card} shadow-lg`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className={`text-2xl ${theme.colors.text}`}>Assessment Management</CardTitle>
                <CardDescription className={theme.colors.muted}>
                  Manage forms and view aggregate assessment data
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={loadAggregateData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Aggregate Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${theme.colors.card} shadow-lg`}>
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className={`text-2xl font-bold ${theme.colors.text}`}>
              {aggregateData.reduce((sum, form) => sum + form.total_submissions, 0)}
            </h3>
            <p className={`${theme.colors.muted}`}>Total Assessments</p>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} shadow-lg`}>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className={`text-2xl font-bold ${theme.colors.text}`}>
              {aggregateData.length}
            </h3>
            <p className={`${theme.colors.muted}`}>Active Forms</p>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} shadow-lg`}>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className={`text-2xl font-bold ${theme.colors.text}`}>
              {aggregateData.length > 0 ? 
                Math.round(aggregateData.reduce((sum, form) => sum + form.total_submissions, 0) / aggregateData.length) 
                : 0
              }
            </h3>
            <p className={`${theme.colors.muted}`}>Avg per Form</p>
          </CardContent>
        </Card>
      </div>

      {/* Form-wise Statistics */}
      <Card className={`${theme.colors.card} shadow-xl`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme.colors.text}`}>
            <BarChart3 className="w-5 h-5 mr-2" />
            Form Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aggregateData.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${theme.colors.text}`}>No Data Available</h3>
              <p className={`${theme.colors.muted}`}>
                No assessment submissions have been recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {aggregateData.map((formData, index) => (
                <div key={index} className={`p-6 rounded-lg border ${theme.colors.secondary}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-semibold ${theme.colors.text}`}>
                      {formData._id}
                    </h3>
                    <Badge variant="secondary">
                      {formData.total_submissions} submissions
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {formData.severity_breakdown.map((severity, severityIndex) => (
                      <div key={severityIndex} className={`p-4 rounded-lg ${theme.colors.card} border`}>
                        <h4 className={`font-medium ${theme.colors.text} mb-2`}>
                          {severity.severity}
                        </h4>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${theme.colors.muted}`}>Count:</span>
                            <span className={`font-semibold ${theme.colors.text}`}>
                              {severity.count}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${theme.colors.muted}`}>Avg Score:</span>
                            <span className={`font-semibold ${theme.colors.text}`}>
                              {severity.avg_score ? severity.avg_score.toFixed(1) : 'N/A'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                              style={{ 
                                width: `${(severity.count / formData.total_submissions) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <p className={`text-xs ${theme.colors.muted} text-center mt-1`}>
                            {((severity.count / formData.total_submissions) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Notice for Admins */}
      <Card className={`${theme.colors.card} border-l-4 border-l-blue-500 shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className={`font-semibold mb-2 ${theme.colors.text}`}>Privacy & Data Protection</h3>
              <p className={`text-sm ${theme.colors.muted} leading-relaxed`}>
                All assessment data is anonymized and aggregated. Individual student responses cannot be traced back to specific users, 
                ensuring complete privacy and confidentiality. This dashboard shows only statistical summaries to help understand 
                overall mental health trends in the student population.
              </p>
            </div>
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
    </div>
  );
};

export default AdminFormManagement;