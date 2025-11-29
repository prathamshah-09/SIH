import React, { useState, lazy, Suspense } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { wellnessProblems, wellnessContent } from '../../data/wellnessContent';

const VideoSection = lazy(() => import('./VideoSection'));
const BookSection = lazy(() => import('./BookSection'));
const PomodoroTimer = lazy(() => import('./PomodoroTimer'));
const EisenhowerMatrix = lazy(() => import('./EisenhowerMatrix'));
const EnhancedJournalingView = lazy(() => import('./EnhancedJournalingViewClean'));

const ICONS = {
  anxiety: {
    left: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 md:w-20 md:h-20 stroke-[1.6] text-slate-800/80">
        <path d="M32 8c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9z" fill="none" stroke="currentColor"/>
        <path d="M15 42c5-10 14-14 17-14s12 4 17 14" fill="none" stroke="currentColor" strokeLinecap="round"/>
      </svg>
    ),
    right: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[1.8] text-slate-800/70">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18" />
        </g>
      </svg>
    )
  },
  depression: {
    left: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 md:w-20 md:h-20 stroke-[1.6] text-slate-800/80">
        <path d="M32 10a14 14 0 100 28 14 14 0 000-28z" fill="none" stroke="currentColor"/>
        <path d="M18 40s6-6 14-6 14 6 14 6" fill="none" stroke="currentColor" strokeLinecap="round"/>
      </svg>
    ),
    right: (
      <svg viewBox="0 0 32 32" className="w-8 h-8 stroke-[1.8] text-slate-800/70">
        <rect x="4" y="6" width="22" height="18" rx="2" fill="none" stroke="currentColor"/>
        <path d="M8 12h16" stroke="currentColor" strokeLinecap="round" />
      </svg>
    )
  },
  burnout: {
    left: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 md:w-20 md:h-20 stroke-[1.6] text-slate-800/80">
        <path d="M32 8v10" stroke="currentColor" strokeLinecap="round"/>
        <path d="M18 28l14 14 14-14" fill="none" stroke="currentColor" strokeLinecap="round"/>
      </svg>
    ),
    right: (
      <svg viewBox="0 0 32 32" className="w-8 h-8 stroke-[1.8] text-slate-800/70">
        <rect x="3" y="6" width="22" height="18" rx="3" fill="none" stroke="currentColor"/>
        <path d="M8 12h12" stroke="currentColor" strokeLinecap="round"/>
      </svg>
    )
  },
  sleepDisorders: {
    left: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 md:w-20 md:h-20 stroke-[1.6] text-slate-800/80">
        <path d="M44 20a14 14 0 11-24 14 10 10 0 0024-14z" fill="none" stroke="currentColor"/>
      </svg>
    ),
    right: (
      <svg viewBox="0 0 32 32" className="w-8 h-8 stroke-[1.8] text-slate-800/70">
        <path d="M8 12v6l6 4" fill="none" stroke="currentColor" strokeLinecap="round"/>
      </svg>
    )
  },
  academicStress: {
    left: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 md:w-20 md:h-20 stroke-[1.6] text-slate-800/80">
        <path d="M4 20l28-12 28 12-28 12L4 20z" fill="none" stroke="currentColor"/>
        <path d="M4 20v16c0 8 12 12 28 12s28-4 28-12V20" fill="none" stroke="currentColor" strokeLinecap="round"/>
      </svg>
    ),
    right: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 md:w-20 md:h-20 stroke-[1.6] text-slate-800/70">
        <path d="M8 24h48" />
      </svg>
    )
  },
  socialIsolation: {
    left: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 md:w-20 md:h-20 stroke-[1.6] text-slate-800/80">
        <circle cx="32" cy="22" r="8" fill="none" stroke="currentColor"/>
        <path d="M14 50v-2c0-7 10-12 18-12s18 5 18 12v2" fill="none" stroke="currentColor" strokeLinecap="round" />
      </svg>
    ),
    right: (
      <svg viewBox="0 0 32 32" className="w-8 h-8 stroke-[1.8] text-slate-800/70">
        <rect x="20" y="6" width="8" height="14" rx="2" fill="none" stroke="currentColor"/>
        <path d="M4 16a6 6 0 0112 0v8" fill="none" stroke="currentColor" strokeLinecap="round"/>
      </svg>
    )
  }
};

const GRADIENTS = {
  anxiety: 'from-[#c9f3fb] via-[#e6fbfa] to-[#f1fbff]',
  depression: 'from-[#f7fbdb] via-[#fafde9] to-[#ffffff]',
  burnout: 'from-[#fff0df] via-[#ffe7d9] to-[#fff8f2]',
  sleepDisorders: 'from-[#e7ddff] via-[#efe6ff] to-[#fbf7ff]',
  academicStress: 'from-white to-white',
  socialIsolation: 'from-[#efd9ff] via-[#f3eafc] to-[#fbf7ff]'
};

const WellnessTools = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [showJournaling, setShowJournaling] = useState(false);

  const select = (id) => {
    setSelectedProblem(id);
    setActiveTab('videos');
  };
  const back = () => {
    setSelectedProblem(null);
    setShowJournaling(false);
  };

  if (showJournaling) {
    return (
      <Suspense fallback={<div className="p-8">Loading journaling…</div>}>
        <EnhancedJournalingView onBack={back} />
      </Suspense>
    );
  }

  if (!selectedProblem) {
    return (
      <div className="space-y-6 pb-8">
        <div className="text-center">
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${theme.colors.text} mb-3`}>
            {t('selectProblem') || 'What are you dealing with today?'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(wellnessProblems).map(([id, problem], idx) => {
            const gradient = GRADIENTS[id] || 'from-white to-gray-50';
            const leftIcon = ICONS[id]?.left ?? ICONS.anxiety.left;
            const rightIcon = ICONS[id]?.right ?? ICONS.anxiety.right;
            const isCenter = id === 'academicStress';
            const alignLeftClass = 'w-1/3 flex items-center';
            const contentClass = 'flex-1 text-center px-4';

            // Slight positional offsets to better match screenshot
            const offsetY = idx === 1 || idx === 4 ? 'translate-y-2' : '';
            return (
              <button
                key={id}
                aria-label={t(id)}
                onClick={() => select(id)}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden border-0 transition-transform duration-300 transform hover:-translate-y-3 hover:scale-[1.02] ${offsetY}
                  ${isCenter ? 'bg-white shadow-xl' : `bg-gradient-to-br ${gradient} shadow-[0_25px_40px_rgba(30,41,59,0.06)]`}
                  min-h-[120px] sm:min-h-[136px] p-6 flex items-center justify-between`}
              >
                {/* sparkle & soft gloss */}
                <div className="pointer-events-none absolute inset-0">
                  <div className={`absolute -left-16 -top-12 w-40 h-40 rounded-full bg-white/20 blur-3xl ${isCenter ? 'opacity-10' : 'opacity-50'} transform rotate-12 animate-wellnessFloat`} />
                  <div className="absolute right-8 top-8 w-2.5 h-2.5 rounded-full bg-white/60 opacity-80" />
                  <div className="absolute left-6 bottom-10 w-2 h-2 rounded-full bg-white/60 opacity-60" />
                </div>

                {/* left icon */}
                <div className={`${alignLeftClass} pl-1`}>
                  <div className={`rounded-full ${isCenter ? 'bg-white/5 border border-slate-100' : 'bg-white/20'} p-3 w-20 h-20 flex items-center justify-center`}>
                    {leftIcon}
                  </div>
                </div>

                {/* center label */}
                <div className={contentClass}>
                  <h3 className={`text-base md:text-lg lg:text-xl font-semibold ${theme.colors.text} tracking-tight`}>
                    {t(id)}
                  </h3>
                </div>

                {/* right icon */}
                <div className="w-1/3 flex items-center justify-end pr-3">
                  <div className="p-2 rounded-md bg-white/10 border border-white/20 transform transition-transform duration-300 group-hover:translate-x-2">
                    {rightIcon}
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl group-hover:ring-2 group-hover:ring-white/30 transition-all duration-300 pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const problem = wellnessProblems[selectedProblem];
  const content = wellnessContent[selectedProblem] || { videos: [], books: [] };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={back} className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-200" title={t('backToProblems')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-700">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex-1 flex items-center justify-center space-x-3">
          <div className="text-3xl">{problem.icon}</div>
          <h2 className={`text-2xl sm:text-3xl font-bold ${theme.colors.text}`}>{t(selectedProblem)}</h2>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 p-4 sm:p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-xl">
        {problem.tools.map((tool) => (
          <Button
            key={tool}
            onClick={() => setActiveTab(tool)}
            className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform whitespace-nowrap ${
              activeTab === tool
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-2xl'
                : 'bg-white text-slate-700 hover:bg-indigo-50 border border-indigo-100 shadow-lg'
            }`}
          >
            {t(tool)}
          </Button>
        ))}
      </div>

      <div className="min-h-[420px]">
        <Suspense fallback={<div className="p-8">Loading…</div>}>
          {activeTab === 'videos' && <VideoSection videos={content.videos || []} />}
          {activeTab === 'books' && <BookSection books={content.books || []} />}
          {activeTab === 'pomodoroTimer' && <PomodoroTimer />}
          {activeTab === 'eisenhowerMatrix' && <EisenhowerMatrix />}
          {activeTab === 'journaling' && <EnhancedJournalingView onBack={back} />}
        </Suspense>
      </div>
    </div>
  );
};

export default WellnessTools;