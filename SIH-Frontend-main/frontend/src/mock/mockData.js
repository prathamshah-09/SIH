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
  {
    id: '1',
    date: '2024-01-15',
    type: 'daily-checkin',
    mood: 7,
    energy: 6,
    sleep: 7,
    notes: 'Feeling better today. Had a good morning walk.',
    gratitude: ['Sunny weather', 'Supportive friends', 'Good health']
  },
  {
    id: '2',
    date: '2024-01-14',
    type: 'affirmation',
    affirmation: 'I am capable of handling whatever comes my way today',
    reflection: 'This affirmation helped me feel more confident before my presentation'
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