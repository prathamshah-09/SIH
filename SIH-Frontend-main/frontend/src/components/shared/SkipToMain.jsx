import React from 'react';
import '../styles/SkipToMain.css';

/**
 * SkipToMain Component
 * Provides keyboard users with a way to skip directly to main content
 * Complies with WCAG 2.1 AA (Success Criterion 2.4.1 - Bypass Blocks)
 */
export const SkipToMain = () => {
  const skipToMain = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      className="skip-to-main"
      onClick={skipToMain}
      aria-label="Skip to main content"
    >
      Skip to Main Content
    </a>
  );
};

export default SkipToMain;
