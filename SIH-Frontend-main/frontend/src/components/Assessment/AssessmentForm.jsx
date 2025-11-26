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
      // use central backend toggle
      if (!BACKEND_ENABLED) {
        // frontend-only: calculate score, severity, guidance (ephemeral – no localStorage persistence)
        const totalScore = Object.values(responses).reduce((s, v) => s + Number(v), 0);
        const submitted_at = new Date().toISOString();
        const submission = {
          id: `sub_${Date.now()}`,
          session_id: sessionId,
          form_id: form.id,
          form_name: form.name,
          responses,
          total_score: totalScore,
          submitted_at,
        };

        // compute severity and recommendation
        const computeSeverity = (formName, score) => {
          if (formName === 'PHQ-9') {
            if (score >= 20) return 'Severe';
            if (score >= 15) return 'Moderately Severe';
            if (score >= 10) return 'Moderate';
            if (score >= 5) return 'Mild';
            return 'Minimal';
          }
          if (formName === 'GAD-7') {
            if (score >= 15) return 'Severe';
            if (score >= 10) return 'Moderate';
            if (score >= 5) return 'Mild';
            return 'Minimal';
          }
          if (formName === 'GHQ-12') {
            if (score >= 24) return 'Severe Distress';
            if (score >= 18) return 'Moderate Distress';
            if (score >= 12) return 'Mild Distress';
            return 'Normal';
          }
          if (formName === 'BDI-II') {
            if (score >= 29) return 'Severe';
            if (score >= 20) return 'Moderate';
            if (score >= 14) return 'Mild';
            return 'Minimal';
          }
          if (formName === 'PHQ-2') {
            if (score >= 3) return 'Moderate';
            return 'Minimal';
          }
          if (formName === 'GAD-2') {
            if (score >= 3) return 'Moderate';
            return 'Minimal';
          }
          if (formName === 'MMSE') {
            if (score <= 16) return 'Severe Cognitive Impairment';
            if (score <= 20) return 'Moderate Cognitive Impairment';
            if (score <= 24) return 'Mild Cognitive Impairment';
            return 'Normal';
          }
          if (formName === 'C-SSRS') {
            if (score >= 12) return 'High Risk';
            if (score >= 7) return 'Moderate Risk';
            if (score >= 1) return 'Low Risk';
            return 'No Risk';
          }
          return 'Unknown';
        };

        const getRecommendations = (formName, severity) => {
          const common = [];
          if (severity.toLowerCase().includes('severe') || severity.toLowerCase().includes('moderate')) {
            common.push('Consider reaching out to a qualified mental health professional.');
            common.push('If you are in crisis or have thoughts of self-harm, seek immediate help or emergency services.');
          } else if (severity.toLowerCase().includes('mild')) {
            common.push('Try daily self-care strategies: exercise, sleep hygiene, and mindful breathing.');
            common.push('Consider speaking to a counselor for brief support.');
          } else {
            common.push('Maintain current self-care routine and check in periodically.');
          }
          // specific tips
          if (formName === 'PHQ-9') common.push('Consider behavioral activation: plan small rewarding activities each day.');
          if (formName === 'GAD-7') common.push('Practice worry-time scheduling and grounding techniques.');
          return common;
        };

        const severity_level = computeSeverity(form.name, totalScore);
        submission.severity_level = severity_level;
        submission.recommendations = getRecommendations(form.name, severity_level);

        // Generate AI response using Gemini API
        try {
          toast.loading('Generating personalized insights...');
          const aiResponse = await generateAssessmentResponse(form.name, totalScore, severity_level);
          submission.ai_response = aiResponse;
          toast.dismiss();
        } catch (error) {
          console.error('Error generating AI response:', error);
          submission.ai_response = 'Thank you for completing this assessment. Please review your results with a mental health professional for personalized guidance.';
        }

        // NOTE: Removed localStorage persistence; pass submission upward only.

        toast.success('Assessment completed successfully!');
        onSubmission(submission);
      } else {
        const response = await fetch(`${API_BASE}/api/assessment/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            form_id: form.id,
            responses: responses
          }),
        });

        if (response.ok) {
          const submission = await response.json();
          toast.success('Assessment completed successfully!');
          onSubmission(submission);
        } else {
          throw new Error('Failed to submit assessment');
        }
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestionData = form.questions[currentQuestion];

  const renderConfirmation = () => (
    <Card className={`${theme.colors.card} max-w-2xl mx-auto shadow-2xl`}>
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
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
      <Card className={`${theme.colors.card} shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
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
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleResponse(currentQuestionData.id, option.value)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                  responses[currentQuestionData.id] === option.value
                    ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-lg'
                    : `border-gray-200 hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-25 hover:to-blue-25 ${theme.colors.card}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${theme.colors.text}`}>
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
            ))}
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