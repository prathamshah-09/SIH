import React, { useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useAnnouncements } from '@context/AnnouncementContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useToast } from '@hooks/use-toast';
import { 
  ClipboardList, 
  Send, 
  Plus,
  Trash2,
  Copy,
  GripVertical
} from 'lucide-react';

const FormManagement = () => {
  const [formTitle, setFormTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addForm } = useAnnouncements();
  const { toast } = useToast();

  // Add new question
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      title: '',
      type: 'short_text', // short_text, long_text, multiple_choice, checkbox
      options: [''],
      required: false
    };
    setQuestions([...questions, newQuestion]);
    setEditingQuestionId(newQuestion.id);
  };

  // Update question
  const handleUpdateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  // Delete question
  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (editingQuestionId === id) {
      setEditingQuestionId(null);
    }
  };

  // Duplicate question
  const handleDuplicateQuestion = (id) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    if (questionToDuplicate) {
      const newQuestion = {
        ...questionToDuplicate,
        id: Date.now(),
        title: questionToDuplicate.title + ' (Copy)'
      };
      setQuestions([...questions, newQuestion]);
    }
  };

  // Add option to multiple choice/checkbox question
  const handleAddOption = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: [...q.options, ''] }
        : q
    ));
  };

  // Update option
  const handleUpdateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
          }
        : q
    ));
  };

  // Remove option
  const handleRemoveOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: q.options.filter((_, idx) => idx !== optionIndex)
          }
        : q
    ));
  };

  const handleReleaseForm = () => {
    if (!formTitle.trim()) {
      toast({
        title: t('formTitleRequired'),
        description: t('enterFormTitle'),
        variant: 'destructive'
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: 'No Questions',
        description: 'Please add at least one question to the form',
        variant: 'destructive'
      });
      return;
    }

    // Check if all questions have titles
    if (questions.some(q => !q.title.trim())) {
      toast({
        title: 'Incomplete Questions',
        description: 'Please fill in all question titles',
        variant: 'destructive'
      });
      return;
    }

    addForm({
      title: formTitle.trim(),
      questions: questions,
      type: 'wellness',
      status: 'active'
    });

    toast({
      title: t('formReleased'),
      description: t('formBloomingMessage'),
      className: 'animate-celebration'
    });

    setFormTitle('');
    setQuestions([]);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-0">;
      {/* Create New Form */}
      <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
        <CardHeader className={`bg-gradient-to-r ${theme.colors.secondary} rounded-t-lg p-4 sm:p-6`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${theme.colors.accent} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
              <ClipboardList className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <CardTitle className={`text-lg sm:text-xl ${theme.colors.cardText} flex items-center gap-2`}>
                {t('trackTransform')}
                <span className="text-xl sm:text-2xl">📝</span>
              </CardTitle>
              <CardDescription className={`${theme.colors.cardText} opacity-80 text-xs sm:text-sm`}>
                {t('buildWellnessForms')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <label className={`text-xs sm:text-sm font-medium ${theme.colors.text}`}>
              {t('formTitle')}
            </label>
            <Input
              placeholder={t('formTitlePlaceholder')}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className={`text-sm border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 ${theme.colors.card}`}
            />
          </div>

          {/* Questions List */}
          {questions.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <h3 className={`text-sm font-semibold ${theme.colors.text}`}>Questions ({questions.length})</h3>
              {questions.map((question, index) => (
                <div key={question.id} className={`border rounded-lg p-4 ${theme.colors.card} hover:shadow-md transition-all`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className={`text-xs font-medium ${theme.colors.muted}`}>Q{index + 1}</span>
                      </div>
                      <Input
                        placeholder="Question text..."
                        value={question.title}
                        onChange={(e) => handleUpdateQuestion(question.id, 'title', e.target.value)}
                        className="text-sm border-2 border-gray-200 focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDuplicateQuestion(question.id)}
                        className="hover:bg-cyan-50 text-cyan-600"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Question Type */}
                  <div className="mb-3">
                    <select
                      value={question.type}
                      onChange={(e) => handleUpdateQuestion(question.id, 'type', e.target.value)}
                      className={`w-full text-sm border-2 border-gray-200 rounded p-2 focus:border-cyan-500 focus:outline-none ${theme.colors.card}`}
                    >
                      <option value="short_text">Short Text</option>
                      <option value="long_text">Long Text</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="checkbox">Checkboxes</option>
                    </select>
                  </div>

                  {/* Options for multiple choice and checkbox */}
                  {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
                    <div className="space-y-2 mb-3 bg-gray-50 p-3 rounded">
                      <label className={`text-xs font-medium ${theme.colors.text}`}>Options</label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => handleUpdateOption(question.id, optionIndex, e.target.value)}
                            className="text-sm border-2 border-gray-200 focus:border-cyan-500"
                          />
                          {question.options.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveOption(question.id, optionIndex)}
                              className="hover:bg-red-50 text-red-600 px-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddOption(question.id)}
                        className="w-full text-cyan-600 border-cyan-300 hover:bg-cyan-50"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                  )}

                  {/* Required checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      checked={question.required}
                      onChange={(e) => handleUpdateQuestion(question.id, 'required', e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor={`required-${question.id}`} className={`text-xs ${theme.colors.text} cursor-pointer`}>
                      Required question
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 gap-3">
            <Button 
              onClick={handleAddQuestion}
              variant="outline" 
              className={`hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-300 transition-all duration-200 ${theme.colors.card}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('addQuestions')}
            </Button>
            
            <Button 
              onClick={handleReleaseForm}
              disabled={questions.length === 0 || !formTitle.trim()}
              className={`bg-gradient-to-r ${theme.colors.secondary} text-white hover:shadow-lg font-semibold px-6 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send className="w-4 h-4 mr-2" />
              {t('releaseForm')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormManagement;