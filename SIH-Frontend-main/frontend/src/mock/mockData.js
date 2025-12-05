// Mock data for the mental health support platform

export const mockUsers = {
  student: {
    id: '1',
    email: 'student@example.com',
    password: 'password',
    role: 'student',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  counsellor: {
    id: '2',
    email: 'counsellor@example.com',
    password: 'password',
    role: 'counsellor',
    name: 'Dr. Sarah Smith',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
  },
  admin: {
    id: '3',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
};

export const mockAnnouncements = [
  {
    id: '1',
    title: 'New Meditation Sessions Available',
    content: 'We have added new guided meditation sessions for anxiety and stress relief. Check them out in the relaxing content section.',
    date: '2024-01-15',
    type: 'info'
  },
  {
    id: '2',
    title: 'Mental Health Awareness Week',
    content: 'Join us for Mental Health Awareness Week with special workshops and group sessions.',
    date: '2024-01-12',
    type: 'event'
  }
];

export const mockAppointments = [
  {
    id: '1',
    studentName: 'Alex Johnson',
    counsellorName: 'Dr. Sarah Smith',
    date: '2024-01-20',
    time: '10:00 AM',
    status: 'pending',
    type: 'individual'
  },
  {
    id: '2',
    studentName: 'Emma Davis',
    counsellorName: 'Dr. Sarah Smith',
    date: '2024-01-22',
    time: '2:00 PM',
    status: 'confirmed',
    type: 'group'
  }
];

export const mockCounsellors = [
  {
    id: '2',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@example.com',
    specialization: 'Anxiety & Stress Management',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    isAvailable: true
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'james.wilson@example.com',
    specialization: 'Depression Support',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isAvailable: true
  },
  {
    id: '5',
    name: 'Dr. Emily Chen',
    email: 'emily.chen@example.com',
    specialization: 'Academic Stress',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isAvailable: false
  }
];

export const mockCommunityChats = [
  {
    id: '1',
    name: 'Anxiety Support Group',
    description: 'A safe space to share experiences and coping strategies for anxiety',
    members: 45,
    lastActive: '2024-01-15T10:30:00Z',
    isActive: true
  },
  {
    id: '2',
    name: 'Academic Stress Relief',
    description: 'Discussing study techniques and managing academic pressure',
    members: 32,
    lastActive: '2024-01-15T09:15:00Z',
    isActive: true
  },
  {
    id: '3',
    name: 'Sleep Support Circle',
    description: 'Tips and support for better sleep habits and overcoming insomnia',
    members: 28,
    lastActive: '2024-01-14T22:45:00Z',
    isActive: true
  }
];

export const mockRelaxingContent = [
  {
    id: '1',
    title: 'Ocean Waves Meditation',
    type: 'audio',
    duration: '15 min',
    category: 'meditation',
    url: 'https://example.com/ocean-waves.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Forest Rain Sounds',
    type: 'audio',
    duration: '30 min',
    category: 'nature-sounds',
    url: 'https://example.com/forest-rain.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Gentle Yoga for Anxiety',
    type: 'video',
    duration: '20 min',
    category: 'yoga',
    url: 'https://example.com/gentle-yoga.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop'
  }
];

export const mockSelfHelpBooks = [
  {
    id: '1',
    title: 'Mindfulness for Beginners',
    author: 'Jon Kabat-Zinn',
    category: 'mindfulness',
    rating: 4.8,
    pages: 168,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop',
    description: 'A comprehensive guide to starting your mindfulness journey'
  },
  {
    id: '2',
    title: 'The Anxiety and Worry Workbook',
    author: 'David A. Clark',
    category: 'anxiety',
    rating: 4.6,
    pages: 272,
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    description: 'Practical exercises to overcome anxiety and excessive worry'
  }
];

export const mockJournalEntries = [
  // Past entries for streak calculation (consecutive days from today Nov 29)
  {
    id: '1',
    dateKey: '2025-11-29_daily',
    type: 'daily',
    liked: 'Completed all my tasks on time',
    disliked: 'Couldn\'t find time to exercise',
    reflection: 'I realized that consistency matters more than perfection',
    goals: 'Start the day with a 15-minute workout tomorrow',
    mood: 'Productive and slightly tired',
    timestamp: '2025-11-29T15:30:00Z'
  },
  {
    id: '2',
    dateKey: '2025-11-28_daily',
    type: 'daily',
    liked: 'Had a great conversation with a friend',
    disliked: 'Procrastinated on studying',
    reflection: 'Social connections are important for my mental health',
    goals: 'Dedicate 2 hours to focused study tomorrow',
    mood: 'Anxious about upcoming exams',
    timestamp: '2025-11-28T20:15:00Z'
  },
  {
    id: '3',
    dateKey: '2025-11-27_daily',
    type: 'daily',
    liked: 'Received positive feedback on my project',
    disliked: 'Had conflict with a family member',
    reflection: 'I need to work on my communication skills',
    goals: 'Practice active listening in conversations',
    mood: 'Mixed emotions - proud but conflicted',
    timestamp: '2025-11-27T19:45:00Z'
  },
  {
    id: '4',
    dateKey: '2025-11-26_weekly',
    type: 'weekly',
    review: 'This week was challenging but rewarding. I managed to maintain my workout routine and completed most of my assignments. Had some conflicts that I need to resolve.',
    nextGoals: 'Focus on better sleep schedule, practice meditation for 10 minutes daily, and resolve pending conflicts with patience',
    timestamp: '2025-11-26T21:00:00Z'
  },
  {
    id: '5',
    dateKey: '2025-11-26_daily',
    type: 'daily',
    liked: 'Completed a difficult assignment successfully',
    disliked: 'Felt overwhelmed with workload',
    reflection: 'Breaking tasks into smaller chunks helps reduce anxiety',
    goals: 'Create a detailed schedule for next week',
    mood: 'Overwhelmed but accomplished',
    timestamp: '2025-11-26T18:30:00Z'
  },
  {
    id: '6',
    dateKey: '2025-11-25_daily',
    type: 'daily',
    liked: 'Spent quality time outdoors',
    disliked: 'Skipped my meditation session',
    reflection: 'Nature has a calming effect on my mind',
    goals: 'Maintain my meditation habit consistently',
    mood: 'Calm and relaxed',
    timestamp: '2025-11-25T17:20:00Z'
  },
  {
    id: '7',
    dateKey: '2025-11-24_worry',
    type: 'worry',
    negativeThought: 'I\'m not good enough for this job. Everyone else seems so competent.',
    positiveReframe: 'I have valuable skills and experience. I\'ve overcome challenges before and I can do this too.',
    geminiReframe: 'Everyone feels inadequate sometimes. This is an opportunity to learn and grow. Focus on what you can control and celebrate small wins.',
    timestamp: '2025-11-24T22:00:00Z'
  },
  {
    id: '8',
    dateKey: '2025-11-24_daily',
    type: 'daily',
    liked: 'Made progress on a long-term goal',
    disliked: 'Felt anxious about my performance',
    reflection: 'Imposter syndrome is common but doesn\'t define my abilities',
    goals: 'Seek feedback and focus on continuous improvement',
    mood: 'Anxious but determined',
    timestamp: '2025-11-24T20:15:00Z'
  },
  {
    id: '9',
    dateKey: '2025-11-23_daily',
    type: 'daily',
    liked: 'Had lunch with family and felt connected',
    disliked: 'Got upset over a small misunderstanding',
    reflection: 'Communication is key to resolving conflicts quickly',
    goals: 'Practice expressing emotions more clearly',
    mood: 'Happy and peaceful',
    timestamp: '2025-11-23T19:00:00Z'
  },
  {
    id: '10',
    dateKey: '2025-11-22_daily',
    type: 'daily',
    liked: 'Started reading a new book I\'ve been meaning to read',
    disliked: 'Didn\'t get enough sleep',
    reflection: 'Sleep is crucial for maintaining mental health',
    goals: 'Set a consistent sleep schedule',
    mood: 'Tired but inspired',
    timestamp: '2025-11-22T23:30:00Z'
  },
  {
    id: '11',
    dateKey: '2025-11-21_weekly',
    type: 'weekly',
    review: 'Last week taught me the importance of self-care and boundaries. I accomplished three major tasks and felt more balanced than usual.',
    nextGoals: 'Continue with self-care routine, practice saying no to excessive commitments, spend more time on hobbies',
    timestamp: '2025-11-21T20:45:00Z'
  }
];

export const mockStudents = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    joinDate: '2023-12-01',
    lastSession: '2024-01-14',
    status: 'active',
    riskLevel: 'low',
    notes: 'Making good progress with anxiety management techniques'
  },
  {
    id: '2',
    name: 'Emma Davis',
    email: 'emma@example.com',
    joinDate: '2023-11-15',
    lastSession: '2024-01-13',
    status: 'active',
    riskLevel: 'medium',
    notes: 'Struggling with academic stress, needs additional support'
  }
];

