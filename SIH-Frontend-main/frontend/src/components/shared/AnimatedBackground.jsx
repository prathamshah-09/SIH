import React from 'react';

const AnimatedBackground = ({ theme }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r ${theme.colors.accent} rounded-full opacity-20 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-10">
        <div className={`w-full h-full bg-gradient-to-r ${theme.colors.primary} rounded-full blur-3xl animate-pulse`}
             style={{ animationDuration: '4s' }} />
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-10">
        <div className={`w-full h-full bg-gradient-to-r ${theme.colors.accent} rounded-full blur-3xl animate-pulse`}
             style={{ animationDuration: '6s' }} />
      </div>

      {/* Flowing lines */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-5" viewBox="0 0 1200 800">
          <path
            d="M0,400 Q300,200 600,400 T1200,400"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,500 Q400,300 800,500 T1200,500"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedBackground;