import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
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

const AdminFormResponse = ({ form, onSubmission, onBack }) => {
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
  const hasAnswered = responses[form.questions[currentQuestion]?.id] !== undefined && responses[form.questions[currentQuestion]?.id] !== '';
  const allQuestionsAnswered = form.questions.every(q => !q.required || (responses[q.id] !== undefined && responses[q.id] !== ''));

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const currentQ = form.questions[currentQuestion];
    
    if (currentQ.required && !hasAnswered) {
      toast.error('Please answer this required question');
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
      toast.error('Please answer all required questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save submission to localStorage
      const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
      const submission = {
        id: Date.now(),
        formId: form.id,
        formTitle: form.title,
        responses: responses,
        submittedAt: new Date().toISOString(),
        questions: form.questions
      };
      submissions.push(submission);
      localStorage.setItem('form_submissions', JSON.stringify(submissions));

      toast.success('Form submitted successfully!');
      
      // Call the submission callback
      onSubmission({
        formId: form.id,
        responses: responses,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestionData = form.questions[currentQuestion];

  const renderConfirmation = () => (
    <Card className={`${theme.colors.card} max-w-2xl mx-auto shadow-2xl`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <CardTitle className={`text-2xl ${theme.colors.text}`}>Ready to Submit?</CardTitle>
        <CardDescription className={theme.colors.muted}>
          You&apos;ve completed the form. Review your answers below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className={`p-4 rounded-lg ${theme.colors.secondary}`}>
          <h3 className={`font-semibold mb-2 ${theme.colors.text}`}>Form Summary</h3>
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
            <h4 className="font-medium text-green-900">Your Response is Secure</h4>
            <p className="text-sm text-green-700 mt-1">
              Your responses are safely stored and will be reviewed by your instructor.
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
                Submit Form
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
              {form.description && (
                <p className={`text-sm ${theme.colors.muted} mt-2`}>{form.description}</p>
              )}
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
            <h2 className={`text-xl font-semibold mb-4 ${theme.colors.text} leading-relaxed flex items-center gap-2`}>
              {currentQuestionData.text}
              {currentQuestionData.required && <span className="text-red-500 text-lg">*</span>}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {/* MCQ Type */}
            {currentQuestionData.type === 'MCQ' && (
              <div className="space-y-3">
                {currentQuestionData.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleResponse(currentQuestionData.id, option)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                      responses[currentQuestionData.id] === option
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                        : `border-gray-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-25 hover:to-pink-25 ${theme.colors.card}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${theme.colors.text}`}>
                        {option}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        responses[currentQuestionData.id] === option
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {responses[currentQuestionData.id] === option && (
                          <CheckCircle className="w-3 h-3 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Multiple Select Type */}
            {currentQuestionData.type === 'Multiple Select' && (
              <div className="space-y-3">
                {currentQuestionData.options?.map((option, index) => {
                  const isSelected = Array.isArray(responses[currentQuestionData.id]) 
                    ? responses[currentQuestionData.id].includes(option)
                    : false;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        const current = Array.isArray(responses[currentQuestionData.id]) 
                          ? responses[currentQuestionData.id] 
                          : [];
                        let updated;
                        if (isSelected) {
                          updated = current.filter(o => o !== option);
                        } else {
                          updated = [...current, option];
                        }
                        handleResponse(currentQuestionData.id, updated);
                      }}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                        isSelected
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                          : `border-gray-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-25 hover:to-pink-25 ${theme.colors.card}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${theme.colors.text}`}>
                          {option}
                        </span>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text Input Type */}
            {currentQuestionData.type === 'Text Input' && (
              <div>
                <label className={`block text-sm mb-3 ${theme.colors.muted}`}>Your Answer</label>
                <Textarea
                  placeholder="Type your answer here..."
                  value={responses[currentQuestionData.id] || ''}
                  onChange={(e) => handleResponse(currentQuestionData.id, e.target.value)}
                  rows={4}
                  className={`w-full p-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none ${theme.colors.card}`}
                />
                <p className={`text-xs ${theme.colors.muted} mt-2`}>
                  {responses[currentQuestionData.id]?.length || 0} characters
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button 
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFirstQuestion ? 'Back' : 'Previous'}
        </Button>

        <div className={`text-sm ${theme.colors.muted}`}>
          {currentQuestion + 1} / {form.questions.length}
        </div>

        <Button 
          onClick={handleNext}
          disabled={currentQuestionData.required && !hasAnswered}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg"
        >
          {isLastQuestion ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Review & Submit
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminFormResponse;
