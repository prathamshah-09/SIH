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
  },
  {
    id: 'bdi',
    name: 'BDI-II',
    title: 'Beck Depression Inventory II',
    description: 'A 21-item self-report instrument for assessing the severity of depression in adolescents and adults.',
    questions: [
      { id: 'bdi_q1', text: 'Sadness', type: 'likert', options: [
        { label: 'I do not feel sad', value: 0 },
        { label: 'I feel sad much of the time', value: 1 },
        { label: 'I am sad all the time', value: 2 },
        { label: 'I am so sad or unhappy that I cannot stand it', value: 3 }
      ]},
      { id: 'bdi_q2', text: 'Pessimism', type: 'likert', options: [
        { label: 'I am not discouraged about my future', value: 0 },
        { label: 'I feel more discouraged about my future than I used to', value: 1 },
        { label: 'I do not expect things to work out for me', value: 2 },
        { label: 'I expect the worst and my future is hopeless', value: 3 }
      ]},
      { id: 'bdi_q3', text: 'Past Failure', type: 'likert', options: [
        { label: 'I do not feel like a failure', value: 0 },
        { label: 'I have failed more than I should have', value: 1 },
        { label: 'As I look back, I see a lot of failures in my life', value: 2 },
        { label: 'I feel I am a total failure as a person', value: 3 }
      ]},
      { id: 'bdi_q4', text: 'Loss of Pleasure', type: 'likert', options: [
        { label: 'I get as much pleasure as I ever did', value: 0 },
        { label: 'I do not enjoy things as much as I used to', value: 1 },
        { label: 'I get very little pleasure from the things I used to enjoy', value: 2 },
        { label: 'I cannot get any pleasure from the things I used to enjoy', value: 3 }
      ]},
      { id: 'bdi_q5', text: 'Guilty Feelings', type: 'likert', options: [
        { label: 'I do not feel guilty', value: 0 },
        { label: 'I feel guilty over many things I have done or should have done', value: 1 },
        { label: 'I feel quite guilty most of the time', value: 2 },
        { label: 'I feel guilty all of the time', value: 3 }
      ]},
      { id: 'bdi_q6', text: 'Punishment Feelings', type: 'likert', options: [
        { label: 'I do not feel I am being punished', value: 0 },
        { label: 'I feel I may be punished', value: 1 },
        { label: 'I expect to be punished', value: 2 },
        { label: 'I feel I am being punished', value: 3 }
      ]},
      { id: 'bdi_q7', text: 'Self-Dislike', type: 'likert', options: [
        { label: 'I feel the same about myself as ever', value: 0 },
        { label: 'I have lost confidence in myself', value: 1 },
        { label: 'I am disappointed in myself', value: 2 },
        { label: 'I dislike myself', value: 3 }
      ]},
      { id: 'bdi_q8', text: 'Self-Accusation', type: 'likert', options: [
        { label: 'I do not blame myself', value: 0 },
        { label: 'I am more self-critical than I used to be', value: 1 },
        { label: 'I criticize myself for all my faults', value: 2 },
        { label: 'I blame myself for everything bad that happens', value: 3 }
      ]},
      { id: 'bdi_q9', text: 'Suicidal Thoughts or Wishes', type: 'likert', options: [
        { label: 'I do not have any thoughts of killing myself', value: 0 },
        { label: 'I have thoughts of killing myself, but would not carry them out', value: 1 },
        { label: 'I would like to kill myself', value: 2 },
        { label: 'I would kill myself if I had the chance', value: 3 }
      ]},
      { id: 'bdi_q10', text: 'Crying', type: 'likert', options: [
        { label: 'I do not cry more often than I used to', value: 0 },
        { label: 'I cry more often than I used to', value: 1 },
        { label: 'I cry much more often than I used to', value: 2 },
        { label: 'I cry all the time now', value: 3 }
      ]},
      { id: 'bdi_q11', text: 'Agitation', type: 'likert', options: [
        { label: 'I am no more irritated than usual', value: 0 },
        { label: 'I am more irritated than usual', value: 1 },
        { label: 'I am much more irritated than usual', value: 2 },
        { label: 'I am irritated all the time', value: 3 }
      ]},
      { id: 'bdi_q12', text: 'Loss of Interest', type: 'likert', options: [
        { label: 'I have not lost interest in other people or activities', value: 0 },
        { label: 'I am less interested in other people or things than before', value: 1 },
        { label: 'I have lost most of my interest in other people or things', value: 2 },
        { label: 'It is hard to get interested in anything', value: 3 }
      ]},
      { id: 'bdi_q13', text: 'Indecisiveness', type: 'likert', options: [
        { label: 'I make decisions about as well as I ever could', value: 0 },
        { label: 'I find it more difficult to make decisions', value: 1 },
        { label: 'I have much greater difficulty in making decisions', value: 2 },
        { label: 'I have trouble making any decisions', value: 3 }
      ]},
      { id: 'bdi_q14', text: 'Worthlessness', type: 'likert', options: [
        { label: 'I do not feel worthless', value: 0 },
        { label: 'I do not consider myself as worthwhile and useful as I used to', value: 1 },
        { label: 'I feel more worthless as compared to other people', value: 2 },
        { label: 'I feel utterly worthless', value: 3 }
      ]},
      { id: 'bdi_q15', text: 'Loss of Energy', type: 'likert', options: [
        { label: 'I have as much energy as ever', value: 0 },
        { label: 'I have less energy than I used to', value: 1 },
        { label: 'I have much less energy than I used to', value: 2 },
        { label: 'I do not have enough energy to do anything', value: 3 }
      ]},
      { id: 'bdi_q16', text: 'Change in Sleep Pattern', type: 'likert', options: [
        { label: 'I have not experienced any change in my sleeping', value: 0 },
        { label: 'I sleep somewhat more or less', value: 1 },
        { label: 'I sleep much more or much less', value: 2 },
        { label: 'I sleep most of the day or wake up 1-2 hours early', value: 3 }
      ]},
      { id: 'bdi_q17', text: 'Irritability', type: 'likert', options: [
        { label: 'I am no more irritable than usual', value: 0 },
        { label: 'I am more irritable than usual', value: 1 },
        { label: 'I am much more irritable than usual', value: 2 },
        { label: 'I am irritable all the time', value: 3 }
      ]},
      { id: 'bdi_q18', text: 'Change in Appetite', type: 'likert', options: [
        { label: 'I have not experienced any change in my appetite', value: 0 },
        { label: 'My appetite is somewhat less or greater than usual', value: 1 },
        { label: 'My appetite is much less or greater than usual', value: 2 },
        { label: 'I have no appetite at all or I want to eat all the time', value: 3 }
      ]},
      { id: 'bdi_q19', text: 'Concentration Difficulty', type: 'likert', options: [
        { label: 'I can concentrate as well as ever', value: 0 },
        { label: 'I cannot concentrate as well as usual', value: 1 },
        { label: 'It is hard to keep my mind on anything', value: 2 },
        { label: 'I cannot concentrate on anything', value: 3 }
      ]},
      { id: 'bdi_q20', text: 'Tiredness or Fatigue', type: 'likert', options: [
        { label: 'I am no more tired or fatigued than usual', value: 0 },
        { label: 'I get more tired or fatigued more easily than usual', value: 1 },
        { label: 'I am too tired or fatigued to do most things', value: 2 },
        { label: 'I am too tired or fatigued to do anything', value: 3 }
      ]},
      { id: 'bdi_q21', text: 'Loss of Interest in Sex', type: 'likert', options: [
        { label: 'I have not noticed any recent change in interest in sex', value: 0 },
        { label: 'I am less interested in sex than I used to be', value: 1 },
        { label: 'I am much less interested in sex now', value: 2 },
        { label: 'I have lost interest in sex completely', value: 3 }
      ]}
    ]
  },
  {
    id: 'phq2',
    name: 'PHQ-2',
    title: 'Patient Health Questionnaire-2',
    description: 'A 2-item screening instrument for depression used in primary care settings.',
    questions: [
      { id: 'phq2_q1', text: 'Little interest or pleasure in doing things', type: 'likert', options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
      ]},
      { id: 'phq2_q2', text: 'Feeling down, depressed, or hopeless', type: 'likert', options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
      ]}
    ]
  },
  {
    id: 'gad2',
    name: 'GAD-2',
    title: 'Generalized Anxiety Disorder-2',
    description: 'A 2-item screening tool for generalized anxiety disorder in primary care.',
    questions: [
      { id: 'gad2_q1', text: 'Feeling nervous, anxious, or on edge', type: 'likert', options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
      ]},
      { id: 'gad2_q2', text: 'Not being able to stop or control worrying', type: 'likert', options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
      ]}
    ]
  },
  {
    id: 'mmse',
    name: 'MMSE',
    title: 'Mini-Mental State Examination',
    description: 'An 11-question screening test for cognitive impairment and dementia.',
    questions: [
      { id: 'mmse_q1', text: 'What is the year right now?', type: 'text', options: [] },
      { id: 'mmse_q2', text: 'What is the season?', type: 'text', options: [] },
      { id: 'mmse_q3', text: 'What is the date today?', type: 'text', options: [] },
      { id: 'mmse_q4', text: 'What is the day of the week?', type: 'text', options: [] },
      { id: 'mmse_q5', text: 'What is the month?', type: 'text', options: [] },
      { id: 'mmse_q6', text: 'What state are we in?', type: 'text', options: [] },
      { id: 'mmse_q7', text: 'What county are we in?', type: 'text', options: [] },
      { id: 'mmse_q8', text: 'What town or city are we in?', type: 'text', options: [] },
      { id: 'mmse_q9', text: 'What building are we in?', type: 'text', options: [] },
      { id: 'mmse_q10', text: 'What floor are we on?', type: 'text', options: [] },
      { id: 'mmse_q11', text: 'Attention and calculation: Spell WORLD backwards', type: 'text', options: [] }
    ]
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