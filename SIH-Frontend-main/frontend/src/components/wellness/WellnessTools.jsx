import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Calendar } from 'lucide-react';

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
  };

  const handleBackToProblems = () => {
    setSelectedProblem(null);
  };

  // using emoji icons from `wellnessProblems.[].icon` for cards

  // Show problem selection screen
  if (!selectedProblem) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className={`text-2xl sm:text-3xl font-bold ${theme.colors.text} mb-4`}>
            {t('selectProblem')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* Mobile: Grid layout with 2 columns (3 rows) */}
          <div className="sm:hidden contents">
            {Object.entries(wellnessProblems).map(([problemId, problem]) => (
              <div 
                key={problemId} 
                onClick={() => handleProblemSelect(problemId)}
                className={`flex flex-col items-center justify-center p-8 min-h-48 rounded-2xl ${theme.colors.card} border-0 cursor-pointer hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg hover:-translate-y-1`}
              >
                <div className={`inline-flex items-center justify-center mb-4`}>
                  <span className="text-7xl">{problem.icon}</span>
                </div>
                <div className="font-bold text-lg text-center">{t(problemId)}</div>
              </div>
            ))}
          </div>
          {Object.entries(wellnessProblems).map(([problemId, problem]) => (
            <Card 
              key={problemId}
              className={`${theme.colors.card} hidden sm:block hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 border-0 group shadow-xl hover:-translate-y-2`}
              onClick={() => handleProblemSelect(problemId)}
            >
              <CardContent>
                {/* Tablet layout: show only icon and name (visible at sm/md, hidden at lg) */}
                <div className="hidden sm:flex lg:hidden flex-col items-center p-8 text-center">
                  <div className={`inline-flex items-center justify-center mb-4`}> 
                    <span className="text-5xl">{problem.icon}</span>
                  </div>
                  <h3 className={`font-bold text-lg ${theme.colors.text} mt-2`}>{t(problemId)}</h3>
                </div>

                {/* Desktop / laptop layout: full card (visible at lg and up) */}
                <div className="hidden lg:block p-7 text-center">
                  <div className="mb-5">
                    <div className={`inline-flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-4xl">{problem.icon}</span>
                    </div>
                  </div>

                  <h3 className={`font-bold text-xl ${theme.colors.text} group-hover:${problem.color} transition-colors mb-2`}>
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
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBackToProblems}
          className={`hidden sm:flex p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-110`}
          title={t('backToProblems')}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex-1 flex items-center justify-center space-x-4">
          <div className="text-3xl">{problem.icon}</div>
          <h2 className={`text-2xl sm:text-3xl font-bold ${theme.colors.text}`}>
            {t(selectedProblem)}
          </h2>
        </div>
      </div>

      {/* Horizontal Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 p-4 sm:p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-xl">
        {problem.tools.map((tool) => (
          <Button
            key={tool}
            onClick={() => {
              setActiveTab(tool);
            }}
            className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-110 transform whitespace-nowrap ${
              activeTab === tool
                ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-2xl` 
                : `bg-white ${theme.colors.text} hover:bg-blue-50 border-2 border-blue-200 shadow-lg hover:shadow-2xl`
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
        {activeTab === 'journaling' && <EnhancedJournalingView onBack={handleBackToProblems} />}
      </div>
    </div>
  );
};

export default WellnessTools;