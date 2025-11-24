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
  forest: {
    name: 'Forest Calm',
    colors: {
      primary: 'from-green-500 to-emerald-600',
      secondary: 'from-green-50 to-emerald-50',
      accent: 'from-green-400 to-emerald-500',
      background: 'from-green-50 via-white to-emerald-50',
      card: 'bg-white/80 backdrop-blur-sm border-green-100',
      text: 'text-green-900',
      muted: 'text-green-600'
    }
  },
  sunset: {
    name: 'Sunset Serenity',
    colors: {
      primary: 'from-orange-500 to-pink-500',
      secondary: 'from-orange-50 to-pink-50',
      accent: 'from-orange-400 to-pink-400',
      background: 'from-orange-50 via-white to-pink-50',
      card: 'bg-white/80 backdrop-blur-sm border-orange-100',
      text: 'text-orange-900',
      muted: 'text-orange-600'
    }
  },
  lavender: {
    name: 'Lavender Dreams',
    colors: {
      primary: 'from-purple-500 to-violet-600',
      secondary: 'from-purple-50 to-violet-50',
      accent: 'from-purple-400 to-violet-500',
      background: 'from-purple-50 via-white to-violet-50',
      card: 'bg-white/80 backdrop-blur-sm border-purple-100',
      text: 'text-purple-900',
      muted: 'text-purple-600'
    }
  },
  royal: {
    name: 'Royal Blue',
    colors: {
      primary: 'from-indigo-600 to-blue-700',
      secondary: 'from-indigo-50 to-blue-50',
      accent: 'from-indigo-500 to-blue-600',
      background: 'from-indigo-50 via-white to-blue-50',
      card: 'bg-white/80 backdrop-blur-sm border-indigo-100',
      text: 'text-indigo-900',
      muted: 'text-indigo-600'
    }
  },
  mint: {
    name: 'Mint Fresh',
    colors: {
      primary: 'from-teal-500 to-green-500',
      secondary: 'from-teal-50 to-green-50',
      accent: 'from-teal-400 to-green-400',
      background: 'from-teal-50 via-white to-green-50',
      card: 'bg-white/80 backdrop-blur-sm border-teal-100',
      text: 'text-teal-900',
      muted: 'text-teal-600'
    }
  },
  dark: {
    name: 'Midnight Calm',
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