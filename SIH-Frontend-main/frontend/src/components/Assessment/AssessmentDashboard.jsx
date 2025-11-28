import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  Brain, 
  Heart,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Users,
  Settings,
  AlertCircle
} from 'lucide-react';
import AssessmentForm from './AssessmentForm';
import AssessmentResults from './AssessmentResults';
import AssessmentHistory from './AssessmentHistory';
import AdminFormManagement from './AdminFormManagement';
import { mockForms } from '../../mock/mockData';
import { BACKEND_ENABLED, API_BASE } from '../../lib/backendConfig';

const AssessmentDashboard = ({ userRole = 'student' }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('overview');
  const [availableForms, setAvailableForms] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [lastSubmission, setLastSubmission] = useState(null);

  // Initialize session and load forms
  useEffect(() => {
    initializeSession();
    loadAvailableForms();
  }, []);

  const initializeSession = async () => {
    try {
      // Check if we have an existing session
      const existingSession = null; // removed localStorage usage
      if (!BACKEND_ENABLED) {
        // frontend-only: create ephemeral session id (not persisted)
        const sid = `sess_${Date.now()}`;
        setSessionId(sid);
        return;
      }

      const response = await fetch(`${API_BASE}/api/assessment/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: existingSession
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.session_id);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const loadAvailableForms = async () => {
    try {
      if (!BACKEND_ENABLED) {
        setAvailableForms(mockForms);
        return;
      }

      const response = await fetch(`${API_BASE}/api/assessment/forms`);
      if (response.ok) {
        const forms = await response.json();
        setAvailableForms(forms);
      }
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmission = (submission) => {
    setLastSubmission(submission);
    setActiveView('results');
  };

  const handleStartAssessment = (form) => {
    setSelectedForm(form);
    setActiveView('form');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className={`text-2xl sm:text-3xl font-bold ${theme.colors.text} flex items-center whitespace-nowrap`}>
            {t('mentalHealthAssessments')}
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 ml-2 sm:ml-3 text-cyan-500" />
          </h2>
          <p className={`${theme.colors.muted} mt-1 text-xs sm:text-sm`}>
            {t('assessmentsDescription')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            size="sm"
            className="flex-1 sm:flex-none bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg text-white transition-all duration-300 hover:scale-105"
            onClick={() => setActiveView('history')}
            title={t('viewHistory')}
          >
            <Clock className="w-4 h-4 mr-2" />
            {t('viewHistory')}
          </Button>
          {userRole === 'admin' && (
            <Button 
              size="sm"
              className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-xl text-white transition-all duration-300 hover:scale-105"
              onClick={() => setActiveView('admin')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Forms
            </Button>
          )}
        </div>
      </div>

      {/* Anonymity Notice */}
      <Card className={`${theme.colors.card} border-l-4 border-l-green-500 shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className={`font-semibold ${theme.colors.text}`}>{t('anonymousConfidential')}</h3>
              <p className={`text-sm ${theme.colors.muted} mt-1`}>
                {t('anonymousConfidentialDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Forms */}
      {/* Mobile: compact horizontal rows (only on small phones) */}
      <div className="md:hidden space-y-3">
        {availableForms.map((form) => (
          <div key={form.id} className={`flex items-center justify-between p-3 rounded-lg ${theme.colors.card} border`}> 
            <div className="flex-1">
              <div className="font-semibold">{t(`${form.id}_title`) || form.title}</div>
              <div className={`text-sm ${theme.colors.muted} hide-on-mobile`}>{t(`${form.id}_desc`)?.slice(0, 80) || form.description?.slice(0, 80)}</div>
            </div>
            <div className="ml-3">
              <button onClick={() => handleStartAssessment(form)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-2 rounded-md text-sm">
                {t('startAssessment')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / tablet cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableForms.map((form) => (
          <Card 
            key={form.id}
            className={`${theme.colors.card} hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 border-0 group`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-xl ${theme.colors.text} group-hover:text-cyan-600 transition-colors`}>
                  {t(`${form.id}_title`) || form.title}
                </CardTitle>
                <div className={`p-3 rounded-full ${getFormIconBackground(form.name)}`}>
                  {getFormIcon(form.name)}
                </div>
              </div>
              <CardDescription className={`${theme.colors.muted} text-sm leading-relaxed`}>
                {t(`${form.id}_desc`) || form.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="text-xs">
                  {t(`${form.id}_questions`) || `${form.questions?.length || 0} questions`}
                </Badge>
                <span className={`text-xs ${theme.colors.muted}`}>
                  {t(`${form.id}_time`) || `~${Math.ceil((form.questions?.length || 0) * 0.5)} min`}
                </span>
              </div>
                <Button 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg transition-all duration-300"
                onClick={() => handleStartAssessment(form)}
              >
                {t('startAssessment')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {(userRole === 'admin' || userRole === 'counsellor') && (
          <Card 
            className={`${theme.colors.card} hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group`}
            onClick={() => setActiveView('analytics')}
          >
            <CardContent className="p-4 sm:p-6 text-center">
              <BarChart3 className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
              <h3 className={`font-bold text-base sm:text-lg ${theme.colors.text} group-hover:text-purple-600 transition-colors`}>
                Analytics
              </h3>
              <p className={`text-xs sm:text-sm ${theme.colors.muted} mt-2`}>
                View aggregate data and mental health trends
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`${theme.colors.card} shadow-lg`}>
            <CardHeader>
            <CardTitle className={`flex items-center ${theme.colors.text}`}>
              <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
              {t('aboutAssessmentsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p className={theme.colors.muted}>
                {t('phq9_info')}
              </p>
              <p className={theme.colors.muted}>
                {t('gad7_info')}
              </p>
              <p className={theme.colors.muted}>
                {t('ghq28_info')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} shadow-lg`}>
            <CardHeader>
            <CardTitle className={`flex items-center ${theme.colors.text}`}>
              <Users className="w-5 h-5 mr-2 text-green-500" />
              {t('howItWorks')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className={theme.colors.muted}>{t('howItWorksPoint1')}</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className={theme.colors.muted}>{t('howItWorksPoint2')}</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className={theme.colors.muted}>{t('howItWorksPoint3')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getFormIcon = (formName) => {
    switch (formName) {
      case 'PHQ-9':
        return <Activity className="w-6 h-6 text-blue-600" />;
      case 'GAD-7':
        return <Brain className="w-6 h-6 text-purple-600" />;
      case 'GHQ-28':
        return <Heart className="w-6 h-6 text-green-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getFormIconBackground = (formName) => {
    switch (formName) {
      case 'PHQ-9':
        return 'bg-blue-100';
      case 'GAD-7':
        return 'bg-purple-100';
      case 'GHQ-28':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
        </div>
      );
    }

    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'form':
        return (
          <AssessmentForm 
            form={selectedForm}
            sessionId={sessionId}
            onSubmission={handleFormSubmission}
            onBack={() => setActiveView('overview')}
          />
        );
      case 'results':
        return (
          <AssessmentResults 
            submission={lastSubmission}
            onBack={() => setActiveView('overview')}
            onViewHistory={() => setActiveView('history')}
          />
        );
      case 'history':
        return (
          <AssessmentHistory 
            sessionId={sessionId}
            onBack={() => setActiveView('overview')}
          />
        );
      case 'admin':
        return (
          <AdminFormManagement 
            onBack={() => setActiveView('overview')}
          />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default AssessmentDashboard;