// Real wellness content data for the platform

export const wellnessProblems = {
  anxiety: {
    id: 'anxiety',
    icon: '😰',
    color: 'text-blue-500',
    bgColor: 'from-blue-100 to-blue-50',
    tools: [/*'audios',*/ 'videos', 'books', 'journaling']
  },
  depression: {
    id: 'depression',
    icon: '😔',
    color: 'text-purple-500',
    bgColor: 'from-purple-100 to-purple-50',
    tools: [/*'audios',*/ 'videos', 'books', 'journaling']
  },
  burnout: {
    id: 'burnout',
    icon: '🔥',
    color: 'text-orange-500',
    bgColor: 'from-orange-100 to-orange-50',
    tools: [/*'audios',*/ 'videos', 'books', 'pomodoroTimer', 'eisenhowerMatrix']
  },
  sleepDisorders: {
    id: 'sleepDisorders',
    icon: '😴',
    color: 'text-indigo-500',
    bgColor: 'from-indigo-100 to-indigo-50',
    tools: [/*'audios',*/ 'videos', 'books']
  },
  academicStress: {
    id: 'academicStress',
    icon: '📚',
    color: 'text-green-500',
    bgColor: 'from-green-100 to-green-50',
    tools: [/*'audios',*/ 'videos', 'books', 'pomodoroTimer', 'eisenhowerMatrix']
  },
  socialIsolation: {
    id: 'socialIsolation',
    icon: '😞',
    color: 'text-pink-500',
    bgColor: 'from-pink-100 to-pink-50',
    tools: [/*'audios',*/ 'videos', 'books']
  }
};

