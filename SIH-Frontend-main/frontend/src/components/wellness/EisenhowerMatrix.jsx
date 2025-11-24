import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Trash2, Plus, Grid3X3 } from 'lucide-react';

const EisenhowerMatrix = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [tasks, setTasks] = useState({
    urgent_important: [], // Do First
    not_urgent_important: [], // Schedule
    urgent_not_important: [], // Delegate
    not_urgent_not_important: [] // Eliminate
  });
  
  const [newTask, setNewTask] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState('urgent_important');

  const quadrants = [
    {
      id: 'urgent_important',
      title: 'Do First',
      subtitle: `${t('urgent')} & ${t('important')}`,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      textColor: 'text-red-700'
    },
    {
      id: 'not_urgent_important',
      title: 'Schedule',
      subtitle: `${t('notUrgent')} & ${t('important')}`,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700'
    },
    {
      id: 'urgent_not_important',
      title: 'Delegate',
      subtitle: `${t('urgent')} & ${t('notImportant')}`,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      id: 'not_urgent_not_important',
      title: 'Eliminate',
      subtitle: `${t('notUrgent')} & ${t('notImportant')}`,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'from-gray-50 to-gray-100',
      textColor: 'text-gray-700'
    }
  ];

  const addTask = () => {
    if (newTask.trim()) {
      setTasks(prev => ({
        ...prev,
        [selectedQuadrant]: [...prev[selectedQuadrant], {
          id: Date.now(),
          text: newTask.trim(),
          createdAt: new Date()
        }]
      }));
      setNewTask('');
    }
  };

  const deleteTask = (quadrantId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [quadrantId]: prev[quadrantId].filter(task => task.id !== taskId)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <Card className={`${theme.colors.card} border-0 shadow-2xl`}>
      <CardHeader className="text-center">
        <CardTitle className={`flex items-center justify-center ${theme.colors.text} text-2xl`}>
          <Grid3X3 className="w-8 h-8 mr-3" />
          {t('eisenhowerMatrix')}
        </CardTitle>
        <p className={`${theme.colors.muted} mt-2`}>
          Prioritize tasks by urgency and importance
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add Task Section */}
        <div className={`p-6 rounded-xl bg-gradient-to-r ${theme.colors.secondary} border-2 border-dashed border-gray-300`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('taskPlaceholder')}
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-3"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedQuadrant}
                onChange={(e) => setSelectedQuadrant(e.target.value)}
                className={`px-4 py-3 rounded-lg border ${theme.colors.card} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {quadrants.map(quad => (
                  <option key={quad.id} value={quad.id}>
                    {quad.title}
                  </option>
                ))}
              </select>
              <Button
                onClick={addTask}
                className={`bg-gradient-to-r ${theme.colors.primary} hover:shadow-lg text-white px-6 transition-all duration-200 hover:scale-105`}
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('addTask')}
              </Button>
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quadrants.map((quadrant) => (
            <Card key={quadrant.id} className={`bg-gradient-to-br ${quadrant.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
              <CardHeader className="pb-3">
                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${quadrant.color} text-white rounded-full text-sm font-semibold mb-2`}>
                  {quadrant.title}
                </div>
                <p className={`text-sm ${quadrant.textColor} font-medium`}>
                  {quadrant.subtitle}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 min-h-[200px]">
                  {tasks[quadrant.id].length === 0 ? (
                    <p className={`text-center ${quadrant.textColor} opacity-60 py-8 text-sm`}>
                      No tasks yet. Add one above!
                    </p>
                  ) : (
                    tasks[quadrant.id].map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-3 bg-white/70 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
                      >
                        <span className={`flex-1 ${quadrant.textColor} text-sm font-medium`}>
                          {task.text}
                        </span>
                        <Button
                          onClick={() => deleteTask(quadrant.id, task.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <div className={`${theme.colors.card} p-6 rounded-xl border bg-gradient-to-r ${theme.colors.secondary}`}>
          <h4 className={`font-semibold ${theme.colors.text} mb-3`}>How to use the Eisenhower Matrix:</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-red-600 font-medium">🔴 Do First (Urgent + Important)</p>
              <p className={`text-sm ${theme.colors.muted}`}>Crisis, emergencies, deadline-driven projects</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium">🔵 Schedule (Important, Not Urgent)</p>
              <p className={`text-sm ${theme.colors.muted}`}>Long-term goals, planning, personal development</p>
            </div>
            <div>
              <p className="text-yellow-600 font-medium">🟡 Delegate (Urgent, Not Important)</p>
              <p className={`text-sm ${theme.colors.muted}`}>Interruptions, some emails, non-essential meetings</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">⚫ Eliminate (Not Urgent, Not Important)</p>
              <p className={`text-sm ${theme.colors.muted}`}>Time wasters, excessive social media, trivial activities</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EisenhowerMatrix;