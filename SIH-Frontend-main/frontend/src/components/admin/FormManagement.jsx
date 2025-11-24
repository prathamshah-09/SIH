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
  Plus
} from 'lucide-react';

const FormManagement = () => {
  const [formTitle, setFormTitle] = useState('');
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addForm } = useAnnouncements();
  const { toast } = useToast();

  const handleReleaseForm = () => {
    if (!formTitle.trim()) {
      toast({
        title: t('formTitleRequired'),
        description: t('enterFormTitle'),
        variant: 'destructive'
      });
      return;
    }

    addForm({
      title: formTitle.trim(),
      type: 'wellness',
      status: 'active'
    });

    toast({
      title: t('formReleased'),
      description: t('formBloomingMessage'),
      className: 'animate-celebration'
    });

    setFormTitle('');
  };

  const setTemplateTitle = (title) => {
    setFormTitle(title);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-0">
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

          {/* Quick Templates */}
          <div className="space-y-2">
            <label className={`text-xs sm:text-sm font-medium ${theme.colors.text}`}>
              {t('quickTemplates')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">\n              <Button
                variant="outline"
                className={`p-3 sm:p-4 h-auto justify-start text-sm border-2 hover:border-cyan-300 hover:shadow-md transition-all duration-300 hover:scale-105 ${theme.colors.card}`}
                onClick={() => setTemplateTitle(t('weeklyMoodCheck'))}
              >
                <div className="text-left">
                  <div className={`font-medium ${theme.colors.text}`}>
                    {t('weeklyMoodCheck')}
                  </div>
                  <div className={`text-xs ${theme.colors.muted}`}>
                    {t('weeklyMoodDesc')}
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className={`p-4 h-auto justify-start border-2 hover:border-cyan-300 hover:shadow-md transition-all duration-300 hover:scale-105 ${theme.colors.card}`}
                onClick={() => setTemplateTitle(t('selfCareAssessment'))}
              >
                <div className="text-left">
                  <div className={`font-medium ${theme.colors.text}`}>
                    {t('selfCareAssessment')}
                  </div>
                  <div className={`text-xs ${theme.colors.muted}`}>
                    {t('selfCareDesc')}
                  </div>
                </div>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button 
              variant="outline" 
              className={`hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-300 transition-all duration-200 ${theme.colors.card}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('addQuestions')}
            </Button>
            
            <Button 
              onClick={handleReleaseForm}
              className={`bg-gradient-to-r ${theme.colors.secondary} text-white hover:shadow-lg font-semibold px-6 hover:scale-105 transition-all duration-200`}
            >
              <Send className="w-4 h-4 mr-2" />
              {t('releaseForm')}
            </Button>
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <p className="text-sm text-cyan-800 font-medium">
              🌱 {t('growthTip')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormManagement;