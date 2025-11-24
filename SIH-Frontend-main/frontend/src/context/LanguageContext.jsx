import React, { createContext, useContext, useState, useEffect } from 'react';
import { languages } from '../data/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('sensease-language');
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
      document.documentElement.dir = languages[savedLanguage]?.dir || 'ltr';
      document.documentElement.lang = savedLanguage;
    } else {
      // Ensure document defaults are set
      document.documentElement.dir = languages['en']?.dir || 'ltr';
      document.documentElement.lang = 'en';
    }
  }, []);

  const changeLanguage = (langCode) => {
    if (!languages[langCode]) return;
    setCurrentLanguage(langCode);
    localStorage.setItem('sensease-language', langCode);
    document.documentElement.dir = languages[langCode]?.dir || 'ltr';
    document.documentElement.lang = langCode;
  };

  const t = (key, vars) => {
    const value = languages[currentLanguage]?.translations[key] ?? key;
    if (!vars || typeof value !== 'string') return value;
    return value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
  };

  const value = {
    currentLanguage,
    language: languages[currentLanguage],
    changeLanguage,
    availableLanguages: languages,
    t,
    isRTL: languages[currentLanguage]?.dir === 'rtl'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};