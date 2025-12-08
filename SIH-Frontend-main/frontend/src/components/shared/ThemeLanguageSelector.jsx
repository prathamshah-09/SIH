import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Palette, Globe, Check } from 'lucide-react';

const ThemeLanguageSelector = () => {
  const { currentTheme, availableThemes, changeTheme, theme } = useTheme();
  const { currentLanguage, availableLanguages, changeLanguage, t } = useLanguage();
  const [showThemes, setShowThemes] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  return (
    <div className="flex items-center space-x-1">
      {/* Language Selector */}
      <Popover open={showLanguages} onOpenChange={setShowLanguages}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            aria-label="Select language"
            className={`flex items-center justify-center hover:scale-105 transition-transform p-2 ${
              theme.currentTheme === 'midnight' ? 'text-white' : ''
            }`}
          >
            <Globe className={`w-4 h-4 ${theme.currentTheme === 'midnight' ? 'text-white' : ''}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('selectLanguage')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-0">
              {Object.entries(availableLanguages).map(([code, lang]) => (
                <Button
                  key={code}
                  variant={currentLanguage === code ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-between hover:scale-[1.02] transition-transform"
                  onClick={() => {
                    changeLanguage(code);
                    setShowLanguages(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  {currentLanguage === code && <Check className="w-4 h-4" />}
                </Button>
              ))}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {/* Theme Selector */}
      <Popover open={showThemes} onOpenChange={setShowThemes}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center space-x-2 hover:scale-105 transition-transform ${
              theme.currentTheme === 'midnight' ? 'text-white' : ''
            }`}
          >
            <Palette className={`w-4 h-4 ${theme.currentTheme === 'midnight' ? 'text-white' : ''}`} />
            <span className={`hidden sm:inline ${theme.currentTheme === 'midnight' ? 'text-white' : ''}`}>{availableThemes[currentTheme]?.name}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('selectTheme')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-0">
              {Object.entries(availableThemes).map(([key, theme]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-between hover:scale-[1.02] transition-transform ${
                    currentTheme === key ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    changeTheme(key);
                    setShowThemes(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.colors.primary}`}></div>
                    <span>{theme.name}</span>
                  </div>
                  {currentTheme === key && <Check className="w-4 h-4" />}
                </Button>
              ))}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeLanguageSelector;