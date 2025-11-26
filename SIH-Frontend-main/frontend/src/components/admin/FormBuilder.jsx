import React, { useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAnnouncements } from '@context/AnnouncementContext';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Copy,
  GripVertical
} from 'lucide-react';

const FormBuilder = () => {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addForm } = useAnnouncements();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add new question
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      title: '',
      type: 'short_text',
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

  // Add option
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

  const handlePublishForm = () => {
    if (!formTitle.trim()) {
      toast({
        title: 'Title Required',
        description: 'Please enter a form title',
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
      description: formDescription.trim(),
      questions: questions,
      type: 'wellness',
      status: 'active'
    });

    toast({
      title: 'Form Created',
      description: 'Your form has been created successfully!',
      className: 'animate-celebration'
    });

    navigate('/admin/announcements');
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/announcements')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text}`}>
            Create New Form
          </h1>
        </div>
      </div>

      {/* Form Details Card */}
      <Card className={`${theme.colors.card} border-0 shadow-lg`}>
        <CardHeader className={`bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-lg`}>
          <CardTitle className="text-white">Form Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${theme.colors.text}`}>
              Form Title
            </label>
            <Input
              placeholder="Enter form title..."
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-sm border-2 border-gray-200 focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${theme.colors.text}`}>
              Form Description
            </label>
            <Textarea
              placeholder="Enter form description (optional)..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={3}
              className="text-sm border-2 border-gray-200 focus:border-cyan-500 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold ${theme.colors.text}`}>
            Questions {questions.length > 0 && `(${questions.length})`}
          </h2>
          <Button 
            onClick={handleAddQuestion}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <Card className={`${theme.colors.card} border-2 border-dashed`}>
            <CardContent className="p-8 text-center">
              <p className={`${theme.colors.muted} text-lg`}>
                No questions added yet. Click "Add Question" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} className={`${theme.colors.card} border-0 shadow-md`}>
                <CardContent className="p-6 space-y-4">
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className={`text-xs font-medium ${theme.colors.muted}`}>
                          Q{index + 1}
                        </span>
                      </div>
                      <Input
                        placeholder="Question text..."
                        value={question.title}
                        onChange={(e) => handleUpdateQuestion(question.id, 'title', e.target.value)}
                        className="text-sm border-2 border-gray-200 focus:border-cyan-500 font-semibold"
                      />
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
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
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Question Type</label>
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
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
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
                              className="hover:bg-red-50 text-red-600 px-2 flex-shrink-0"
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
                        className="w-full text-cyan-600 border-cyan-300 hover:bg-cyan-50 mt-2"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                  )}

                  {/* Required checkbox */}
                  <div className="flex items-center gap-2 pt-2 border-t">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 pb-8">
        <Button 
          variant="outline"
          onClick={() => navigate('/admin/announcements')}
          className="px-6"
        >
          Cancel
        </Button>
        <Button 
          onClick={handlePublishForm}
          disabled={questions.length === 0 || !formTitle.trim()}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Publish Form
        </Button>
      </div>
    </div>
  );
};

export default FormBuilder;
