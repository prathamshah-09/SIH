import React, { useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  generateSmartAnalytics, 
  analyzeFormStructure,
  generateDataWarnings 
} from './DynamicAnalyticsHandler';

// Chart Components
const LineChart = ({ data, title, height = 300 }) => {
  const maxValue = Math.max(...data.values);
  const minValue = Math.min(...data.values);
  const range = maxValue - minValue || 1;

  const points = data.values.map((value, i) => {
    const x = (i / (data.values.length - 1 || 1)) * 100;
    const y = ((maxValue - value) / range) * 80 + 10;
    return { x, y, value };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={`grid-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
        
        {/* Area fill */}
        <path d={`${pathD} L 100 100 L 0 100 Z`} fill="url(#grad)" />
        
        {/* Line */}
        <path d={pathD} stroke="#06b6d4" strokeWidth="1.5" fill="none" />
        
        {/* Points */}
        {points.map((p, i) => (
          <circle key={`point-${i}`} cx={p.x} cy={p.y} r="1.5" fill="#0891b2" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
        {data.labels.map((label, i) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, title, height = 300 }) => {
  const maxValue = Math.max(...data.values);
  const colors = ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'];

  return (
    <div style={{ height }} className="flex flex-col justify-end">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={`grid-${y}`} x1="0" y1={100 - y} x2="100" y2={100 - y} stroke="#e5e7eb" strokeWidth="0.3" />
        ))}
        
        {/* Bars */}
        {data.values.map((value, i) => {
          const barWidth = 100 / (data.values.length * 1.5);
          const barX = (i * (100 / data.values.length)) + (100 / data.values.length - barWidth) / 2;
          const barHeight = (value / maxValue) * 85;
          
          return (
            <g key={`bar-${i}`}>
              <rect
                x={barX}
                y={100 - barHeight}
                width={barWidth}
                height={barHeight}
                fill={colors[i % colors.length]}
              />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 w-full px-2">
        {data.labels.map((label, i) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
};

const DoughnutChart = ({ data, title, size = 200 }) => {
  const total = data.values.reduce((a, b) => a + b, 0);
  const colors = ['#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];
  
  let currentAngle = -90;
  const slices = data.labels.map((label, i) => {
    const sliceAngle = (data.values[i] / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const innerR = 35;
    const outerR = 50;
    
    const x1 = 50 + outerR * Math.cos(startRad);
    const y1 = 50 + outerR * Math.sin(startRad);
    const x2 = 50 + outerR * Math.cos(endRad);
    const y2 = 50 + outerR * Math.sin(endRad);
    
    const x3 = 50 + innerR * Math.cos(endRad);
    const y3 = 50 + innerR * Math.sin(endRad);
    const x4 = 50 + innerR * Math.cos(startRad);
    const y4 = 50 + innerR * Math.sin(startRad);
    
    const largeArc = sliceAngle > 180 ? 1 : 0;
    
    const path = `M ${x4} ${y4} L ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    
    const result = {
      path,
      color: colors[i % colors.length],
      label,
      value: data.values[i],
      percentage: ((data.values[i] / total) * 100).toFixed(1)
    };
    
    currentAngle = endAngle;
    return result;
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {slices.map((slice, i) => (
          <path key={`slice-${i}`} d={slice.path} fill={slice.color} stroke="white" strokeWidth="1" />
        ))}
      </svg>
      <div className="mt-4 space-y-2 w-full">
        {slices.map((slice, i) => (
          <div key={`legend-${i}`} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
              <span>{slice.label}</span>
            </div>
            <span className="font-medium">{slice.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsModule = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('standard'); // 'standard' or 'dynamic'

  // Dummy Data for Standard Assessments
  const standardAssessmentsData = {
    stressLevels: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      values: [6.2, 5.8, 7.1, 6.5, 5.9]
    },
    anxietyDepression: {
      labels: ['Normal', 'Mild', 'Moderate', 'Severe'],
      values: [45, 28, 18, 9]
    },
    riskAlerts: {
      labels: ['Green', 'Yellow', 'Red'],
      values: [78, 15, 7]
    }
  };

  // Dummy Data for Dynamic Forms - Category Based
  const dynamicFormsData = [
    {
      category: 'Exam Stress Index',
      description: 'Aggregated data from exam-related questions',
      trend: 'up',
      chart: 'line',
      data: {
        labels: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'],
        values: [5.2, 6.1, 6.8, 7.2, 7.5]
      },
      questions: [
        { text: 'Rate your exam stress', responses: [3, 2, 5, 4, 6] },
        { text: 'How overwhelmed do you feel?', responses: [2, 3, 4, 5, 5] },
        { text: 'Are you able to focus on studies?', responses: [7, 6, 5, 4, 3] }
      ]
    },
    {
      category: 'Sleep Health',
      description: 'Sleep quality and duration analysis',
      trend: 'down',
      chart: 'bar',
      data: {
        labels: ['Excellent', 'Good', 'Fair', 'Poor'],
        values: [22, 35, 28, 15]
      },
      questions: [
        { text: 'How well did you sleep?', responses: [8, 7, 6, 5, 4] },
        { text: 'Hours slept (average)', responses: [7, 7, 6, 6, 5] }
      ]
    },
    {
      category: 'Emotional Wellness',
      description: 'Emotional state and mood tracking',
      trend: 'stable',
      chart: 'doughnut',
      data: {
        labels: ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad'],
        values: [25, 35, 28, 10, 2]
      },
      questions: [
        { text: 'How would you rate your mood?', responses: [4, 4, 3, 3, 2] },
        { text: 'Are you feeling overwhelmed?', responses: [2, 2, 3, 4, 4] }
      ]
    },
    {
      category: 'Social Connectivity',
      description: 'Social interaction and relationships',
      trend: 'up',
      chart: 'bar',
      data: {
        labels: ['Very Connected', 'Connected', 'Neutral', 'Isolated'],
        values: [18, 42, 28, 12]
      },
      questions: [
        { text: 'Do you feel connected with peers?', responses: [4, 4, 3, 2] }
      ]
    },
    {
      category: 'Burnout Index',
      description: 'Exhaustion and overload assessment',
      trend: 'down',
      chart: 'line',
      data: {
        labels: ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'],
        values: [6.5, 6.8, 7.1, 6.5, 5.8]
      },
      questions: [
        { text: 'Do you feel burnt out?', responses: [4, 5, 5, 4, 3] },
        { text: 'Energy levels (1-10)', responses: [4, 3, 3, 4, 5] }
      ]
    },
    {
      category: 'Productivity Score',
      description: 'Work/study efficiency and output',
      trend: 'up',
      chart: 'bar',
      data: {
        labels: ['Very High', 'High', 'Medium', 'Low'],
        values: [15, 38, 35, 12]
      },
      questions: [
        { text: 'Rate your productivity today', responses: [6, 7, 5, 4] }
      ]
    }
  ];

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-red-600';
    if (trend === 'down') return 'text-green-600';
    return 'text-yellow-600';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('standard')}
          className={`pb-2 px-4 font-medium transition-all ${
            activeTab === 'standard'
              ? `border-b-2 border-cyan-500 ${theme.colors.text}`
              : theme.colors.muted
          }`}
        >
          {t('standardAssessments')}
        </button>
        <button
          onClick={() => setActiveTab('dynamic')}
          className={`pb-2 px-4 font-medium transition-all ${
            activeTab === 'dynamic'
              ? `border-b-2 border-cyan-500 ${theme.colors.text}`
              : theme.colors.muted
          }`}
        >
          {t('dynamicFormsAnalytics')}
        </button>
      </div>

      {/* Standard Assessments Analytics */}
      {activeTab === 'standard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stress Levels Chart */}
            <Card className={`${theme.colors.card} border-0 shadow-xl`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme.colors.text}`}>
                  <TrendingUp className="w-5 h-5 mr-2 text-cyan-500" />
                  Stress Levels Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={standardAssessmentsData.stressLevels} height={250} />
                <div className="mt-4 pt-4 border-t">
                  <p className={`text-sm ${theme.colors.muted}`}>Average: 6.3/10</p>
                  <Badge className="mt-2 bg-yellow-100 text-yellow-800">Moderate</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Anxiety/Depression Distribution */}
            <Card className={`${theme.colors.card} border-0 shadow-xl`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme.colors.text}`}>
                  <Activity className="w-5 h-5 mr-2 text-orange-500" />
                  Anxiety/Depression Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DoughnutChart data={standardAssessmentsData.anxietyDepression} size={180} />
              </CardContent>
            </Card>

            {/* Risk Alerts */}
            <Card className={`${theme.colors.card} border-0 shadow-xl`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme.colors.text}`}>
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Risk Alert Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.colors.text}`}>Low Risk (Green)</span>
                      <span className="font-bold text-green-600">78 students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.colors.text}`}>Medium Risk (Yellow)</span>
                      <span className="font-bold text-yellow-600">15 students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${theme.colors.text}`}>High Risk (Red)</span>
                      <span className="font-bold text-red-600">7 students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '7%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Dynamic Forms Analytics */}
      {activeTab === 'dynamic' && (
        <div className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dynamicFormsData.map((item, idx) => (
              <Card
                key={idx}
                className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className={theme.colors.text}>{item.category}</CardTitle>
                      <p className={`text-sm ${theme.colors.muted} mt-1`}>
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-lg font-bold ${getTrendColor(item.trend)}`}>
                        {getTrendIcon(item.trend)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Chart Display */}
                  {item.chart === 'line' && (
                    <LineChart data={item.data} height={200} />
                  )}
                  {item.chart === 'bar' && (
                    <BarChart data={item.data} height={200} />
                  )}
                  {item.chart === 'doughnut' && (
                    <DoughnutChart data={item.data} size={150} />
                  )}
                </CardContent>
              </Card>
            ))}

          </div>

          {/* Coverage Explanation */}
        </div>
      )}
    </div>
  );
};

export default AnalyticsModule;
