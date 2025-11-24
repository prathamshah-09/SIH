import React from 'react';
// yoyoyoo

const SensEaseLogo = ({ className = "w-12 h-12", showText = true, textClassName = "", showSubtitle = true }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Logo Image - Using the provided logo URL */}
      <div className={`${className} relative`}>
        <img 
          src="https://customer-assets.emergentagent.com/job_tailwind-react-ui/artifacts/d25n7e3k_ChatGPT%20Image%20Sep%2016%2C%202025%2C%2012_12_25%20PM%5B1%5D.png"
          alt="SensEase Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to custom SVG if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        {/* Fallback SVG Logo */}
        <svg 
          className="w-full h-full object-contain absolute top-0 left-0 hidden"
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular background gradient */}
          <defs>
            <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#059669" />
            </radialGradient>
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          
          {/* Main circle */}
          <circle cx="100" cy="100" r="95" fill="url(#bgGradient)" stroke="#ffffff" strokeWidth="4"/>
          
          {/* Profile silhouette */}
          <path d="M75 80C75 70 83 60 95 60C107 60 115 70 115 80C115 90 107 100 95 100C83 100 75 90 75 80Z" fill="#ffffff" opacity="0.9"/>
          <path d="M60 140C65 120 78 110 95 110C112 110 125 120 130 140C125 150 112 155 95 155C78 155 65 150 60 140Z" fill="#ffffff" opacity="0.9"/>
          
          {/* Chat bubble */}
          <circle cx="130" cy="75" r="18" fill="#ffffff" opacity="0.9"/>
          <circle cx="125" cy="72" r="2" fill="#059669"/>
          <circle cx="130" cy="72" r="2" fill="#059669"/>
          <circle cx="135" cy="72" r="2" fill="#059669"/>
          <path d="M130 90L125 85L135 85Z" fill="#ffffff" opacity="0.9"/>
          
          {/* Decorative leaves */}
          <path d="M50 60C45 55 45 45 55 40C65 45 65 55 60 60C55 55 50 60 50 60Z" fill="url(#leafGradient)" opacity="0.8"/>
          <path d="M40 70C35 65 35 55 45 50C55 55 55 65 50 70C45 65 40 70 40 70Z" fill="url(#leafGradient)" opacity="0.6"/>
          
          {/* Additional decorative elements */}
          <circle cx="150" cy="130" r="4" fill="#ffffff" opacity="0.5"/>
          <circle cx="45" cy="120" r="3" fill="#ffffff" opacity="0.4"/>
        </svg>
      </div>
      
      {/* Text Logo */}
      {showText && (
        <div className={textClassName}>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-green-600 bg-clip-text text-transparent">
            SensEase
          </h1>
          {showSubtitle && <p className="text-sm text-gray-600">Mental Health & Support</p>}
        </div>
      )}
    </div>
  );
};

export default SensEaseLogo;