export const wellnessContent = {
  anxiety: {
    audios: [
      {
        id: 1,
        title: "Deep Breathing for Anxiety Relief",
        duration: "10 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Guided deep breathing exercise to calm anxiety",
        language: "en"
      },
      {
        id: 2,
        title: "Ocean Waves Meditation",
        duration: "15 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Relaxing ocean sounds for anxiety relief",
        language: "en"
      },
      {
        id: 3,
        title: "चिंता के लिए ध्यान",
        duration: "12 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "हिंदी में चिंता राहत के लिए निर्देशित ध्यान",
        language: "hi"
      }
    ],
    videos: [
      {
        id: 1,
        title: "5-Minute Anxiety Relief Techniques",
        duration: "5:23",
        url: "https://www.youtube.com/embed/YRPh_GaiL8s",
        thumbnail: "https://img.youtube.com/vi/YRPh_GaiL8s/maxresdefault.jpg",
        language: "en",
        description: "Quick anxiety relief techniques you can do anywhere"
      },
      {
        id: 2,
        title: "चिंता से राहत के लिए योग",
        duration: "10:15",
        url: "https://www.youtube.com/embed/hJbRpHZr_d0",
        thumbnail: "https://img.youtube.com/vi/hJbRpHZr_d0/maxresdefault.jpg",
        language: "hi",
        description: "हिंदी में चिंता के लिए योग और श्वास तकनीक"
      },
      {
        id: 3,
        title: "اضطراب کے لیے سانس کی مشق",
        duration: "8:30",
        url: "https://www.youtube.com/embed/gz4G31LGyog",
        thumbnail: "https://img.youtube.com/vi/gz4G31LGyog/maxresdefault.jpg",
        language: "ur",
        description: "اردو میں اضطراب کے لیے سانس کی تکنیک"
      }
    ],
    books: [
      {
        id: 1,
        title: "The Anxiety and Phobia Workbook",
        author: "Edmund Bourne",
        rating: 4.8,
        pages: 464,
        coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
        description: "A comprehensive guide to overcoming anxiety and phobias",
        downloadUrl: "#"
      },
      {
        id: 2,
        title: "Feeling Good: The New Mood Therapy",
        author: "David D. Burns",
        rating: 4.6,
        pages: 736,
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
        description: "Clinically proven techniques for overcoming depression and anxiety",
        downloadUrl: "#"
      },
      {
        id: 3,
        title: "चिंता मुक्ति की राह",
        author: "डॉ. राम चंद्र",
        rating: 4.5,
        pages: 280,
        coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
        description: "हिंदी में चिंता से मुक्ति के प्रभावी तरीके",
        downloadUrl: "#"
      }
    ]
  },
  depression: {
    audios: [
      {
        id: 1,
        title: "Mindfulness for Depression",
        duration: "20 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Guided mindfulness meditation for depression",
        language: "en"
      },
      {
        id: 2,
        title: "Uplifting Affirmations",
        duration: "15 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Positive affirmations to combat negative thoughts",
        language: "en"
      },
      {
        id: 3,
        title: "अवसाद के लिए ध्यान",
        duration: "18 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "हिंदी में अवसाद के लिए शांति ध्यान",
        language: "hi"
      }
    ],
    videos: [
      {
        id: 1,
        title: "Understanding Depression - What You Need to Know",
        duration: "12:45",
        url: "https://www.youtube.com/embed/z-IR48Mb3W0",
        thumbnail: "https://img.youtube.com/vi/z-IR48Mb3W0/maxresdefault.jpg",
        language: "en",
        description: "Educational video about depression and coping strategies"
      },
      {
        id: 2,
        title: "अवसाद से कैसे निपटें",
        duration: "15:20",
        url: "https://www.youtube.com/embed/XiCrniLQGYc",
        thumbnail: "https://img.youtube.com/vi/XiCrniLQGYc/maxresdefault.jpg",
        language: "hi",
        description: "हिंदी में अवसाद से निपटने के तरीके"
      },
      {
        id: 3,
        title: "افسردگی سے نکلنے کے طریقے",
        duration: "11:30",
        url: "https://www.youtube.com/embed/zTdHFj7UKr8",
        thumbnail: "https://img.youtube.com/vi/zTdHFj7UKr8/maxresdefault.jpg",
        language: "ur",
        description: "اردو میں افسردگی سے نکلنے کے مؤثر طریقے"
      }
    ],
    books: [
      {
        id: 1,
        title: "The Depression Cure",
        author: "Stephen Ilardi",
        rating: 4.7,
        pages: 352,
        coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
        description: "The 6-step program to beat depression without drugs",
        downloadUrl: "#"
      },
      {
        id: 2,
        title: "Mind Over Mood",
        author: "Dennis Greenberger",
        rating: 4.8,
        pages: 448,
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
        description: "Cognitive therapy techniques for depression",
        downloadUrl: "#"
      }
    ]
  },
  burnout: {
    audios: [
      {
        id: 1,
        title: "Burnout Recovery Meditation",
        duration: "25 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Guided meditation for recovering from burnout",
        language: "en"
      },
      {
        id: 2,
        title: "Energy Restoration",
        duration: "20 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Meditation to restore your energy and motivation",
        language: "en"
      }
    ],
    videos: [
      {
        id: 1,
        title: "How to Recover from Burnout",
        duration: "18:45",
        url: "https://www.youtube.com/embed/jqOkTPcTLhc",
        thumbnail: "https://img.youtube.com/vi/jqOkTPcTLhc/maxresdefault.jpg",
        language: "en",
        description: "Practical strategies to recover from burnout"
      },
      {
        id: 2,
        title: "बर्नआउट से कैसे उबरें",
        duration: "14:20",
        url: "https://www.youtube.com/embed/jN7mhP5gKWE",
        thumbnail: "https://img.youtube.com/vi/jN7mhP5gKWE/maxresdefault.jpg",
        language: "hi",
        description: "हिंदी में बर्नआउट से निकलने के उपाय"
      }
    ],
    books: [
      {
        id: 1,
        title: "Burnout: The Secret to Unlocking the Stress Cycle",
        author: "Emily Nagoski",
        rating: 4.6,
        pages: 304,
        coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
        description: "Science-based approach to overcoming burnout",
        downloadUrl: "#"
      }
    ]
  },
  sleepDisorders: {
    audios: [
      {
        id: 1,
        title: "Sleep Meditation",
        duration: "30 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Gentle meditation to help you fall asleep",
        language: "en"
      },
      {
        id: 2,
        title: "Rain Sounds for Sleep",
        duration: "60 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Natural rain sounds for better sleep",
        language: "en"
      },
      {
        id: 3,
        title: "नींद के लिए ध्यान",
        duration: "25 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "हिंदी में गहरी नींद के लिए ध्यान",
        language: "hi"
      }
    ],
    videos: [
      {
        id: 1,
        title: "Sleep Hygiene: Tips for Better Sleep",
        duration: "10:30",
        url: "https://www.youtube.com/embed/nm1TxQj9IsQ",
        thumbnail: "https://img.youtube.com/vi/nm1TxQj9IsQ/maxresdefault.jpg",
        language: "en",
        description: "Expert tips for improving sleep quality"
      },
      {
        id: 2,
        title: "अच्छी नींद के लिए योग",
        duration: "15:45",
        url: "https://www.youtube.com/embed/BiWnaZ2nAzo",
        thumbnail: "https://img.youtube.com/vi/BiWnaZ2nAzo/maxresdefault.jpg",
        language: "hi",
        description: "हिंदी में नींद के लिए योग आसन"
      },
      {
        id: 3,
        title: "نیند کے لیے مؤثر طریقے",
        duration: "12:15",
        url: "https://www.youtube.com/embed/EiYm20F9WXU",
        thumbnail: "https://img.youtube.com/vi/EiYm20F9WXU/maxresdefault.jpg",
        language: "ur",
        description: "اردو میں بہتر نیند کے لیے تکنیک"
      }
    ],
    books: [
      {
        id: 1,
        title: "Why We Sleep",
        author: "Matthew Walker",
        rating: 4.8,
        pages: 360,
        coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
        description: "The science of sleep and dreams",
        downloadUrl: "#"
      },
      {
        id: 2,
        title: "The Sleep Solution",
        author: "W. Chris Winter",
        rating: 4.5,
        pages: 304,
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
        description: "Why your sleep is broken and how to fix it",
        downloadUrl: "#"
      }
    ]
  },
  academicStress: {
    audios: [
      {
        id: 1,
        title: "Study Stress Relief",
        duration: "15 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Meditation to reduce academic stress",
        language: "en"
      },
      {
        id: 2,
        title: "Focus Enhancement",
        duration: "20 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Guided meditation to improve concentration",
        language: "en"
      }
    ],
    videos: [
      {
        id: 1,
        title: "How to Manage Academic Stress",
        duration: "16:20",
        url: "https://www.youtube.com/embed/JVZC5GlyfP4",
        thumbnail: "https://img.youtube.com/vi/JVZC5GlyfP4/maxresdefault.jpg",
        language: "en",
        description: "Effective strategies for managing study stress"
      },
      {
        id: 2,
        title: "पढ़ाई का तनाव कैसे कम करें",
        duration: "13:45",
        url: "https://www.youtube.com/embed/sTJ7AzBIJoI",
        thumbnail: "https://img.youtube.com/vi/sTJ7AzBIJoI/maxresdefault.jpg",
        language: "hi",
        description: "हिंदी में अकादमिक तनाव प्रबंधन"
      }
    ],
    books: [
      {
        id: 1,
        title: "The Study Skills Handbook",
        author: "Stella Cottrell",
        rating: 4.7,
        pages: 416,
        coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
        description: "Essential study skills for academic success",
        downloadUrl: "#"
      }
    ]
  },
  socialIsolation: {
    audios: [
      {
        id: 1,
        title: "Connection Meditation",
        duration: "18 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Meditation to feel more connected to others",
        language: "en"
      },
      {
        id: 2,
        title: "Self-Compassion Practice",
        duration: "22 min",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        description: "Loving-kindness meditation for self-acceptance",
        language: "en"
      }
    ],
    videos: [
      {
        id: 1,
        title: "Overcoming Loneliness and Social Isolation",
        duration: "14:30",
        url: "https://www.youtube.com/embed/P6lEtC8Skkg",
        thumbnail: "https://img.youtube.com/vi/P6lEtC8Skkg/maxresdefault.jpg",
        language: "en",
        description: "Practical tips to overcome loneliness"
      },
      {
        id: 2,
        title: "अकेलेपन से कैसे निपटें",
        duration: "11:45",
        url: "https://www.youtube.com/embed/j7E8wLzLB6w",
        thumbnail: "https://img.youtube.com/vi/j7E8wLzLB6w/maxresdefault.jpg",
        language: "hi",
        description: "हिंदी में अकेलेपन से निकलने के तरीके"
      },
      {
        id: 3,
        title: "تنہائی سے کیسے نکلیں",
        duration: "13:20",
        url: "https://www.youtube.com/embed/oBu-pQG6sTY",
        thumbnail: "https://img.youtube.com/vi/oBu-pQG6sTY/maxresdefault.jpg",
        language: "ur",
        description: "اردو میں سماجی تنہائی سے نکلنے کے طریقے"
      }
    ],
    books: [
      {
        id: 1,
        title: "Together: The Healing Power of Human Connection",
        author: "Vivek Murthy",
        rating: 4.6,
        pages: 352,
        coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
        description: "Understanding and overcoming loneliness",
        downloadUrl: "#"
      },
      {
        id: 2,
        title: "The Lonely Century",
        author: "Noreena Hertz",
        rating: 4.4,
        pages: 352,
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
        description: "How to restore human connection in a disconnected world",
        downloadUrl: "#"
      }
    ]
  }
};