import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  AlertTriangle,
  Send,
  Clock,
  Shield,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';
import { BACKEND_ENABLED, API_BASE } from '../../lib/backendConfig';
import { generateAssessmentResponse } from '../../lib/geminiAPI';
import { submitAssessment } from '@services/assessmentService';

const AssessmentForm = ({ form, sessionId, onSubmission, onBack }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!form) {
    return (
      <div className="text-center py-12">
        <p className={theme.colors.muted}>No form selected.</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / form.questions.length) * 100;
  const isLastQuestion = currentQuestion === form.questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const hasAnswered = responses[form.questions[currentQuestion]?.id] !== undefined;
  const allQuestionsAnswered = form.questions.every(q => responses[q.id] !== undefined);

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (!hasAnswered) {
      toast.error('Please select an answer before continuing');
      return;
    }
    
    if (isLastQuestion) {
      setShowConfirmation(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      onBack();
    } else {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert responses to backend format (q1, q2, etc. with numeric values)
      const formattedResponses = {};
      form.questions.forEach((question) => {
        formattedResponses[question.id] = responses[question.id];
      });

      // Calculate score immediately for instant feedback
      const totalScore = Object.values(formattedResponses).reduce((sum, val) => sum + Number(val), 0);
      
      // Calculate severity based on form type and score
      const calculateSeverity = (formName, score) => {
        if (formName === 'PHQ-9') {
          if (score <= 4) return 'Minimal';
          if (score <= 9) return 'Mild';
          if (score <= 14) return 'Moderate';
          if (score <= 19) return 'Moderately Severe';
          return 'Severe';
        }
        if (formName === 'GAD-7') {
          if (score <= 4) return 'Minimal';
          if (score <= 9) return 'Mild';
          if (score <= 14) return 'Moderate';
          return 'Severe';
        }
        if (formName === 'GHQ-12') {
          if (score <= 11) return 'Minimal';
          if (score <= 15) return 'Mild';
          if (score <= 20) return 'Moderate';
          return 'Severe';
        }
        return 'Normal';
      };

      const severityLevel = calculateSeverity(form.name, totalScore);
      
      // Create immediate submission with calculated values
      const immediateSubmission = {
        id: `temp_${Date.now()}`,
        form_id: form.id,
        form_name: form.name,
        total_score: totalScore,
        severity_level: severityLevel,
        submitted_at: new Date().toISOString(),
        responses: formattedResponses,
        isLoading: true // Flag to indicate guidance is still loading
      };

      // Show results immediately
      toast.success('Assessment submitted! Generating guidance...');
      onSubmission(immediateSubmission);

      // Submit to backend in background and update with full data
      submitAssessment(form.name, formattedResponses)
        .then(result => {
          // Update with full backend response including guidance
          const fullSubmission = {
            id: result.id,
            form_id: form.id,
            form_name: form.name,
            total_score: result.score,
            severity_level: result.severityLevel,
            submitted_at: result.createdAt,
            responses: formattedResponses,
            guidance: result.guidance,
            recommendations: result.recommendedActions,
            isLoading: false
          };
          onSubmission(fullSubmission);
        })
        .catch(error => {
          console.error('Error fetching guidance:', error);
          // Keep showing basic results even if guidance fails
        });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      const errorMessage = error.message || 'Failed to submit assessment. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestionData = form.questions[currentQuestion];

  const renderConfirmation = () => (
    <Card className={`${theme.colors.card} max-w-2xl mx-auto shadow-2xl !border-2 !border-blue-500`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <CardTitle className={`text-2xl ${theme.colors.text}`}>Ready to Submit?</CardTitle>
        <CardDescription className={theme.colors.muted}>
          You&apos;ve answered all {form.questions.length} questions. Review your submission below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className={`p-4 rounded-lg ${theme.colors.secondary}`}>
          <h3 className={`font-semibold mb-2 ${theme.colors.text}`}>Assessment Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={theme.colors.muted}>Form:</span>
              <p className={`font-medium ${theme.colors.text}`}>{form.title}</p>
            </div>
            <div>
              <span className={theme.colors.muted}>Questions Answered:</span>
              <p className={`font-medium ${theme.colors.text}`}>{Object.keys(responses).length} / {form.questions.length}</p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900">Your Privacy is Protected</h4>
            <p className="text-sm text-green-700 mt-1">
              This assessment is completely anonymous. Your responses will not be linked to your identity.
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setShowConfirmation(false)}
            className="flex-1"
          >
            Review Answers
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="animated"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </div>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Assessment
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (showConfirmation) {
    return renderConfirmation();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`${theme.colors.card} shadow-lg`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-2xl ${theme.colors.text}`}>{form.title}</CardTitle>
              <CardDescription className={theme.colors.muted}>
                Question {currentQuestion + 1} of {form.questions.length}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                {Math.ceil((form.questions.length - currentQuestion) * 0.5)} min remaining
              </Badge>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Take your time</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${theme.colors.muted}`}>Progress</span>
              <span className={`text-sm font-medium ${theme.colors.text}`}>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className={`${theme.colors.card} shadow-xl hover:shadow-2xl transition-shadow duration-300 !border-2 !border-blue-500`}>
        <CardContent className="p-8">
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 ${theme.colors.text} leading-relaxed`}>
              {currentQuestionData.text}
            </h2>
            
            {/* Instructions based on question type */}
            <div className="flex items-start space-x-2 mb-6 p-3 bg-blue-50 border-l-4 border-l-blue-500 rounded-r-lg">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                {currentQuestionData.type === 'likert' 
                  ? 'Over the last 2 weeks, how often have you been bothered by the following problem?'
                  : 'Compared to your usual state, how have you been recently?'
                }
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestionData.type === 'likert' && (
              currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(currentQuestionData.id, option.value)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                    responses[currentQuestionData.id] === option.value
                      ? `border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-lg ${theme.currentTheme === 'midnight' ? 'text-black' : ''}`
                      : `border-gray-200 hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-25 hover:to-blue-25 ${theme.colors.card}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${responses[currentQuestionData.id] === option.value && theme.currentTheme === 'midnight' ? 'text-black' : theme.colors.text}`}>
                      {option.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      responses[currentQuestionData.id] === option.value
                        ? 'border-cyan-500 bg-cyan-500'
                        : 'border-gray-300'
                    }`}>
                      {responses[currentQuestionData.id] === option.value && (
                        <CheckCircle className="w-3 h-3 text-white m-0.5" />
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}

            {currentQuestionData.type === 'text' && (
              <div>
                <label className={`block text-sm mb-2 ${theme.colors.muted}`}>Your Answer</label>
                {(() => {
                  const text = currentQuestionData.text.toLowerCase();
                  const isTime = text.includes('when have you usually gone to bed') || text.includes('when have you usually gotten up');
                  const isMinutes = text.includes('how long') && text.includes('minutes');
                  const isHours = text.includes('how many hours');
                  const inputClass = 'w-full p-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500';
                  if (isTime) {
                    return (
                      <input
                        type="time"
                        className={inputClass}
                        value={responses[currentQuestionData.id] || ''}
                        onChange={(e) => handleResponse(currentQuestionData.id, e.target.value)}
                      />
                    );
                  }
                  if (isMinutes || isHours) {
                    return (
                      <input
                        type="number"
                        min={0}
                        max={isHours ? 24 : 600}
                        placeholder={isHours ? 'Hours' : 'Minutes'}
                        className={inputClass}
                        value={responses[currentQuestionData.id] ?? ''}
                        onChange={(e) => handleResponse(currentQuestionData.id, e.target.value === '' ? undefined : Number(e.target.value))}
                      />
                    );
                  }
                  return (
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Type your answer"
                      value={responses[currentQuestionData.id] || ''}
                      onChange={(e) => handleResponse(currentQuestionData.id, e.target.value)}
                    />
                  );
                })()}
                <p className="text-xs text-gray-400 mt-2">Press Enter to continue</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isFirstQuestion ? 'Back to Overview' : 'Previous'}
        </Button>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{currentQuestion + 1}</span>
          <span>/</span>
          <span>{form.questions.length}</span>
        </div>
        
        <Button 
          onClick={handleNext}
          disabled={!hasAnswered}
          className={`flex items-center ${hasAnswered 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg' 
            : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? 'Review & Submit' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Footer Tips */}
      <Card className={`${theme.colors.card} shadow-sm`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Your responses are anonymous and confidential. Answer honestly for the most accurate results.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentForm;