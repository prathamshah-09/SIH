import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the accessibility context
const AccessibilityContext = createContext();

/**
 * AccessibilityProvider - Global state management for accessibility preferences
 * Manages font size and high contrast mode
 * Persists user preferences to localStorage
 * Complies with WCAG 2.1 AA and Indian accessibility standards (GIGW, RPwD Act 2016)
 */
export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem('a11y-fontSize');
      const savedHighContrast = localStorage.getItem('a11y-highContrast');

      if (savedFontSize) setFontSize(savedFontSize);
      if (savedHighContrast) setHighContrast(JSON.parse(savedHighContrast));
    } catch (e) {
      console.error('Error loading accessibility preferences:', e);
    }
  }, []);

  // Update localStorage and DOM when fontSize changes
  useEffect(() => {
    localStorage.setItem('a11y-fontSize', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  // Update localStorage and DOM when highContrast changes
  useEffect(() => {
    localStorage.setItem('a11y-highContrast', JSON.stringify(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const value = {
    fontSize,
    highContrast,
    setFontSize,
    setHighContrast,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Custom hook to use accessibility context
 * Usage: const { fontSize, highContrast, setFontSize, setHighContrast } = useAccessibility();
 */
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