export const mockAnalytics = {
  totalUsers: 1247,
  activeUsers: 892,
  totalSessions: 3421,
  averageSessionDuration: '25 min',
  mostUsedFeatures: [
    { name: 'Chatbot', usage: 78 },
    { name: 'Relaxing Content', usage: 65 },
    { name: 'Journaling', usage: 52 },
    { name: 'Community Chats', usage: 43 }
  ],
  weeklyTrends: [
    { day: 'Mon', users: 156 },
    { day: 'Tue', users: 198 },
    { day: 'Wed', users: 167 },
    { day: 'Thu', users: 203 },
    { day: 'Fri', users: 178 },
    { day: 'Sat', users: 134 },
    { day: 'Sun', users: 112 }
  ]
};

export const mockChatMessages = [
  {
    id: '1',
    sender: 'bot',
    message: 'Hello! I\'m here to support you. How are you feeling today?',
    timestamp: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    sender: 'user',
    message: 'I\'ve been feeling quite anxious lately.',
    timestamp: '2024-01-15T10:01:00Z'
  },
  {
    id: '3',
    sender: 'bot',
    message: 'I understand that anxiety can be challenging. Would you like to try a quick breathing exercise or talk about what\'s causing these feelings?',
    timestamp: '2024-01-15T10:01:30Z'
  }
];

