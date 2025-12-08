import React, { useState, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { useToast } from '../../hooks/use-toast';
import {
  Plus,
  Trash2,
  Eye,
  Edit2,
  Save,
  X,
  FileText,
  Calendar,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const FormManagement = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [savedForms, setSavedForms] = useState([]);
  const [viewingForm, setViewingForm] = useState(null);
  const [expandedForms, setExpandedForms] = useState({});

  const { theme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Demo forms
  const demoForms = [
    {
      id: 1,
      title: 'Weekly Wellness Check-in',
      description: 'A comprehensive wellness assessment to monitor student mental health and stress levels.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      responses: 45,
      createdBy: 'admin@college.edu',
      status: 'active',
      questions: [
        {
          id: 101,
          text: 'How would you rate your overall stress level this week?',
          type: 'MCQ',
          options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
          required: true,
          order: 1,
        },
        {
          id: 102,
          text: 'Which areas are affecting your wellbeing? (Select all that apply)',
          type: 'Multiple Select',
          options: ['Academic Pressure', 'Social Issues', 'Financial Concerns', 'Health Problems', 'Family Matters'],
          required: true,
          order: 2,
        },
        {
          id: 103,
          text: 'What support do you need most right now?',
          type: 'Text Input',
          options: [],
          required: false,
          order: 3,
        },
      ],
    },
    {
      id: 2,
      title: 'Mental Health Assessment',
      description: 'Identify early signs and risk factors for mental health concerns.',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      responses: 38,
      createdBy: 'admin@college.edu',
      status: 'active',
      questions: [
        {
          id: 201,
          text: 'Have you experienced sleep disturbances recently?',
          type: 'MCQ',
          options: ['Not at all', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
          required: true,
          order: 1,
        },
        {
          id: 202,
          text: 'How often do you engage in physical activity?',
          type: 'MCQ',
          options: ['Daily', '3-4 times/week', '1-2 times/week', 'Rarely', 'Never'],
          required: true,
          order: 2,
        },
        {
          id: 203,
          text: 'Do you have access to counseling services?',
          type: 'MCQ',
          options: ['Yes, regularly', 'Yes, occasionally', 'I am aware but never used', 'No access', 'Not sure'],
          required: true,
          order: 3,
        },
      ],
    },
    {
      id: 3,
      title: 'Academic Performance & Burnout',
      description: 'Assess academic stress and potential burnout symptoms among students.',
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      responses: 52,
      createdBy: 'admin@college.edu',
      status: 'active',
      questions: [
        {
          id: 301,
          text: 'What is your current GPA range?',
          type: 'MCQ',
          options: ['4.0', '3.5-3.99', '3.0-3.49', '2.5-2.99', 'Below 2.5'],
          required: true,
          order: 1,
        },
        {
          id: 302,
          text: 'How many hours do you study per week?',
          type: 'Text Input',
          options: [],
          required: true,
          order: 2,
        },
        {
          id: 303,
          text: 'Select factors contributing to academic pressure',
          type: 'Multiple Select',
          options: ['Heavy Coursework', 'Exams', 'Assignments', 'Time Management', 'Competition'],
          required: true,
          order: 3,
        },
      ],
    },
  ];

  // Demo form submissions for testing
  const demoSubmissions = [
    {
      id: 1001,
      formId: 1,
      studentId: 'student_001',
      studentName: 'Raj Kumar',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      responses: {
        101: 'High',
        102: ['Academic Pressure', 'Financial Concerns'],
        103: 'Need financial aid and stress management guidance'
      }
    },
    {
      id: 1002,
      formId: 1,
      studentId: 'student_002',
      studentName: 'Priya Singh',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      responses: {
        101: 'Moderate',
        102: ['Academic Pressure', 'Social Issues'],
        103: 'Need help with time management'
      }
    },
    {
      id: 1003,
      formId: 2,
      studentId: 'student_003',
      studentName: 'Arjun Patel',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      responses: {
        201: 'Often',
        202: '1-2 times/week',
        203: 'Yes, occasionally'
      }
    },
    {
      id: 1004,
      formId: 3,
      studentId: 'student_004',
      studentName: 'Sneha Desai',
      submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      responses: {
        301: '3.8-3.99',
        302: '25',
        303: ['Heavy Coursework', 'Exams', 'Competition']
      }
    },
  ];

  // Load saved forms from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('saved_forms');
    const savedSubmissions = localStorage.getItem('form_submissions');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedForms(parsed);
      } catch (e) {
        setSavedForms(demoForms);
        localStorage.setItem('saved_forms', JSON.stringify(demoForms));
      }
    } else {
      // Initialize with demo forms if no saved forms exist
      setSavedForms(demoForms);
      localStorage.setItem('saved_forms', JSON.stringify(demoForms));
    }

    // Initialize submissions if they don't exist
    if (!savedSubmissions) {
      localStorage.setItem('form_submissions', JSON.stringify(demoSubmissions));
    }
  }, []);

  // Add new question
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      text: '',
      type: 'MCQ',
      options: ['', ''],
      required: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  // Update question
  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  // Update question option
  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  // Add option to question
  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    );
  };

  // Remove option from question
  const removeOption = (questionId, optionIndex) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((_, i) => i !== optionIndex),
          };
        }
        return q;
      })
    );
  };

  // Delete question
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
    toast({
      title: 'Question Deleted',
      description: 'Question has been removed from the form.',
    });
  };

  // Save form
  const saveForm = () => {
    if (!formTitle.trim()) {
      toast({
        title: 'Title Required',
        description: 'Please enter a form title.',
        variant: 'destructive',
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: 'Add Questions',
        description: 'Please add at least one question to the form.',
        variant: 'destructive',
      });
      return;
    }

    // Validate all questions have text
    if (questions.some((q) => !q.text.trim())) {
      toast({
        title: 'Invalid Questions',
        description: 'All questions must have text.',
        variant: 'destructive',
      });
      return;
    }

    const newForm = {
      id: Date.now(),
      title: formTitle,
      description: formDescription,
      questions: questions,
      createdAt: new Date().toISOString(),
      responses: 0,
    };

    const updated = [...savedForms, newForm];
    setSavedForms(updated);
    localStorage.setItem('saved_forms', JSON.stringify(updated));

    toast({
      title: 'Form Saved!',
      description: 'Your form has been saved successfully.',
      className: 'animate-celebration',
    });

    // Reset form
    setFormTitle('');
    setFormDescription('');
    setQuestions([]);
    setShowPreview(false);
  };

  // Delete saved form
  const deleteForm = (id) => {
    const updated = savedForms.filter((f) => f.id !== id);
    setSavedForms(updated);
    localStorage.setItem('saved_forms', JSON.stringify(updated));
    setViewingForm(null);
    toast({
      title: 'Form Deleted',
      description: 'The form has been permanently deleted.',
    });
  };

  // Duplicate form
  const duplicateForm = (form) => {
    const duplicated = {
      ...form,
      id: Date.now(),
      title: `${form.title} (Copy)`,
      createdAt: new Date().toISOString(),
      responses: 0,
    };
    const updated = [...savedForms, duplicated];
    setSavedForms(updated);
    localStorage.setItem('saved_forms', JSON.stringify(updated));
    toast({
      title: 'Form Duplicated',
      description: 'The form has been duplicated successfully.',
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full lg:w-[95%] space-y-6 lg:space-y-8 px-2 sm:px-3 md:px-4 lg:px-0">
        {/* Mobile Toggle for Tabs */}
        <div className="md:hidden flex gap-2 w-full">
          <Button
            onClick={() => setActiveTab('create')}
            className={`flex-1 gap-2 transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Create</span>
          </Button>
          <Button
            onClick={() => setActiveTab('history')}
            className={`flex-1 gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>History</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`hidden md:grid w-full grid-cols-2 mb-6 gap-1 sm:gap-2 h-auto p-1 sm:p-2 rounded-lg ${
            theme.currentTheme === 'midnight' ? 'bg-slate-800' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <TabsTrigger value="create" className="flex items-center justify-center gap-1 sm:gap-2 text-[11px] xs:text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-3 md:px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded transition-all">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="truncate font-medium">{t('createForm')}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center justify-center gap-1 sm:gap-2 text-[11px] xs:text-xs sm:text-sm md:text-base py-2 sm:py-3 px-2 sm:px-3 md:px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded transition-all">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="truncate font-medium">{t('formHistory')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Create Form Tab */}
          <TabsContent value="create" className="space-y-6">
            {!showPreview ? (
              <Card className={`${theme.colors.card} border-0 shadow-xl`}>
                <CardHeader className={`bg-gradient-to-r ${theme.colors.primary} rounded-t-lg py-4 sm:py-5 lg:py-6 px-4 sm:px-5 lg:px-6`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 bg-gradient-to-r ${theme.colors.accent} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <FileText className="w-6 h-6 sm:w-6.5 sm:h-6.5 lg:w-7 lg:h-7 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme.colors.cardText}`}>
                        {t('createNewForm')}
                      </CardTitle>
                      <p className={`text-xs sm:text-sm ${theme.colors.muted} mt-1`}>
                        {t('designWellnessForms')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 lg:p-8 space-y-5 lg:space-y-6">
                  {/* Form Title */}
                  <div className="space-y-2">
                    <label className={`text-sm sm:text-base font-semibold ${theme.colors.text}`}>
                      {t('formTitle')}
                    </label>
                    <Input
                      placeholder={t('formTitlePlaceholder')}
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      maxLength={100}
                      className={`text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 rounded-lg ${theme.colors.card}`}
                    />
                    <p className={`text-xs sm:text-sm ${theme.colors.muted}`}>
                      {formTitle.length}/100 {t('characters')}
                    </p>
                  </div>

                  {/* Form Description */}
                  <div className="space-y-2">
                    <label className={`text-sm sm:text-base font-semibold ${theme.colors.text}`}>
                      {t('descriptionOptional')}
                    </label>
                    <Textarea
                      placeholder={t('descriptionPlaceholder')}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      maxLength={300}
                      rows={2}
                      className={`text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 resize-none rounded-lg ${theme.colors.card}`}
                    />
                    <p className={`text-xs sm:text-sm ${theme.colors.muted}`}>
                      {formDescription.length}/300 {t('characters')}
                    </p>
                  </div>

                  <Separator />

                  {/* Questions Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-base sm:text-lg font-semibold ${theme.colors.text}`}>
                        {t('questions')} ({questions.length})
                      </h3>
                      <Button
                        onClick={addQuestion}
                        className={`bg-gradient-to-r ${theme.colors.primary} text-white hover:shadow-lg font-semibold py-2 px-4 text-sm rounded-lg hover:scale-105 transition-all duration-200`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('addQuestion')}
                      </Button>
                    </div>

                    {questions.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg border-2 border-dashed ${theme.colors.muted}`}>
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className={`${theme.colors.muted} text-sm`}>
                          {t('noQuestionsAdded')}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <Card key={question.id} className={`${theme.colors.card} border-2 border-gray-200`}>
                            <CardContent className="p-4 sm:p-5 space-y-4">
                              {/* Question Text */}
                              <div className="space-y-2">
                                <label className={`text-sm font-semibold ${theme.colors.text}`}>
                                  Question {index + 1}
                                </label>
                                <Input
                                  placeholder="Enter your question..."
                                  value={question.text}
                                  onChange={(e) =>
                                    updateQuestion(question.id, 'text', e.target.value)
                                  }
                                  maxLength={200}
                                  className={`text-sm py-2.5 px-3 border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 rounded-lg ${theme.colors.card}`}
                                />
                                <p className={`text-xs ${theme.colors.muted}`}>
                                  {question.text.length}/200
                                </p>
                              </div>

                              {/* Question Type */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <label className={`text-sm font-semibold ${theme.colors.text}`}>
                                    Answer Type
                                  </label>
                                  <Select
                                    value={question.type}
                                    onValueChange={(value) =>
                                      updateQuestion(question.id, 'type', value)
                                    }
                                  >
                                    <SelectTrigger className={`${theme.colors.card}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="MCQ">MCQ (Single Choice)</SelectItem>
                                      <SelectItem value="multiple">Multiple Select</SelectItem>
                                      <SelectItem value="text">Text Input</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <label className={`text-sm font-semibold ${theme.colors.text}`}>
                                    Required
                                  </label>
                                  <Select
                                    value={question.required ? 'yes' : 'no'}
                                    onValueChange={(value) =>
                                      updateQuestion(question.id, 'required', value === 'yes')
                                    }
                                  >
                                    <SelectTrigger className={`${theme.colors.card}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Options (for MCQ and Multiple Select) */}
                              {(question.type === 'MCQ' || question.type === 'multiple') && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <label className={`text-sm font-semibold ${theme.colors.text}`}>
                                      Answer Options
                                    </label>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => addOption(question.id)}
                                      className="text-xs"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Option
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    {question.options.map((option, optIdx) => (
                                      <div key={optIdx} className="flex items-center gap-2">
                                        <Input
                                          placeholder={`Option ${optIdx + 1}`}
                                          value={option}
                                          onChange={(e) =>
                                            updateOption(question.id, optIdx, e.target.value)
                                          }
                                          maxLength={100}
                                          className={`text-sm py-2 px-3 border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 rounded-lg flex-1 ${theme.colors.card}`}
                                        />
                                        {question.options.length > 2 && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                              removeOption(question.id, optIdx)
                                            }
                                            className="text-red-600 hover:bg-red-50"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Delete Question */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteQuestion(question.id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete Question
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    {questions.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        className="text-sm sm:text-base py-2.5 sm:py-3"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    )}
                    <Button
                      onClick={saveForm}
                      disabled={!formTitle.trim() || questions.length === 0}
                      className={`bg-gradient-to-r ${theme.colors.primary} text-white hover:shadow-lg font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base hover:scale-105 transition-all duration-200 rounded-lg disabled:opacity-50`}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {t('saveForm')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <FormPreview
                form={{ title: formTitle, description: formDescription, questions }}
                onBack={() => setShowPreview(false)}
                theme={theme}
              />
            )}
          </TabsContent>

          {/* Form History Tab */}
          <TabsContent value="history" className="space-y-6 w-full">
            {viewingForm ? (
              <FormDetails
                form={viewingForm}
                onBack={() => setViewingForm(null)}
                onDelete={deleteForm}
                theme={theme}
              />
            ) : (
              <div className="space-y-4 w-full">
                {savedForms.length === 0 ? (
                  <Card className={`${theme.colors.card} border-0 shadow-xl`}>
                    <CardContent className="p-8 sm:p-12 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className={`text-lg font-semibold ${theme.colors.text} mb-2`}>
                        No Forms Created Yet
                      </h3>
                      <p className={`${theme.colors.muted} text-sm mb-6`}>
                        Create your first form to track student wellness and insights.
                      </p>
                      <Button
                        onClick={() => setActiveTab('create')}
                        className={`bg-gradient-to-r ${theme.colors.primary} text-white hover:shadow-lg font-semibold px-6 py-2.5`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Form
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
                    {savedForms.map((form) => (
                      <Card
                        key={form.id}
                        className={`${theme.colors.card} border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group h-full`}
                      >
                        <div className={`h-2 bg-gradient-to-r ${theme.colors.primary}`} />
                        <CardContent className="p-4 sm:p-5 space-y-4 h-full flex flex-col">
                          {/* Header with badges */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-bold text-sm sm:text-base lg:text-lg ${theme.colors.text} truncate group-hover:text-cyan-500 transition-colors`}>
                                {form.title}
                              </h3>
                              <p className={`text-xs ${theme.colors.muted} mt-1 flex items-center gap-1`}>
                                <Calendar className="w-3 h-3" />
                                {formatDate(form.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Badges row */}
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-blue-100 text-blue-800 text-xs font-semibold">
                              {form.questions.length} Questions
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 text-xs font-semibold">
                              {form.responses} Responses
                            </Badge>
                          </div>

                          {/* Description */}
                          {form.description && (
                            <p className={`text-xs sm:text-sm ${theme.colors.muted} line-clamp-2 leading-relaxed`}>
                              {form.description}
                            </p>
                          )}

                          <Separator className="my-2" />

                          {/* Action buttons - Stacked on mobile, row on larger screens */}
                          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 mt-auto">
                            <Button
                              size="sm"
                              onClick={() => setViewingForm(form)}
                              className={`w-full sm:flex-1 bg-gradient-to-r ${theme.colors.primary} text-white hover:shadow-lg font-semibold py-2 text-xs sm:text-sm rounded-lg hover:scale-105 transition-all duration-200`}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => duplicateForm(form)}
                              className="w-full sm:flex-1 text-xs sm:text-sm hover:bg-cyan-50"
                              title="Duplicate this form"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Duplicate
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteForm(form.id)}
                              className="w-full sm:w-auto text-red-600 hover:bg-red-50"
                              title="Delete this form"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Form Preview Component
const FormPreview = ({ form, onBack, theme }) => {
  return (
    <Card className={`${theme.colors.card} border-0 shadow-xl`}>
      <CardHeader className={`bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg py-4 sm:py-5 lg:py-6 px-4 sm:px-5 lg:px-6`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`text-lg sm:text-xl lg:text-2xl font-bold text-white`}>
              {form.title}
            </CardTitle>
            {form.description && (
              <p className="text-sm text-indigo-100 mt-1">{form.description}</p>
            )}
          </div>
          <Badge className="bg-white text-indigo-600">Preview</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 lg:p-8 space-y-6">
        {form.questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <label className={`text-sm sm:text-base font-semibold ${theme.colors.text}`}>
              {index + 1}. {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {question.type === 'MCQ' && (
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      disabled
                      className="w-4 h-4"
                    />
                    <span className={`text-sm ${theme.colors.muted}`}>{option}</span>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'multiple' && (
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={`q-${question.id}-${idx}`}
                      disabled
                      className="w-4 h-4"
                    />
                    <span className={`text-sm ${theme.colors.muted}`}>{option}</span>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <input
                type="text"
                placeholder="Text response"
                disabled
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm opacity-50`}
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-3 justify-end pt-6">
          <Button onClick={onBack} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Back to Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Form Details Component
const FormDetails = ({ form, onBack, onDelete, theme }) => {
  return (
    <Card className={`${theme.colors.card} border-0 shadow-xl`}>
      <CardHeader className={`bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg py-4 sm:py-5 lg:py-6 px-4 sm:px-5 lg:px-6`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`text-lg sm:text-xl lg:text-2xl font-bold text-white`}>
              {form.title}
            </CardTitle>
            <p className="text-sm text-indigo-100 mt-1">
              Created: {new Date(form.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge className="bg-white text-indigo-600">{form.questions.length} Questions</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 lg:p-8 space-y-6">
        {form.description && (
          <div>
            <h4 className={`text-sm font-semibold ${theme.colors.text} mb-2`}>Description</h4>
            <p className={`text-sm ${theme.colors.muted}`}>{form.description}</p>
          </div>
        )}

        <Separator />

        <div>
          <h3 className={`text-base sm:text-lg font-semibold ${theme.colors.text} mb-4`}>
            Questions
          </h3>
          <div className="space-y-4">
            {form.questions.map((question, index) => (
              <div key={question.id} className={`p-3 sm:p-4 rounded-lg border-2 border-gray-200`}>
                <div className="flex items-start justify-between mb-2">
                  <h5 className={`text-sm sm:text-base font-semibold ${theme.colors.text}`}>
                    Q{index + 1}: {question.text}
                  </h5>
                  <div className="flex gap-2">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {question.type}
                    </Badge>
                    {question.required && (
                      <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>
                    )}
                  </div>
                </div>

                {(question.type === 'MCQ' || question.type === 'multiple') && (
                  <div className="mt-2 space-y-1">
                    {question.options.map((option, idx) => (
                      <p key={idx} className={`text-xs sm:text-sm ${theme.colors.muted} ml-4`}>
                        • {option}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end pt-6">
          <Button onClick={onBack} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this form?')) {
                onDelete(form.id);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Form
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormManagement;