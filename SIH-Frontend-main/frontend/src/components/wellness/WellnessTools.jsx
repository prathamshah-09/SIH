import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft } from 'lucide-react';

// Import components
// import AudioSection from './AudioSection';
import VideoSection from './VideoSection';
import BookSection from './BookSection';
import PomodoroTimer from './PomodoroTimer';
import EisenhowerMatrix from './EisenhowerMatrix';
import EnhancedJournalingView from './EnhancedJournalingViewClean';

// Import data
import { wellnessProblems, wellnessContent } from '../../data/wellnessContent';

const WellnessTools = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [showJournaling, setShowJournaling] = useState(false);

  const handleProblemSelect = (problemId) => {
    setSelectedProblem(problemId);
    setActiveTab('videos');
    setShowJournaling(false);
  };

  const handleBackToProblems = () => {
    setSelectedProblem(null);
    setShowJournaling(false);
  };

  // Close journaling view and return to the problem's tools (keep selectedProblem)
  const handleBackFromJournaling = () => {
    setShowJournaling(false);
  };

  const handleJournalingClick = () => {
    setShowJournaling(true);
  };

  // using emoji icons from `wellnessProblems.[].icon` for cards

  // Show journaling view
  if (showJournaling) {
    return <EnhancedJournalingView onBack={handleBackFromJournaling} />;
  }

  // Show problem selection screen
  if (!selectedProblem) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className={`text-2xl sm:text-3xl font-bold ${theme.colors.text} mb-4`}>
            {t('selectProblem')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mobile: simple list of problem names (only on small phones) */}
          <div className="md:hidden space-y-2 w-full">
            {Object.entries(wellnessProblems).map(([problemId, problem]) => (
              <div 
                key={problemId} 
                onClick={() => handleProblemSelect(problemId)}
                className={`flex items-center p-3 rounded-lg ${theme.colors.card} border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300`}
              >
                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white ${problem.color}`}>
                    <span className="text-2xl">{problem.icon}</span>
                  </div>
                  <div className="font-medium">{t(problemId)}</div>
                </div>
              </div>
            ))}
          </div>
          {Object.entries(wellnessProblems).map(([problemId, problem]) => (
            <Card 
              key={problemId}
              className={`${theme.colors.card} hidden md:block hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 border-0 group`}
              onClick={() => handleProblemSelect(problemId)}
            >
              <CardContent>
                {/* iPad-mini layout: show only icon and name (visible at md, hidden at lg) */}
                <div className="hidden md:flex lg:hidden flex-col items-center p-4">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg mb-2 ${problem.color}`}> 
                    <span className="text-2xl">{problem.icon}</span>
                  </div>
                  <h3 className={`font-bold text-sm ${theme.colors.text} mt-1`}>{t(problemId)}</h3>
                </div>

                {/* Desktop / laptop layout: full card (visible at lg and up) */}
                <div className="hidden lg:block p-5 text-center">
                  <div className="mb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-3 ${problem.color} group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{problem.icon}</span>
                    </div>
                  </div>

                  <h3 className={`font-bold text-lg ${theme.colors.text} group-hover:${problem.color} transition-colors mb-2`}>
                    {t(problemId)}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        
      </div>
    );
  }

  // Show problem-specific tools and content
  const problem = wellnessProblems[selectedProblem];
  const content = wellnessContent[selectedProblem] || { /*audios: [],*/ videos: [], books: [] };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handleBackToProblems}
          variant="outline"
          className={`${theme.colors.text} hover:bg-gradient-to-r hover:${theme.colors.secondary} transition-all duration-200 hover:scale-105 p-2`}
          aria-label={t('backToProblems')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{problem.icon}</div>
          <h2 className={`text-3xl font-bold ${theme.colors.text}`}>
            {t(selectedProblem)}
          </h2>
        </div>
      </div>

      {/* Horizontal Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg">
        {problem.tools.map((tool) => (
          <Button
            key={tool}
            onClick={() => {
              if (tool === 'journaling') {
                handleJournalingClick();
              } else {
                setActiveTab(tool);
              }
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              activeTab === tool && !showJournaling
                ? `bg-gradient-to-r ${theme.colors.primary} text-white shadow-lg` 
                : `bg-white ${theme.colors.text} hover:bg-gradient-to-r hover:${theme.colors.secondary} border-2 border-gray-200 hover:border-blue-300`
            }`}
          >
            {t(tool)}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {activeTab === 'videos' && <VideoSection videos={content.videos} />}
        {activeTab === 'books' && <BookSection books={content.books} />}
        {activeTab === 'pomodoroTimer' && <PomodoroTimer />}
        {activeTab === 'eisenhowerMatrix' && <EisenhowerMatrix />}
      </div>
    </div>
  );
};

export default WellnessTools;