// Assessment forms
export const mockForms = [
  {
    id: 'phq9',
    name: 'PHQ-9',
    title: 'PHQ-9 Depression Assessment',
    description: 'A brief 9-item questionnaire to screen for depression severity over the past two weeks.',
    questions: [
      { id: 'phq9_q1', text: 'Little interest or pleasure in doing things', type: 'likert', options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
      ]},
      { id: 'phq9_q2', text: 'Feeling down, depressed, or hopeless', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'phq9_q3', text: 'Trouble falling or staying asleep, or sleeping too much', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'phq9_q4', text: 'Feeling tired or having little energy', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'phq9_q5', text: 'Poor appetite or overeating', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'phq9_q6', text: 'Feeling bad about yourself — or that you are a failure', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'phq9_q7', text: 'Trouble concentrating on things, such as reading or watching TV', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'phq9_q8', text: 'Moving or speaking so slowly that other people could have noticed, or the opposite', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'phq9_q9', text: 'Thoughts that you would be better off dead or of hurting yourself', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]}
    ]
  },
  {
    id: 'gad7',
    name: 'GAD-7',
    title: 'GAD-7 Anxiety Assessment',
    description: 'A 7-item scale for assessing generalized anxiety disorder symptoms.',
    questions: [
      { id: 'gad7_q1', text: 'Feeling nervous, anxious, or on edge', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'gad7_q2', text: 'Not being able to stop or control worrying', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'gad7_q3', text: 'Worrying too much about different things', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'gad7_q4', text: 'Trouble relaxing', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'gad7_q5', text: 'Being so restless that it is hard to sit still', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'gad7_q6', text: 'Becoming easily annoyed or irritable', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]},
      { id: 'gad7_q7', text: 'Feeling afraid as if something awful might happen', type: 'likert', options: [
        { label: 'Not at all', value: 0 },{ label: 'Several days', value: 1 },{ label: 'More than half the days', value: 2 },{ label: 'Nearly every day', value: 3 }
      ]}
    ]
  },
  {
    id: 'ghq12',
    name: 'GHQ-12',
    title: 'GHQ-12 General Health Questionnaire',
    description: 'A 12-item screening tool to detect psychiatric disorders and general psychological distress.',
    questions: Array.from({ length: 12 }).map((_, i) => ({
      id: `ghq12_q${i+1}`,
      text: `GHQ-12 item ${i+1}`,
      type: 'likert',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Same as usual', value: 1 },
        { label: 'More than usual', value: 2 },
        { label: 'Much more than usual', value: 3 }
      ]
    }))
  },
  {
    id: 'cssrs',
    name: 'C-SSRS',
    title: 'Columbia-Suicide Severity Rating Scale',
    description: 'A screening and rating scale to assess suicidal ideation and behavior.',
    questions: [
      { id: 'cssrs_q1', text: 'Have you wished you were dead or wished you could go to sleep and not wake up?', type: 'likert', options: [
        { label: 'No', value: 0 },
        { label: 'Yes', value: 1 }
      ]},
      { id: 'cssrs_q2', text: 'Have you actually had any thoughts of killing yourself?', type: 'likert', options: [
        { label: 'No', value: 0 },
        { label: 'Yes', value: 1 }
      ]},
      { id: 'cssrs_q3', text: 'Have you been thinking about how you might do this?', type: 'likert', options: [
        { label: 'No', value: 0 },
        { label: 'Yes', value: 1 }
      ]},
      { id: 'cssrs_q4', text: 'Have you ever tried to kill yourself?', type: 'likert', options: [
        { label: 'No', value: 0 },
        { label: 'Yes', value: 1 }
      ]},
      { id: 'cssrs_q5', text: 'If yes, how many times have you actually tried to harm yourself?', type: 'likert', options: [
        { label: 'None', value: 0 },
        { label: '1 time', value: 1 },
        { label: '2-3 times', value: 2 },
        { label: '4 or more times', value: 3 }
      ]}
    ]
  },
  {
    id: 'pss10',
    name: 'PSS-10',
    title: 'Perceived Stress Scale - 10',
    description: 'A 10-item scale measuring perceived stress levels.',
    questions: [
      { id: 'pss10_q1', text: 'In the last month, how often have you been upset because of something that happened unexpectedly?', type: 'likert', options: [
        { label: 'Never', value: 0 },
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 3 },
        { label: 'Very Often', value: 4 }
      ]},
      { id: 'pss10_q2', text: 'In the last month, how often have you felt unable to control the important things in your life?', type: 'likert', options: [
        { label: 'Never', value: 0 },
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 3 },
        { label: 'Very Often', value: 4 }
      ]},
      { id: 'pss10_q3', text: 'In the last month, how often have you felt nervous and "stressed"?', type: 'likert', options: [
        { label: 'Never', value: 0 },
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 3 },
        { label: 'Very Often', value: 4 }
      ]},
      { id: 'pss10_q4', text: 'In the last month, how often have you felt confident about your ability to handle your personal problems?', type: 'likert', options: [
        { label: 'Never', value: 4 },
        { label: 'Almost Never', value: 3 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 1 },
        { label: 'Very Often', value: 0 }
      ]},
      { id: 'pss10_q5', text: 'In the last month, how often have you felt that things were going your way?', type: 'likert', options: [
        { label: 'Never', value: 4 },
        { label: 'Almost Never', value: 3 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 1 },
        { label: 'Very Often', value: 0 }
      ]},
      { id: 'pss10_q6', text: 'In the last month, how often have you found that you could not cope with all the things that you had to do?', type: 'likert', options: [
        { label: 'Never', value: 0 },
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 3 },
        { label: 'Very Often', value: 4 }
      ]},
      { id: 'pss10_q7', text: 'In the last month, how often have you been able to control irritations in your life?', type: 'likert', options: [
        { label: 'Never', value: 4 },
        { label: 'Almost Never', value: 3 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 1 },
        { label: 'Very Often', value: 0 }
      ]},
      { id: 'pss10_q8', text: 'In the last month, how often have you felt that you were on top of things?', type: 'likert', options: [
        { label: 'Never', value: 4 },
        { label: 'Almost Never', value: 3 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 1 },
        { label: 'Very Often', value: 0 }
      ]},
      { id: 'pss10_q9', text: 'In the last month, how often have you been angered because of things outside your control?', type: 'likert', options: [
        { label: 'Never', value: 0 },
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 3 },
        { label: 'Very Often', value: 4 }
      ]},
      { id: 'pss10_q10', text: 'In the last month, how often have you felt difficulties were piling up so that you could not overcome them?', type: 'likert', options: [
        { label: 'Never', value: 0 },
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 3 },
        { label: 'Very Often', value: 4 }
      ]}
    ]
  },
  {
    id: 'who5',
    name: 'WHO-5',
    title: 'World Health Organization Well-Being Index',
    description: 'A 5-item measure of psychological well-being.',
    questions: [
      { id: 'who5_q1', text: 'I have felt cheerful and in good spirits', type: 'likert', options: [
        { label: 'At no time', value: 0 },
        { label: 'Some of the time', value: 1 },
        { label: 'Less than half the time', value: 2 },
        { label: 'More than half the time', value: 3 },
        { label: 'Most of the time', value: 4 },
        { label: 'All of the time', value: 5 }
      ]},
      { id: 'who5_q2', text: 'I have felt calm and relaxed', type: 'likert', options: [
        { label: 'At no time', value: 0 },
        { label: 'Some of the time', value: 1 },
        { label: 'Less than half the time', value: 2 },
        { label: 'More than half the time', value: 3 },
        { label: 'Most of the time', value: 4 },
        { label: 'All of the time', value: 5 }
      ]},
      { id: 'who5_q3', text: 'I have felt active and vigorous', type: 'likert', options: [
        { label: 'At no time', value: 0 },
        { label: 'Some of the time', value: 1 },
        { label: 'Less than half the time', value: 2 },
        { label: 'More than half the time', value: 3 },
        { label: 'Most of the time', value: 4 },
        { label: 'All of the time', value: 5 }
      ]},
      { id: 'who5_q4', text: 'I woke up feeling fresh and rested', type: 'likert', options: [
        { label: 'At no time', value: 0 },
        { label: 'Some of the time', value: 1 },
        { label: 'Less than half the time', value: 2 },
        { label: 'More than half the time', value: 3 },
        { label: 'Most of the time', value: 4 },
        { label: 'All of the time', value: 5 }
      ]},
      { id: 'who5_q5', text: 'My daily life has been filled with things that interest me', type: 'likert', options: [
        { label: 'At no time', value: 0 },
        { label: 'Some of the time', value: 1 },
        { label: 'Less than half the time', value: 2 },
        { label: 'More than half the time', value: 3 },
        { label: 'Most of the time', value: 4 },
        { label: 'All of the time', value: 5 }
      ]}
    ]
  },
  {
    id: 'iat',
    name: 'IAT',
    title: 'Internet Addiction Test',
    description: 'A 20-item test to measure internet addiction severity.',
    questions: [
      { id: 'iat_q1', text: 'How often do you find that you stay online longer than intended?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q2', text: 'How often do you neglect household chores to spend more time online?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q3', text: 'How often do you neglect sleep due to late-night internet use?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q4', text: 'How often do you form new relationships with fellow online users?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q5', text: 'Do others complain about the amount of time you spend online?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q6', text: 'How often do your grades or work suffer because of your internet use?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q7', text: 'How often do you check your email before something else that you need to do?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q8', text: 'How often does your job performance or productivity suffer because of internet use?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q9', text: 'How often do you become defensive or secretive when anyone asks you what you do online?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q10', text: 'How often do you block out disturbing thoughts about your life with soothing thoughts of the internet?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q11', text: 'How often do you anticipate your next online session?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q12', text: 'How often do you fear that life without the internet would be boring, empty, or joyless?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q13', text: 'How often do you snap, yell, or act annoyed if someone bothers you while you are online?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q14', text: 'How often do you lose sleep due to late-night internet surfing?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q15', text: 'How often do you feel preoccupied with the internet when offline?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q16', text: 'How often do you find yourself saying "just a few more minutes" when online?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q17', text: 'How often do you try to hide how much time you spend online?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q18', text: 'How often do you choose to spend more time online rather than going out with others?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q19', text: 'How often do you feel depressed, moody, or nervous when you are offline?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]},
      { id: 'iat_q20', text: 'How often do you stay online longer than you intended?', type: 'likert', options: [
        { label: 'Not applicable', value: 0 },
        { label: 'Rarely', value: 1 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 3 },
        { label: 'Very frequently', value: 4 },
        { label: 'Always', value: 5 }
      ]}
    ]
  },
  {
    id: 'psqi',
    name: 'PSQI',
    title: 'Pittsburgh Sleep Quality Index',
    description: 'A 19-item measure of sleep quality.',
    questions: [
      { id: 'psqi_q1', text: 'During the past month, when have you usually gone to bed at night?', type: 'text', options: [] },
      { id: 'psqi_q2', text: 'How long (in minutes) has it usually taken you to fall asleep each night?', type: 'text', options: [] },
      { id: 'psqi_q3', text: 'During the past month, when have you usually gotten up in the morning?', type: 'text', options: [] },
      { id: 'psqi_q4', text: 'How many hours of actual sleep did you get at night? (This may be different than the number of hours you spend in bed)', type: 'text', options: [] },
      { id: 'psqi_q5', text: 'Cannot get to sleep within 30 minutes', type: 'likert', options: [
        { label: 'Not during the past month', value: 0 },
        { label: 'Less than once a week', value: 1 },
        { label: 'Once or twice a week', value: 2 },
        { label: 'Three or more times a week', value: 3 }
      ]},
      { id: 'psqi_q6', text: 'Wake up in the middle of the night or early morning', type: 'likert', options: [
        { label: 'Not during the past month', value: 0 },
        { label: 'Less than once a week', value: 1 },
        { label: 'Once or twice a week', value: 2 },
        { label: 'Three or more times a week', value: 3 }
      ]},
      { id: 'psqi_q7', text: 'Have to get up to use the bathroom', type: 'likert', options: [
        { label: 'Not during the past month', value: 0 },
        { label: 'Less than once a week', value: 1 },
        { label: 'Once or twice a week', value: 2 },
        { label: 'Three or more times a week', value: 3 }
      ]},
      { id: 'psqi_q8', text: 'Cannot breathe comfortably', type: 'likert', options: [
        { label: 'Not during the past month', value: 0 },
        { label: 'Less than once a week', value: 1 },
        { label: 'Once or twice a week', value: 2 },
        { label: 'Three or more times a week', value: 3 }
      ]},
      { id: 'psqi_q9', text: 'Cough or snore loudly', type: 'likert', options: [
        { label: 'Not during the past month', value: 0 },
        { label: 'Less than once a week', value: 1 },
        { label: 'Once or twice a week', value: 2 },
        { label: 'Three or more times a week', value: 3 }
      ]},
      { id: 'psqi_q10', text: 'Feel too cold', type: 'likert', options: [
        { label: 'Not during the past month', value: 0 },
        { label: 'Less than once a week', value: 1 },
        { label: 'Once or twice a week', value: 2 },
        { label: 'Three or more times a week', value: 3 }
      ]},
      { id: 'psqi_q11', text: 'Feel too hot', type: 'likert', options: [
        { label: 'Not during the past month', value: 0 },
        { label: 'Less than once a week', value: 1 },
        { label: 'Once or twice a week', value: 2 },
        { label: 'Three or more times a week', value: 3 }
      ]},
      { id: 'psqi_q12', text: 'Have bad dreams', type: 'likert', options: [
        { label: 'Not during the past month', value: 0 },
        { label: 'Less than once a week', value: 1 },
        { label: 'Once or twice a week', value: 2 },
        { label: 'Three or more times a week', value: 3 }
      ]},
      { id: 'psqi_q13', text: 'Have pain', type: 'likert', options: [
        { label: 'Not during the past month', value: 0 },
        { label: 'Less than once a week', value: 1 },
        { label: 'Once or twice a week', value: 2 },
        { label: 'Three or more times a week', value: 3 }
      ]},
      { id: 'psqi_q14', text: 'Other reason, please describe', type: 'text', options: [] }
    ]
  },
  {
    id: 'bhi10',
    name: 'BHI-10',
    title: 'Behavioral Health Integration - 10 Item Questionnaire',
    description: 'A 10-item screening questionnaire for behavioral health issues.',
    questions: [
      { id: 'bhi10_q1', text: 'How would you describe your physical health?', type: 'likert', options: [
        { label: 'Poor', value: 4 },
        { label: 'Fair', value: 3 },
        { label: 'Good', value: 2 },
        { label: 'Very Good', value: 1 },
        { label: 'Excellent', value: 0 }
      ]},
      { id: 'bhi10_q2', text: 'How would you describe your mental or emotional health?', type: 'likert', options: [
        { label: 'Poor', value: 4 },
        { label: 'Fair', value: 3 },
        { label: 'Good', value: 2 },
        { label: 'Very Good', value: 1 },
        { label: 'Excellent', value: 0 }
      ]},
      { id: 'bhi10_q3', text: 'In the past 2 weeks, have you been bothered by feeling down, depressed, or hopeless?', type: 'likert', options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
      ]},
      { id: 'bhi10_q4', text: 'In the past 2 weeks, have you been bothered by little interest or pleasure in doing things?', type: 'likert', options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
      ]},
      { id: 'bhi10_q5', text: 'In the past 2 weeks, have you felt anxious or worried?', type: 'likert', options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
      ]},
      { id: 'bhi10_q6', text: 'Do you currently drink alcohol more than 7 drinks per week (for women) or more than 14 drinks per week (for men)?', type: 'likert', options: [
        { label: 'No', value: 0 },
        { label: 'Yes', value: 3 }
      ]},
      { id: 'bhi10_q7', text: 'Do you currently use tobacco products?', type: 'likert', options: [
        { label: 'No', value: 0 },
        { label: 'Yes, occasionally', value: 1 },
        { label: 'Yes, regularly', value: 2 }
      ]},
      { id: 'bhi10_q8', text: 'Have you experienced any significant life stressors in the past 6 months?', type: 'likert', options: [
        { label: 'No', value: 0 },
        { label: 'Yes, but manageable', value: 1 },
        { label: 'Yes, quite stressful', value: 2 },
        { label: 'Yes, extremely stressful', value: 3 }
      ]},
      { id: 'bhi10_q9', text: 'How satisfied are you with your current relationships?', type: 'likert', options: [
        { label: 'Very Unsatisfied', value: 3 },
        { label: 'Unsatisfied', value: 2 },
        { label: 'Satisfied', value: 1 },
        { label: 'Very Satisfied', value: 0 }
      ]},
      { id: 'bhi10_q10', text: 'How confident are you in your ability to manage your health?', type: 'likert', options: [
        { label: 'Not Confident', value: 3 },
        { label: 'Somewhat Confident', value: 2 },
        { label: 'Confident', value: 1 },
        { label: 'Very Confident', value: 0 }
      ]}
    ]
  },
  {
    id: 'ders18',
    name: 'DERS-18',
    title: 'Difficulties in Emotion Regulation Scale - 18',
    description: 'An 18-item measure of emotion regulation difficulties.',
    questions: [
      { id: 'ders18_q1', text: 'I am clear about my feelings', type: 'likert', options: [
        { label: 'Almost Never', value: 5 },
        { label: 'Sometimes', value: 4 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 2 },
        { label: 'Almost Always', value: 1 }
      ]},
      { id: 'ders18_q2', text: 'I pay attention to how I feel', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q3', text: 'I experience my emotions as overwhelming', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q4', text: 'I have no idea how I am feeling', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q5', text: 'I have difficulty making sense of my feelings', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q6', text: 'I am attentive to my feelings', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q7', text: 'When I am upset, I acknowledge my emotions', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q8', text: 'When I am upset, I become embarrassed about it', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q9', text: 'When I am upset, I have difficulty controlling my behaviors', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q10', text: 'When I am upset, I believe I will remain that way for a long time', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q11', text: 'When I am upset, I become angry at myself', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q12', text: 'When I am upset, I believe that I am bad or worthless', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q13', text: 'When I am upset, I believe that wallowing in it is all I can do', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q14', text: 'When I am upset, I feel ashamed', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q15', text: 'When I am upset, I have difficulty focusing on other things', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q16', text: 'When I am upset, I feel out of control', type: 'likert', options: [
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 4 },
        { label: 'Almost Always', value: 5 }
      ]},
      { id: 'ders18_q17', text: 'When I am upset, I can usually find a way to feel better', type: 'likert', options: [
        { label: 'Almost Never', value: 5 },
        { label: 'Sometimes', value: 4 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 2 },
        { label: 'Almost Always', value: 1 }
      ]},
      { id: 'ders18_q18', text: 'When I am upset, I accept my emotions', type: 'likert', options: [
        { label: 'Almost Never', value: 5 },
        { label: 'Sometimes', value: 4 },
        { label: 'About Half the Time', value: 3 },
        { label: 'Most of the Time', value: 2 },
        { label: 'Almost Always', value: 1 }
      ]}
    ]
  }
];

export const mockCounsellorResources = [
  {
    id: 'cbt_1',
    name: 'CBT Worksheet - Thought Records',
    category: 'cbt',
    description: 'Structured template for recording and challenging negative thoughts',
    fileType: 'pdf',
    uploadedDate: '2024-01-10',
    uploadedBy: 'Dr. Sarah Smith'
  },
  {
    id: 'mind_1',
    name: 'Mindfulness Guided Script',
    category: 'mindfulness',
    description: 'A 10-minute guided meditation script for anxiety relief',
    fileType: 'pdf',
    uploadedDate: '2024-01-12',
    uploadedBy: 'Dr. Sarah Smith'
  },
  {
    id: 'crisis_1',
    name: 'Crisis Response Protocol',
    category: 'crisis',
    description: 'Step-by-step emergency procedures and contact information',
    fileType: 'pdf',
    uploadedDate: '2024-01-08',
    uploadedBy: 'Dr. Sarah Smith'
  }
];