import React, { useState } from 'react';
import { useAccessibility } from '@context/AccessibilityContext';
import '../styles/AccessibilityToolbar.css';

/**
 * AccessibilityToolbar Component
 * Floating toolbar providing accessibility controls
 * Features: Font size adjustment, High contrast mode
 * Complies with WCAG 2.1 AA standards
 */
export const AccessibilityToolbar = () => {
  const { fontSize, highContrast, setFontSize, setHighContrast } = useAccessibility();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="accessibility-toolbar"
      role="region"
      aria-label="Accessibility controls"
    >
      {/* Expanded Controls Panel */}
      {expanded && (
        <div
          className="a11y-panel"
          aria-live="polite"
          aria-label="Accessibility options"
        >
          {/* Font Size Controls */}
          <div className="a11y-control-group" role="group" aria-labelledby="font-size-label">
            <label id="font-size-label" className="a11y-label">Text Size</label>
            <div className="a11y-button-group">
              <button
                onClick={() => setFontSize('small')}
                className={`a11y-btn ${fontSize === 'small' ? 'active' : ''}`}
                aria-pressed={fontSize === 'small'}
                aria-label="Decrease text size"
                title="Decrease text size (A−)"
              >
                A−
              </button>
              <button
                onClick={() => setFontSize('normal')}
                className={`a11y-btn ${fontSize === 'normal' ? 'active' : ''}`}
                aria-pressed={fontSize === 'normal'}
                aria-label="Normal text size"
                title="Normal text size (A)"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`a11y-btn ${fontSize === 'large' ? 'active' : ''}`}
                aria-pressed={fontSize === 'large'}
                aria-label="Increase text size"
                title="Increase text size (A+)"
              >
                A+
              </button>
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="a11y-control-group">
            <label htmlFor="contrast-toggle" className="a11y-label">High Contrast</label>
            <button
              id="contrast-toggle"
              onClick={() => setHighContrast(!highContrast)}
              className={`a11y-toggle ${highContrast ? 'active' : ''}`}
              aria-pressed={highContrast}
              aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
              title={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
            >
              ◐
            </button>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="a11y-main-btn"
        aria-expanded={expanded}
        aria-label={expanded ? 'Close accessibility options' : 'Open accessibility options'}
        title="Accessibility options"
      >
        ♿
      </button>
    </div>
  );
};

export default AccessibilityToolbar;
