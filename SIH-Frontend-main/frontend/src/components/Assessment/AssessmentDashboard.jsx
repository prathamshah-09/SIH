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
  AlertCircle,
  Calendar
} from 'lucide-react';
import AssessmentForm from './AssessmentForm';
import AssessmentResults from './AssessmentResults';
import AssessmentHistory from './AssessmentHistory';
import AdminFormManagement from './AdminFormManagement';
import AdminFormResponse from './AdminFormResponse';
import { mockForms } from '@data/mocks/forms';
import { BACKEND_ENABLED, API_BASE } from '../../lib/backendConfig';

const AssessmentDashboard = ({ userRole = 'student' }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('overview');
  const [availableForms, setAvailableForms] = useState([]);
  const [adminForms, setAdminForms] = useState([]);
  const [assessmentTab, setAssessmentTab] = useState('standard');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedFormType, setSelectedFormType] = useState(null); // 'standard' or 'admin'
  const [lastSubmission, setLastSubmission] = useState(null);

  // Initialize session and load forms
  useEffect(() => {
    initializeSession();
    loadAvailableForms();
    loadAdminForms();
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

  const loadAdminForms = () => {
    try {
      const saved = localStorage.getItem('saved_forms');
      if (saved) {
        const forms = JSON.parse(saved);
        setAdminForms(forms);
      }
    } catch (error) {
      console.error('Error loading admin forms:', error);
    }
  };

  const handleFormSubmission = (submission) => {
    setLastSubmission(submission);
    setActiveView('results');
  };

  const handleStartAssessment = (form, formType = 'standard') => {
    setSelectedForm(form);
    setSelectedFormType(formType);
    setActiveView('form');
  };

  const renderOverview = () => (
    <div className="space-y-6 w-full flex justify-center">
      <div className="w-full lg:w-[95%] space-y-6 lg:space-y-8">
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
            variant="animated"
            onClick={() => setActiveView('history')}
            title={t('viewHistory')}
          >
            <Clock className="w-4 h-4 mr-2" />
            {t('viewHistory')}
          </Button>
          {userRole === 'admin' && (
            <Button 
              size="sm"
              // className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-xl text-white transition-all duration-300 hover:scale-105"
              onClick={() => setActiveView('admin')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Forms
            </Button>
          )}
        </div>
      </div>

      {/* Anonymity Notice */}
      <Card className={`${theme.colors.card} !border-l-4 !border-l-blue-500 shadow-lg`}>
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

      {/* Tabs for Standard and Admin Assessments */}
      
      {/* Mobile Toggle for Tabs */}
      <div className="md:hidden flex gap-2 w-full mb-6">
        <Button
          onClick={() => setAssessmentTab('standard')}
          className={`flex-1 gap-2 transition-all ${
            assessmentTab === 'standard'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Standard</span>
        </Button>
        <Button
          onClick={() => setAssessmentTab('admin')}
          className={`flex-1 gap-2 transition-all ${
            assessmentTab === 'admin'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Admin</span>
        </Button>
      </div>

      <Tabs value={assessmentTab} onValueChange={setAssessmentTab} className="w-full">
        <TabsList className="hidden md:grid w-full grid-cols-2 mb-6 h-auto gap-1 sm:gap-2 p-1 sm:p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <TabsTrigger value="standard" className="flex items-center justify-center gap-1 sm:gap-2 text-[11px] xs:text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-3 md:px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded transition-all">
            <Brain className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span className="truncate font-medium">Standard</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center justify-center gap-1 sm:gap-2 text-[11px] xs:text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-3 md:px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded transition-all">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span className="truncate font-medium">Admin Forms</span>
          </TabsTrigger>
        </TabsList>

        {/* Standard Assessments Tab */}
        <TabsContent value="standard" className="space-y-6">
          {/* Mobile: compact horizontal rows */}
          <div className="md:hidden space-y-3">
            {availableForms.map((form) => (
              <div key={form.id} className={`flex items-center justify-between p-3 rounded-lg ${theme.colors.card} border`}> 
                <div className="flex-1">
                  <div className="font-semibold">{t(`${form.id}_title`) || form.title}</div>
                  <div className={`text-sm ${theme.colors.muted} hide-on-mobile`}>{t(`${form.id}_desc`)?.slice(0, 80) || form.description?.slice(0, 80)}</div>
                </div>
                <div className="ml-3">
                  <Button 
                    onClick={() => handleStartAssessment(form)} 
                    variant="animated"
                    className="text-sm px-4"
                  >
                    {t('startAssessment')}
                  </Button>
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
                    variant="animated"
                    className="w-full"
                    onClick={() => handleStartAssessment(form)}
                  >
                    {t('startAssessment')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Admin Forms Tab */}
        <TabsContent value="admin" className="space-y-6">
          {adminForms.length === 0 ? (
            <Card className={`${theme.colors.card} !border-2 !border-blue-500 shadow-lg`}>
              <CardContent className="p-8 sm:p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className={`text-lg font-semibold ${theme.colors.text} mb-2`}>
                  No Admin Forms Yet
                </h3>
                <p className={`${theme.colors.muted} text-sm`}>
                  Your instructors haven't created any custom forms yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Mobile: compact view */}
              <div className="md:hidden space-y-3">
                {adminForms.map((form) => (
                  <div key={form.id} className={`p-4 rounded-lg ${theme.colors.card} border border-gray-200`}> 
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm sm:text-base">{form.title}</div>
                        <div className={`text-xs ${theme.colors.muted} mt-1`}>
                          {form.questions?.length || 0} questions • {new Date(form.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {form.description && (
                      <p className={`text-xs sm:text-sm ${theme.colors.muted} mb-3`}>
                        {form.description}
                      </p>
                    )}
                    <Button 
                      variant="animated"
                      className="w-full"
                      onClick={() => handleStartAssessment(form, 'admin')}
                    >
                      Take Form
                    </Button>
                  </div>
                ))}
              </div>

              {/* Desktop / tablet cards - 3 column grid */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminForms.map((form) => (
                  <Card 
                    key={form.id}
                    className={`${theme.colors.card} border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group`}
                  >
                    {/* <div className={`h-2 bg-gradient-to-r from-purple-500 to-pink-600`} /> */}
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className={`text-lg ${theme.colors.text} group-hover:text-purple-600 transition-colors truncate`}>
                            {form.title}
                          </CardTitle>
                          <p className={`text-xs ${theme.colors.muted} mt-2 flex items-center gap-1`}>
                            <Calendar className="w-3 h-3" />
                            {new Date(form.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Badge className="bg-purple-100 text-purple-800 text-xs font-semibold">
                          {form.questions?.length || 0} Questions
                        </Badge>
                      </div>
                      {form.description && (
                        <p className={`text-sm ${theme.colors.muted} line-clamp-2`}>
                          {form.description}
                        </p>
                      )}
                      <Button 
                        variant="animated"
                        onClick={() => handleStartAssessment(form, 'admin')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Take Form
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

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
        <Card className={`${theme.colors.card} shadow-lg !border-2 !border-blue-500`}>
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

        <Card className={`${theme.colors.card} shadow-lg !border-2 !border-blue-500`}>
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
        return selectedFormType === 'admin' ? (
          <AdminFormResponse 
            form={selectedForm}
            onSubmission={handleFormSubmission}
            onBack={() => setActiveView('overview')}
          />
        ) : (
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