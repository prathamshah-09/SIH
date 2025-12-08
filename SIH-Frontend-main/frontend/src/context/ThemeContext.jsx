import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  ocean: {
    name: 'Ocean Breeze',
    colors: {
      primary: 'from-cyan-500 to-blue-600',
      secondary: 'from-cyan-50 to-blue-50',
      accent: 'from-cyan-400 to-blue-500',
      background: 'from-cyan-50 via-white to-blue-50',
      card: 'bg-white/80 backdrop-blur-sm border-cyan-100',
      text: 'text-cyan-900',
      muted: 'text-cyan-600'
    }
  },
  midnight: {
    name: 'Midnight',
    colors: {
      primary: 'from-slate-600 to-gray-700',
      secondary: 'from-slate-800 to-gray-800',
      accent: 'from-blue-600 to-indigo-600',
      background: 'from-slate-900 via-gray-900 to-slate-800',
      card: 'bg-slate-800/70 backdrop-blur-sm border-slate-700',
      text: 'text-slate-100',
      muted: 'text-slate-300'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('ocean');

  useEffect(() => {
    const savedTheme = localStorage.getItem('sensease-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('sensease-theme', themeName);
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    changeTheme,
    availableThemes: themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};