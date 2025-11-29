// Real wellness content data for the platform

export const wellnessProblems = {
  anxiety: {
    id: 'anxiety',
    icon: '',
    color: 'text-blue-500',
    tools: [/*'audios',*/ 'videos', 'books', 'journaling']
  },
  depression: {
    id: 'depression',
    icon: '',
    color: 'text-purple-500',
    tools: [/*'audios',*/ 'videos', 'books', 'journaling']
  },
  burnout: {
    id: 'burnout',
    icon: '',
    color: 'text-orange-500',
    tools: [/*'audios',*/ 'videos', 'books', 'pomodoroTimer', 'eisenhowerMatrix']
  },
  sleepDisorders: {
    id: 'sleepDisorders',
    icon: '',
    color: 'text-indigo-500',
    tools: [/*'audios',*/ 'videos', 'books']
  },
  academicStress: {
    id: 'academicStress',
    icon: '',
    color: 'text-green-500',
    tools: [/*'audios',*/ 'videos', 'books', 'pomodoroTimer', 'eisenhowerMatrix']
  },
  socialIsolation: {
    id: 'socialIsolation',
    icon: '',
    color: 'text-pink-500',
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
        title: "Overcoming Overwhelmness",
        duration: "11:57",
        url: "https://www.youtube.com/embed/b0EdU-mTkZA",
        thumbnail: "https://img.youtube.com/vi/b0EdU-mTkZA/maxresdefault.jpg",
        language: "en",
        description: "Practical ways to manage overwhelm, explained simply"
      },
      {
        id: 2,
        title: "ओवरथिंकिंग कैसे दूर करें?",
        duration: "12:30",
        url: "https://www.youtube.com/embed/m1RGFegL83c",
        thumbnail: "https://img.youtube.com/vi/m1RGFegL83c/maxresdefault.jpg",
        language: "hi",
        description: "ओवरथिंकिंग को रोककर मन को हल्का रखने का सरल तरीका।"
      },
      {
        id: 3,
        title: "اوور تھنکنگ پر قابو پانے کا بہترین طریقہ",
        duration: "9:32",
        url: "https://www.youtube.com/embed/XEebQk2ZOrM",
        thumbnail: "https://img.youtube.com/vi/XEebQk2ZOrM/hqdefault.jpg",
        language: "ur",
        description: "اوور تھنکنگ سے نجات کے لیے آسان اور مؤثر رہنمائی۔"
      },
      {
        id: 4,
        title: "Daily 10-Minute Tapping Exercise Routine for Energy & Anxiety Relief",
        duration: "10:44",
        url: "https://www.youtube.com/embed/9k9C58Q6veI",
        thumbnail: "https://img.youtube.com/vi/9k9C58Q6veI/maxresdefault.jpg",
        language: "en",
        description: "Guided tapping (EFT) routine aimed at boosting energy and reducing anxiety."
      },
      {
        id: 5,
        title: "5-4-3-2-1 ग्राउंडिंग तकनीक",
        duration: "2:44",
        url: "https://www.youtube.com/embed/pjRMg6KALiw",
        thumbnail: "https://img.youtube.com/vi/pjRMg6KALiw/maxresdefault.jpg",
        language: "hi",
        description: "विधि का उपयोग करके चिंता और तनाव को तुरंत कम करने वाली त्वरित ग्राउंडिंग एक्सरसाइज।"
      }
    ],
    books: [

      {
        id: 1,
        title: "The Anxiety & Worry Workbook: The Cognitive Behavioral Solution",
        author: "David A. Clark and Aaron T. Beck",
        rating: 4.15,
        pages: 294,
        coverUrl: "data:image/webp;base64,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",
        description: "practical, self‑help workbook grounded in evidence-based cognitive behavioral therapy",
        downloadUrl: "https://www.scribd.com/document/754428040/David-A-Clark-Aaron-T-Beck-The-Anxiety-and-Worry-Workbook-The-Cognitive-Behavioral-Solution-The-Guilford-Press-2023"
      },
      {
        id: 2,
        title: "मन की शक्तियां",
        author: "स्वामी विवेकानंद",
        rating: 4.1,
        pages: 64,
        coverUrl: "https://books.google.com/books/content?id=iOhZDwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        description: "एक प्रेरणादायक पुस्तक जो बताती है कि हमारा मन कितनी विराट शक्तियाँ रखता है",
        downloadUrl: "https://www.scribd.com/document/530617139/%E0%A4%B8-%E0%A4%B5%E0%A4%BE%E0%A4%AE%E0%A5%80-%E0%A4%B5%E0%A4%BF%E0%A4%B5%E0%A5%87%E0%A4%95%E0%A4%BE%E0%A4%A8%E0%A4%82%E0%A4%A6-%E0%A4%AE%E0%A4%A8-%E0%A4%95%E0%A5%80-%E0%A4%B6%E0%A4%95-%E0%A4%A4%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%82"
      },
      {
        id: 3,
        title: "زاویہ (Zavia)",
        author: "Ashfaq Ahmed",
        rating: 3.8,
        pages: 321,
        coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh4gd7km5qNd70SgWRpt_qMQJXlYiIyfNxMhVAJCKFoRdo9QVOsSSzgYF6lUkBB_E8NtW6XSq3SRomrPt3iZYrwM-52agdLoUfNCzI6g&s=10",
        description: "“زندگی، روحانیت، اخلاقیات اور انسانی تجربات پر فکر انگیز اور دل کو چھو لینے والی تحریریں",
        downloadUrl: "https://www.scribd.com/document/4820120/Zavia-1"
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
        title: "How To Deal With Depression?",
        duration: "8:41",
        url: "https://www.youtube.com/embed/TEwoWxLwCfA",
        thumbnail: "https://img.youtube.com/vi/TEwoWxLwCfA/maxresdefault.jpg",
        language: "en",
        description: "Educational video about depression and coping strategies"
      },
      {
        id: 2,
        title: "Sleep Healing | Louise Hay Affirmations",
        duration: "2:45:47",
        url: "https://www.youtube.com/embed/qSGpvEflHjM",
        thumbnail: "https://img.youtube.com/vi/qSGpvEflHjM/maxresdefault.jpg",
        language: "ur",
        description: "Quick self-help video aimed at positive thinking through simple awareness techniques"
      },
      {
        id: 3,
        title: "Music Therapy",
        duration: "1:39:40",
        url: "https://www.youtube.com/embed/gdvrYGEERPU",
        thumbnail: "https://img.youtube.com/vi/gdvrYGEERPU/maxresdefault.jpg",
        language: "ur",
        description:"जीवन में सकारात्मक सोच और ऊर्जा बढ़ाने वाला प्रेरक वीडियो।"
      },
      {
        id: 4,
        title: "How Mirror Technique Can Change Your Life",
        duration: "2:40",
        url: "https://www.youtube.com/embed/oV_QbqXXHD0",
        thumbnail: "https://img.youtube.com/vi/oV_QbqXXHD0/maxresdefault.jpg",
        language: "ur",
        description:"صرف 2 منٹ آئینے کے سامنے — خوداعتمادی بڑھانے، منفی خیالات ہٹانے اور مثبت توانائی حاصل کرنے کی تکنیک۔"
      }
    ],
    books: [
      {
        id: 1,
        title: "Overcoming Depression",
        author: "Lawrence E. Shapiro",
        rating: 4.0,
        pages: 113,
        coverUrl: "data:image/jpeg;base64,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",
        description: "A self-help manual that uses CBT-based strategies and techniques to help readers understand the causes of depression",
        downloadUrl: "https://www.adrian.edu/files/assets/overcomingdepressionworkbook.pdf?utm_source=chatgpt.com"
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
        duration: "6:18",
        url: "https://www.youtube.com/embed/qd_mRapoPtg",
        thumbnail: "https://img.youtube.com/vi/qd_mRapoPtg/maxresdefault.jpg",
        language: "en",
        description: "Practical strategies to recover from burnout"
      },
      {
        id: 2,
        title: "मन को रिलैक्स कैसे करें?",
        duration: "24:00",
        url: "https://www.youtube.com/embed/BYc4ipPBuaA",
        thumbnail: "https://img.youtube.com/vi/BYc4ipPBuaA/sddefault.jpg",
        language: "hi",
        description: "हिंदी में बर्नआउट से निकलने के उपाय"
      },
      {
        id: 3,
        title: "کیا آپ ہمیشہ تھکا ہوا محسوس کرتے ہیں؟",
        duration: "8:41",
        url: "https://www.youtube.com/embed/DzbTd9YuVpk",
        thumbnail: "https://img.youtube.com/vi/DzbTd9YuVpk/maxresdefault.jpg",
        language: "ur",
        description: "مسلسل تھکن، پٹھوں میں درد اور تھکاوٹ کی وجوہات اور ان سے نجات کے طریقے۔"
      },
      {
        id: 4,
        title: "Progressive Muscle Relaxation",
        duration: "21:30",
        url: "https://www.youtube.com/embed/AJAyxihadh4",
        thumbnail: "https://img.youtube.com/vi/AJAyxihadh4/maxresdefault.jpg",
        language: "en",
        description:"A quick, effective video aimed at improving mindset and self-belief through practical life-changing visualization and affirmations."
      },
      {
        id: 5,
        title: "https://youtu.be/Nt8rPyqarIY?si=7Gv8k8AZ6M46yhot",
        duration: "4:39",
        url: "https://www.youtube.com/embed/Nt8rPyqarIY",
        thumbnail: "https://img.youtube.com/vi/Nt8rPyqarIY/maxresdefault.jpg",
        language: "hi",
        description:"आपके जीवन या सोच को बदलने के लिए एक प्रेरणादायक या शिक्षात्मक संदेश देता है — देखिए और जानिए।"
      }
    ],
    books: [
      {
        id: 1,
        title: "Burnout: The Secret to Unlocking the Stress Cycle",
        author: "Emily Nagoski & Amelia Nagoski",
        rating: 3.93,
        pages: 304,
        coverUrl: "https://m.media-amazon.com/images/I/71zXJffIQUL.jpg",
        description: "A science-backed guide to breaking the stress cycle and reclaiming energy",
        downloadUrl: "https://books.google.com/books/about/Burnout.html?id=rOxsswEACAAJ"
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
        title: "अच्छी नींद के लिए 5 आसान तरीके",
        duration: "8:53",
        url: "https://www.youtube.com/embed/WHFS-H15gxc",
        thumbnail: "https://img.youtube.com/vi/WHFS-H15gxc/maxresdefault.jpg",
        language: "hi",
        description: "5 सरल और असरदार तरीके, जो आपको गहरी और आरामदायक नींद पाने में मदद करेंगे"
      },
      {
        id: 3,
        title: "نیند کے لیے مؤثر طریقے",
        duration: "12:15",
        url: "https://www.youtube.com/embed/EiYm20F9WXU",
        thumbnail: "https://img.youtube.com/vi/EiYm20F9WXU/maxresdefault.jpg",
        language: "ur",
        description: "اردو میں بہتر نیند کے لیے تکنیک"
      },
      {
        id: 4,
        title: "4-7-8 Calm Breathing Exercise",
        duration: "10:33",
        url: "https://www.youtube.com/embed/LiUnFJ8P4gM",
        thumbnail: "https://img.youtube.com/vi/LiUnFJ8P4gM/maxresdefault.jpg",
        language: "en",
        description:"A guided 10 minute breathing exercise that helps you relax, reduce anxiety, and calm your mind"
      },
      {
        id: 5,
        title: "Yoga Nidra in Urdu",
        duration: "14:59",
        url: "https://www.youtube.com/embed/UCqBR4CUFbQ",
        thumbnail: "https://img.youtube.com/vi/UCqBR4CUFbQ/maxresdefault.jpg",
        language: "ur",
        description: "ایک پرسکون “یوگا نِدرا” سیشن جو ذہن، جسم اور روح کو سکون اور توانائی بخشتا ہے۔"
      }
    ],
    books: [
      {
        id: 1,
        title: "अच्छी नींद, कैसे सोय",
        author: "स्वामी शिवानन्द",
        rating: 3.8,
        pages: 96,
        coverUrl: "data:image/jpeg;base64,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",
        description: "A book that tells you ways in which you can sleep well",
        downloadUrl: "https://gurudevsivananda.org/How-to-sleep-well.pdf"
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
        title: "How to Manage Stress as a Student",
        duration: "8:40",
        url: "https://www.youtube.com/embed/Bk2-dKH2Ta4",
        thumbnail: "https://img.youtube.com/vi/Bk2-dKH2Ta4/maxresdefault.jpg",
        language: "en",
        description: "Effective strategies for managing study stress"
      },
      {
        id: 2,
        title: "3 Tips to Avoid Distraction While Studying",
        duration: "12:49",
        url: "https://www.youtube.com/embed/yZf4j6p4JrY",
        thumbnail: "https://img.youtube.com/vi/yZf4j6p4JrY/maxresdefault.jpg",
        language: "hi",
        description: "पढ़ाई के दौरान ध्यान भटकने से बचने के 3 असरदार टिप्स|"
      },
      {
        id: 3,
        title: "How to stay focused?",
        duration: "13:45",
        url: "https://www.youtube.com/embed/BSg5EEsIZEY",
        thumbnail: "https://img.youtube.com/vi/BSg5EEsIZEY/maxresdefault.jpg",
        language: "ur",
        description: "توجہ برقرار رکھنے کے آسان طریقے — آپ کی فوکس کو بہتر بنائیں۔"
      },
      {
        id: 4,
        title: "Pomodoro Technique से 100% Focus",
        duration: "15:59",
        url: "https://www.youtube.com/embed/ZBk-rt1oHiM",
        thumbnail: "https://www.youtube.com/embed/ZBk-rt1oHiM",
        language: "hi",
        description: "पमोदोरो तकनीक से लंबी और फोकस्ड पढ़ाई के टिप्स।"
      },
      {
        id: 5,
        title: "Nadi Shodhana Pranayama",
        duration: "15:59",
        url: "https://www.youtube.com/embed/l11qFpRqhIQ",
        thumbnail: "https://img.youtube.com/vi/l11qFpRqhIQ/maxresdefault.jpg",
        language: "en",
        description: "A guided alternate‑nostril breathing exercise to calm the mind and balance energy."
      }
    ],
    books: [
      {
        id: 1,
        title: "The Stress Management",
        author: "EVA SELHUB",
        rating: 3.9,
        pages: 174,
        coverUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSExIWFRUXFyAaGBcYGB0dGBgaGBgXGhcbGhcbHSggGRslHhgXITEhJSorLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy4mICUtLS0wLS81LS0tLy0zLjUtMSstLS0tLS8tLTAwLS0tLS8tLi0uLy0tNy0tLS0tLTUtLf/AABEIAP8AxgMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAABQMEBgIBB//EAD0QAAIBAwIEBAQCCAUFAQEAAAECEQADIRIxBAVBURMiYXEGMoGRQqEUI1JiscHR8DNTcpLhFUOCovEWJP/EABoBAQADAQEBAAAAAAAAAAAAAAABAgMEBQb/xAAvEQACAgEDAgQEBgMBAAAAAAAAAQIRAxIhMQRBE1Gh8GFxgZEUIjLB0fEjseEF/9oADAMBAAIRAxEAPwDccwLqDcedRPh2wfwomGMfYfVvSlj48wxO47HqPatjx/L0e8mp4jzKvRpMkf7hPrNKDyS5be2NGsRqciSCyszdf3QB6ya7MeVUeJn6XJq249+/kJAVO/lPpt9ulX7fCwBtqU7jqJq0nw+5YnT5dR0mRpKH5TMyK7uk4XVqCjSI9Ox3PvWniq9jKHTSV60S8FeCAgklS2oqOpiI9F79+1W+G44m5rbE4gbnso/ZXqe8fSl1lAdzHrEge/WPWnXL7FxYIW0wP4hgx7gfyrnnXJ6GHVslwNyetQjJn1/IA/zM1MRNQW+HiDORj3HSsDvYNgTtGD7dP79aqcysL4WrSSU8yj19R1HWPSrwtksSYjp796loTB6ZWZvgbpuDWUXUCFVh5QAdRYjuV3rhRqDAWxcCAaWneCFiB6GfoO4p7xHAI7KzAyoIAnEHeRVReVW5NvQ2mCQ09WgMN87Deh1rLC74/b192U2KqQ1wNbbQAGMkAkDYDsQT7mr3B8C3h+a6SxMh1JmMECTuN9+9TcXwNtkCsCQgxnO0b1xauElVGFEY9BUpWYzzKklyXOJLaG0fNB0ztMY/Osxba+UL3bQdwwFtmAUjvBwBBiJ60751xps2i6gMZAzsJ6n++tZtf1tm2gXwxqb5SSpA66SSdzAicyKozgzS/NS5rg5uWVtxb0lkcgvk+XSYI2xEk56HPpLx/CK9xgTBUqu+8KoP2gnr13roJqDFQ6GdIBgZ2kkjMyBEDrneoxwhSbmskgjMA50GJ1DoQVnpINQYNdq2GCcTaDAeIwZRJCmA3l3uON4GcHG2aop4doqz+R7gJJU6lVGJgrmZInqetd8LxCga7ieG7SusnJ9ww7iCSenvHSmyXS1xCk3QYJWdOT5VJnIyNhGarkjrjpZfVw1Xwv3yd8RZOmVtkKMyd42kk9ewHf78ixEyfwavvED8x960HF2tZCH5YlvWNh/fal9zhi5WMeJ5iewAGkD1Az7gV87n/wDMudR397/RWvX6+jqpWK0teIwDHAjOBgdPf+orziE03NJjNvTjvpKj6kqD7mn1lBbUlejaZOdImCTH3PuOgpdzuGCuHVihyV3gn3Mwf416GHofAw/mdu03+6/2YZGnuiryMFtSBQ0ZggEDocEwOnSirnAWil9isQ6kjBgQ8EQPp96K7+nTjDS+1lVFNbl7nNiALo+ZCPqJ/r/Or9m8GVWGzDH1rtlkQdqXWOWlLmoPCAyFyYkevuc108otTjK13JTK6kAmQSg99x9CfsfSlo4HTdtW94Gpj3zn6eUCmfML6oUJ314+xB/I1a0CZjMRPpRNohwUnXkZgIyXWOmQrQR3DTA+o/lT/heDFsnSTpP4TkA9xVgIJJjJ3Ptt/E11UylYx4lEKKKKoahRRRQBRRRQBVK/aZmwI9au0VKdENWRWbRAhjP9/nSjmdzwbousVCadKwsvO5joB9Y9KeVT5ny5L6hXkQZBG4+4qGUyRbj+Xkz5Wdd1bpc3AdCNhoUgsT0GkBogdfWK44gqWFwXgLatGnJzggR6iRnbSaYPyy8oa3b0qirFtifMdRUvJ6EwenaoLfLbmjSEsvDDUDM6l1KxPpBB+pPWKqczhLiv79+hxxHBk+IWAuJbyignUfwnIyAQA0e1WOF4XxPD4jwJYsMFiCoBgNnDQAIkT71JzTlNwurWGFsSS0EjzEjzGN9tvT1p7UmkcdydoR8x4+4txlDBQI6b7HM+9XLtwtaRtnMFewMGZn8MTPp6xVy5YViCygkbSNq8vWiSCDBE7iQQd8fas4QkpNtm7TFdy++GAKFhqaCCCFjzaSpMnAAwciuXslp1ksQCInt8wnsML6sc4AFWm4eGK4GpQFMYDKSYjtkY7KamS2Sfk0ZljIyRkAR0nOY9s1qZ6fMqreMBtLMYxAI8pVTOoeu470V5au6S3ndVJJXSNSwSf3SRkH0iKKbBP4jaiiihsVuN4QXNM4KsD+eR9amu3QqlmMACSa7ooRSuyHhuKW4CVJgEjKkZBIMSBOQRivV4hTPoQDjqQp+3mGaX8RyG2wbJkliMLg3CS+I80yfmmqfGcHwtslmfzp59OpQSyKWGIxhpgQIYYiIEj27eCiScSB9yAPzNdzSW3Y4RJAuKAQo06liNZdcAZknA7HHWq9rhOBg/rBAkfPGELBhiCVDNqzP4DsFgDRTQTSS9Y4d2Nw3FINwLKkQpVPlyT5iOqw2Vjaa6ucJwwRFN0QAYJKklbmeogjyiCB+H3kBzNE0k/R+HtrcKNLaSx0ldR0BDOBGNKxiM+tR8t4fhhe8rQ6GFUspmbSmQIx5Scg58xMxgB1w3ErcXUpkEkA94JGO4x9ql1Dv/AGN6QcNwnBIbbLcUaASp1CIBLGfqN94XtXHG8u4S2ksTBJIIKzNsOYk79cGZgTNAaKajvXwsTmSAAP3jH23P0rN8VwPD60AuKo1QRjUCPFctrB8uHMEbEqTV+zb4Z9N8kDCnTIhSYAG2MoBG0oYAM0A38VZIkSMkTkTMfwP2NQsLdoXLgEbs8bmB/wAUnPBcG4nxFOrAYMv+YbkDEYYHHaZrq1b4NQ5F1dLqVI1LGlmk7DaSY9WPVjID4NXmsdxSXh7HCKLiLcU6gUbzCQIjTgbwAO5jrUXB8DYvaSqvOkNrhYkhXU7RPn2AiMEQBQD5LqmYMxv23IOe8g13SkfD1gKF0mAukZ6Z+h3nPYdqZcPZCIqLsoAHsBAoDq5bDCCJFQXeDBUrqbIj5iY/PP1qzRQhpMo2uB6NAHoT6xvsBJx670VeooRpQUUUULHFy6BvP0Un+AxS086EwEO8AsYXJMGc4jQ09ri9ZFNa8ihKoWf9YAMFDvuMiNTqWmPlGkZ/eFQK9m6puPbXUWVSNc/4gQEyI3Uwe4WDTqKIoLQk4u7aR48JJDCPMR5iwYsQBAzcJ1HJJPeoAli6rhV0aUkFGz5k1MBggH8JO5A9K0UUFR2oLQkXjeGEKEOHBAgwH2kGYx6fSornGcOSpCkrpCzkaFXI0kCczBz+EdN9BFEUJtChL/DKtyFgDDiP2sEb+kfTHSuBxfDi5ITZZLDbYKAfYSM7T704W0oJYASdz1MbTXUUI2Et67w4TWLcyCVBGCUggwcTqgTv9BUlziLKEWTbhRKKAPLGhBpUdoaIH7Pc02ivYoNhCzcOD4vmZWJABHlEpDkAgHIAE53qQPbtM1s2xpLTPdglsKGGnACaVG+Fp1RQbCO0/Dw0JAVlBBJHzkKSwJzuQZ3CwcVza4jh2Vv1YlUaRBjSjEgSRiSs/wD0S+ivIoNhIOI4XIC9ZwDuNUFeoA8xBGBHTFSrzSzbTyAwIjeNgFz7AbZ+tNooig2F97nFtdPY7+g8wHvlSJ29dp6fmQDadJzEHvqEriNyQwj93O4q9iig2K3B8at2dOQBv7kjb/xP2q1RRQgKKKKAKKKKAKKKKAKKKKAKKKKAKKKKAKo8fcuh7YRkAdtJ1IWIhHeZDj9kCIq9VXi7ZL2SBIW4SfQeFcWfuwH1oCtxPMGFsMNMkPvJAKhiMSO1XeGDgHWysZ3VSoj2LNmk/E8rHh+WyuorcDQqy2pWwT1kkb024IKFhbfhidtIX6wKAsUUUUAUUUUBW4/jFtIXb/6ayPHc6u3D8xQdAp9Z36nb7VP8R3muXtCgnQNgJ9W2n0+1LEsNglGK7mAfl6mY2jrXi9X1M5zcI8I9DBiio6pcnK3G6FvufT+g+wppy3n9xDDnWv8A7DPQ9d9vQbV5e5jl2a2y6l0MJgSJKgmARAIx2FK2ssN1YYnIO3f29a5tUsTvHI1pTVSR9Ds3Q6hlMg7V3Wb+E+IILWjj8QBx7/y6fyrSV7uDL4sFI83JDRJoKKKK2KBRRRQBRRRQBRRRQBVDm/NE4dAzBmJMKqjJME9YAGNzV+k/xNw9q5bCXH0EnyN6nBB9DP8AcULQSclZzy34jt3rgs6HW4VJhgMAfWcggjGxpfa+NbZE+DcHpK6umCJwcjFV+QcU6cULHE2wbukhbu7QFJClvxjSDDGDiDJmKvxRy9ODsIlkE6mY+YyZKoN/ZQKk6lihr01zxuPuE+J7dwuot3AUttczp8wWCQvmyfMPTO9Q/wD69Inwn2nJX+RPcZq7yzldsOnEidZsqm/l0wpwO/lFZZr91b99rLAMviFpIOlBcydMEDMHvAORtQrGGOTdI1nLueW71l7yBoSdSx5gVEkRMHG2YNKLvxzaGBYvE9gF6x2b1H3r34AsILdxlaWLBSIgKFHkgdiCTP0zFKOEt8T+kXBwzKrnXlyI0i4P3W6kfnQssePXJPt57Gl4H4ntXLVy6VdFtxMgEksSAFAJkk4+oqKx8WWyyI1u4huMFWQuZYL0boTBiYrvTwht3wGVZI8ZlmQ5YhWyN9QMe1Z+xcPDXbKXVW9ZZpsv1UMVOtScjJUlOm4PQisccJXS+n09/Q0fHfEtu3cNvw7j6fnZQNK7E7nMAyTsO84q9yjmScTb8VAdMkeaJwYOxNZznnCnxXvcNcHiID4tvfyx5vLgODAlZ9Rmm3wnxiXbEpbFuGKso21YMg9iCD9frQrOEfD1JeXv+BPzC94XE3CV1A9DsQYOZBkY6ffFeeM5UDwW89sIDjOkDI8mcCc57EU0+JuWFx4iCSMEAZI6H+5pMnNiDIRYgYyQYAXM/ugj/wAjXh5bxZHGTpcr6m8KnFOKtnvGce9xtPhw4uao3PYKRGY29oqw3E3QWAssDBLaiWjWVJ3HywkR6nNLrfFw+vTMgggk51AhjMyCZ3FSHjNQKC2JICrEyFGyjvnPqaxjl5blv7+Bo8fCr39xp8PXDc4h7gEDTtkgbACfpWopXyHl3gpn5myfTsJppXsdLCUMa1cvf7nDmknPbgKKKK6TIKKKj4gMUYIYaDpJ2BjB+9ASUV8/X4iv27v6y4xW20XBCaTDMrR5QTsSIiYHrTT4m57cS6tuw5EKCxAUg6iIksCAACNpPnFTRv8Ah52l5msopF8McRfuWna6+rzQhgdMH5QOv8KQXec8SjMrXydJIYhUKyuDnwwe/T8J7UohYW21fBvKW865OnFBVcsArTCxnEEHH8K7a3ePD6RcHjFANeI1Rlh5Y/8AX6VmuTfEFzxAly4SreUFgPK5iDIAkZAM/tDbqIxwlvKL4HXLfhu1ZuC7qd2WdJYgxIicASYkexo518OpxLanuMvliBpxv+0CM+3Sl/wxxXE3L91bt7WtolSNKiTqYAiFkDync9RiqPGc24q3da2bxJBPyqhUYncoO8ddutDXTk1/q3RpuXcnWzY/R1d9Pm80jUNZJMEARE4qnwvwuiXVu+LcJWfLjS2oEHViTvOTXV7mxscGL9xhcYiQRs2okpso6RsOlJuW8dzO8hvqF0n5EIUahOYG4HTLDvJ6iIxyNOV/fuOOWfDSWHZ1uXDqUpBIiCRGwkkAQCZ3NQf/AJC3Mi7ckDG0jvsMzUXBcx4m7wLXi2i6pYklQDoXJ8pBAMd/ypRwvG8wvBmXikXQSNBCa3IUMNK+HneB3M+9C6jkt3Jbbe9jQWfhdFt3bXiMRd0yYEjQxYR7zXlj4RsqynVcZUIIUsIkGeg2kTHXrNV73FcWvBpdZirhj4gKqGINwqkDSRtB6SKi+FefM7sl64TK6lLaRGmS3ygYiDnsaFay05Jl/i/hW3cuPdNy4Gc9CIAiCNsgwN+1MuU8sTh08O3MEliSZJJ6n6AD2ArGXfiLinLMlwqsnSCqjEmBlZJ2EmM96afEvGcXYFtlugAoAQFUk3B85ypwQREdum9BLHkdQbNZSrjuRWrh1ZUncjrnOPvWbtXuY+RxxC3gxEraVGKBoPm8ggb5npTD4o4ziLNwMtwhGEKqhSdQiSZXrqHU7bVSeKM1UlZVYpRklGSJV+Fh1un/AG+3r7/lTTgOU27WVEt+0d/+P+BWZ5tz68eHt3bV0JDeHcAVZL6SwILAwCBP161Nzni+KS7w9hb58RkOqFXSSCSWJ0GAACIgTWUOlxQdxReUcslUpefobCivn1znXFizdum/AthSw0oSA5IAHkyZHWt5wzlkUncqCfciuijHJicOSWiiioMgri/dCKzNgKCSfQCTXdeETg0B814TRdPFhcuT4ySJ8qvc1kmCA2m6Mb/WuuHZf0e5cJPnZbdsnqEdWuHUenyjJ3WK+ipYVdlA9gBXL8JbIAKKQNgVBAneO1TZ1vqVfHkZn4e5slvgmMy1tmEAEyzEsgmMyCuelZ4Wl8N7jXTIcA24YK06sl50zAuGY2B2kV9IXhkAgIoB6ACPtXn6JbiPDWO2kf0pZVZ0m2lyxDyDn9s8KWc5sgK8A7E6UOe4H5Gs/wAl4f8ASLF+2D+ttsHH+kqFKgx10HbqBnet+OHSCuhYO4gQfpXtuyq/KoE9gB/ClkLNGN6VyYv4N4xbf6XddiY8NmO7GfE6Drn1paFDrduvdKsDq0BWh5MnzTp3JGRjfavoq8OgmEUTvAGffvUZs2hqlUECWwNswT6YOfQ0sn8QtTlXNGP4LiP0nhDYSDcssGCgEynTSTvAYj10j9oVW4jngHCiwXuW3ttAdcSPMAreYMDOCM7D1jdp4akqNCkCSBAOnOSO2Dn0NcX7tlfO7Wxt5mIGDgZNLI8aN8bXZmeWvcTgb73y8OCqByWbzAIsznLN7fTNKeWXOHtlrr6muIdVrfSxAxOkR838vSt5c46zCzctw/yyy+fI+XPmyRt3rm5bsahbItazkKQuojOQu52P2pYWdb7c+RnOc84F7gCzgK1xioWZB8O5mScRCmkPFMos2Ly7G2EYwQWu2xpI2BaRt0OmvoKGwZQeEdBgqNPlLHAI6En86nCIfLC4MxjB6Y6UsmGeMVSXe/8Ah895oyWmtoTBtKvier6me5A6/N0xTr4x4pHW2AxyusYjytEZIxPbetM/BWySTbQk7kqJP1iu3sKRBUEeoFLDzpuLrgw/LuZ2eFQGyjNccKLuskQVkY6blqsfGnM0W7aEn9UwL+xNtsYJOFP9a1h4G1v4af7R/Su34ZCZKKSepAJpY8aOtSaf3PnnxdwHhMYJ8N/OowFx0M9QWxjqPWvoHH8Qtu2ztMAdBJzgQB6mpLthWjUoaNpAMfeunthhBAI7HI+1LKTy61FPsYH4A40JfuWnJL3ApEQQNAuEjBxgjbfNfQKjSwq7Ko9gBUlQRmyLJLVQUUUUMgooooAooooAooooAooooApHzkv/AP0aQpH6MJkkH/v7AAzTyobvCq2uR866Gycr5senzN96AScTxA8d2hiTrtA6W06RaD/PGmQ6ON9ya84MaWS3/l6FH+nzFPspAnupp03BIUKRgsW3O5Yuc+5P3io7vLbbNrghtKrqBIMIWKCR2Lt/uNAK7nCu7XrdtkUMHB1JqEMRMDUAJljkHJ279Wbge2zxGq9YaDkiRwxGesTTH/pduAAXGCJFxwTqMmWBkmeszXv/AEy3IIUgDSdIJCSgAQlAYJECP9K9hACi4sJwxUAnwlicSTd4U5MGJO5g015P/hkn52Ym56PMEeoEBQeqqtepyu2DMHEaQWYhQGV4UE+USq4HYDYAVZSyAzMBBaCfUgRPvAA+g7UBJRRRQBRRRQBRRRQBRRRQBRRRQBRRRQBRRRQBRRVf9NTQLgJKnYgEkyY+UCd/SgLFFcWrgYBlMg/39D6V0zAZJj/nAoD2uLjkRCk56Rj1MkV0rT/fbFctdAIBOSCfosTn6igOBeb/AC2G3VcTP73T+fWgXm/y26dV6g/vdNvrRw/Eq4lScdwQc7YIBg966a8AJPeNjuTpH59aA4F9v8t/uvaf2vp/c0eO3+W/3XtP7X09/TNSswG5jMfUmB+dFy4FBYmABJPYDegIvGb/AC3+69p/a749/TNTIZG0eh/4qLh+JV/lORuCCGHupAI+vcVKzQCe31/Ib0B7RRUHE8WluNZiZOxOBuTAwokSTgSKAnorh7oBUH8Rge8Fv4A13QBRRRQBRRRQBRRRQBRRRQBRRRQEHHMwtvo+bSQv+oiF/OKoJacW2QKEK3V07ssEoxP4SRJbtEUyS+pIAMkgn6AwfzNSUAkvcLoLEy0hZaWCAtcus50iYWSJHUaQxjNV7GU8/iFvIch82wlsmVOYkNg51T1mtFqzH9/f6V7QCK1gtIuTk2wurP628THSCNMz00+lccGhbxAASNLhfngEpYwGfLZmTjOqQDNOeH4tHkKZj0IwZgiR5lMGCMGKku3Qok9wPqxCj8yKAScTxZl3DXCnhMF8hkOYOkBVDEgAATJmRvioeKU6XEP4mom2PP8A5twyIx6/7P3a0leMYE0AnW2DabJZfFQ7NAAa3OmSTpEST31bZo4EAo+oOR4S6x5pL+fxI669ts/L6UzPEr5M/OYX1Okt/AGpqARXLsyxDPA0q4ldY1LqJKjEBswM6WIHQVdTlCgLEOt1hhhItm4uJyAddjSJyASMVo3vACTtIXY7khR+ZFAQEh+sQPYwTj6D7UAlNrSwLa9DPcNySxEeN5J7Ln20/uipuFvhUtMdZXw2AkMWOU0gz5tRAODnFX+PdQo1FhJwVBJBEn8IOIB3x3rrhCmnShkLA3n8IYZO8ggz60Ag44MzkKHGL0ga9QIVwh1Y0kgnSBkAiCcVe8MWnL+YKtwyZYgILEnHRdWcdacVG95RMnqAfdiAv3JFASUUUUAUUUUAUUUUAUUUUAUUUUBnjbZZkmHaSxBhUVnGg6QDpDMrZOdbSYBNRuCJ1PcgaY/xA7IUtgk5lROr97V1mRWlri7bDCD3B+xBH8KAS27Ou4oGs29eMsAVC8R1nKycdPljEUcsfzW9RfxD80ltvCWJB8u/56uuqntQDhRr1yZ6CfKCQASB0MD+PcyAsW8pt2lbUAmkXMMAP1bjSSP3gMeq9xVazqhNWvxJQ3AdWwe0QSDj+3/erR14aAU8zvg+Gyk5AZGGqDLJgKuCSOrbCcEaqqeGFVQ5uaDaUnzOTrK3NyDOr+enrFaGRRNAJuJV4tkLIt21ZpJB+ZGIUBTLRaIjHzDvUZn/ALhcIh8Pd86Vcq0rk6gyZ/aA6xT2aJoDPMpkC5r1arJUeaC3iA3MLg9CekeleJaYW0b9ZJZA+X+Tw014nA8p26lupM6Ka5u2wwgz7gwRGRn3oBMmg2rfncJ4tzzamBibwENvHbpERiKg4ZSCNQcH9VoEMuYti55RA+UCQdhq2E0/sWQi6RO5Mnckkkn6kmpKAQctN03NJLiMgsDE2lNl8YwWOsd4mpObMQtxSTrIRgQCJ0tLEdo0knOMdxTuuLtsMpU7EEH2OKARXCokqbhUE6Vl/MdNudLH8YMwDudYMGSNBRRQBRRRQBRRRQBRRRQBRRRQBRRRQBRWJ4niH/SrqninS2rAg+IIWTlfDiXE+XBGnrNT3fG/Szw3i3ckOG1wBaAbXP1IAPcCak38D49rNfXFy2GwwBHqJ6R/An71keV80J4vzXHNp3dbct5SRt9DOBA3XenfxNdZbMrcFtiygSdOqT8mv8BPf+VQVliako+YwPCp+wv+0dRB/IAUHhU/YXr+EdcH7wPtWJ4jj7jJwxS/dOvxA4NxLZlXaPPBAzI1RkKNjV1eMVbvDA8YzIVYsxbSG0MxWQe5lTO4XFSXeCS7+fp/RqTwqfsL/tHXf7wPtQeFQ/gXr+Edd/vA+1YvnPN2NwvauuFfhhdCm5p0HpjILRB0bmTkdZeO4x1VGHEPB4RrgOvDXFXHvk/lQfh5bb8mvPCp+wv+0dTJ/MA1IiAYAAHp65P51iuc8XdtMoW+4Pgqxm4BDRBEEZkCdO5JmtXyzjluohDhmKKxGzAMoIJTdZoUnicYqRcorKfFPG3LV+2bdwiELsmrDBGGIHUgsfZDtE1V5dx1y7dul77IrWWuKAwAUMRo+oUg/UUossDcdVm1orH8i5k08ORee4brOrox1RpLQwxK4E+tbCoKZMbg6YUUUUMwooooAooooAooooAooooAooooCs/L7TGTaQmZkoCZ7zFTGys6tI1RExmN4nt6V3RQm2VhwFoR+qTBkeUYPcYwamu2VYQyhh2In+Nd0UFsrvwNogA20IGACoMe2MVyeXWcfqbeMDyLgSTjHck/WrLMAJJgDc1X4niPIWQqSR5M4J6bbiYoQ5tdwPAWjvaQ4j5RsNhttXZ4RIA0LC/KNIhfYdKLNzChiuvTJAPXrAOYmpNYmJE9uv2oNRFc4O2x1NbQt3KgnHrFe2uFRXa4FAZ41HqQohR6AZx6nvU1FCbZDc4VGOoopMRJUEwZkT2ycetcfoFqSfCSSIJ0iSOxMZFWaKC2Q2eFRDKoqn0UD+FTUUUICiiq3MbWu06xJKmPeMfnUSdKwT6xMSJ7V1Xzym/KOcMjBXJZDjO6+s9vSuHH18ZOpKjNZDWUVFxHEKgl2CiYk96K7XKK5ZoUOL5iwbSoGMEnr/f9Kn5dxpuSCMgTPQzUPF8vYsWUjPQ9PrU3L+DKSScn8vr1rV1Ritevfgu0UUp+J0drBVELSRMGIAzPqMAfWqGk5aYtjNLysSAwJXBAOR79q7rFcgf9egtu4DjU8rOsrOrzdpk/Xua2tS1RTDl8SNhRRRUGoUUUo4nmtp9VjUyuZUae/QA7T/8AKFZSUeRTc5pduXzYceRn0FIg6ZiZ3mM1xxXDBdFxVcNaYqLZGSFYsrT2OoT3zFWneOGEXdLwB+sgNhpgN023zEdIqM6gut/NcW2VY9/Mzr9tEH6ztVTiavZ79/kHCEW7tvTYM+FuWPlYhnMnbqN9poNjTdHF3X8Mah5cltWkeUEdNx9CK5Vnt3H8W4CrTucfMVk/sjSrDHpviolEMnDsrXgx1SWIhm3IInA6n1ag7fX17cGut3VYAgghhI9ZE4rustwfMEa+ls250MVRpPlIEYTaMdZO2TWpqUzrx5FNbEK8QpbT1/pMj8v7zU1KuMQqxbIUEHVnAPWdU+UiSAAIY1JzXjjZQR5nOB2wPMY/lUnQsbk0o9xgDXtZDgOYXVbBnW4mR8x2PtuPyrX0LZsLxOmFFFFDEyPPuXG25cDyMZ/0k7j+lc8s5S1wayDonpEt7TiPWtJzXjRZt6iJJwB3P9Kylzml4nV4hHYDAH02+9eTnhhx5Lf2MZKKY5+IbD3dGgFtMgr1BMQYPsc0VJy7jP0gfMFdRkAGY7yGEjbHSitpdPDM/EV7ltKluS8z5sbVy3bFtn1ZMbx6DqetRco4AWnuXmuYYkCTsA5GSdzjH/NdcvDLat621MlyCZJ+eQMnJxcU15zDhPFsaJj9acxP/dK/zr1NlsYbv873a3S8ti5zXjGtWjcVNcdJ6d/ajlHFNdtK7LpJmRmMEiRPQ1WuW/Dt+GuRZt6jP4iJ0A+kqT9BVTgubPfsvgLcJ0IV6sQSN/lgTn0xnFNNrb7kvLWRW+3Hx+foPbVpUAVVCgbACB9hXzbmHFcVxvEXLKuqw+q2q3VIQoCJDrnI1H0MbVsOCvPw9r9e5Z2eFBJbYDE53gnNZ7nHwdcDm5wZA1ksRITQBDKqR3Ptsu2a36WcI5HFtXWzfHvY5+sU8mOLinXdLkn+BuaXzcPDurm2iwrFcCCZLMf2pwMxt0mtZxvEFYjr3rPfDfw0vBsb9wy7AAKs+SRLrvDCYgxstaBCCxMmDETt9vpWfUyhLJcODbpI5I4lGfP7diJ0kHcFgG9OuPzpRc5agvI+m6dTEwNgQQZLTiT09Kb2yTuZEyPpJ+m35Up5xwF246OjwBgZI0mTkflXOy2VWrqygbBDXFa3pQGRGYM4Ekkbe9SX2uNldMhTqg74E+XMfhXoDMR254rikVjcRjcU4C5Cq3cTueu3XrmvOXoiuVgkukgnoANY674qDm76V78jxAby+eBAU7wSACB5iCO/uSTnAqwvEW2ssts6I0rqZ2mCcQoWDMHtG9Qct5h5raAE4AkGDhRt0xGPzwTTV7Q0vot6Bo1eLbjPX/DJBG306URpDdWn8yBOYWrN1Ua1NwAK9yAGkgZgT3HWrvOOavafSuggj3I7yJqvya9ZvuNSE3UUHW34ogaiAYmY3n3qzzrl6Gbpcp3MSOwwM1KO/odOq5bp8FThOdO2HCuDggYb6dG9t684hg4EmRbRs9SupNPsSJX3BqohEgLfuMSYAAI/MtimtlZYeaWAh5GGkAqJAEkErmOpqT0MijCVpV9/4FVlihLYNyPKvS2P2m6D0B9zUvBc5e2W1Tcnuxx3iQcf0ovvqbQSo7KVIXO0FT/IVzd5RdBjw/s4j/2M0NU8cl/k7+/h6Gm4LiRcQOAQD0PoYNVOZ81FryjL/kPf+lWeXWWS2qtEgRjb0pbzHlRa41wtCmNskQACY+lQ77HkZrV6PM6u8EeKRHZ9I07Addid/Sk3E8oZG067f1YA/UHannM73g2VVMTgHrEST7/1rOE1y5enxzdvk58k1HbuaDkvKhaJZmDMRsNgJH32FFT8hsgWg0AFjOPsP4fnRW+PHGEaSN4fpR//2Q==",
        description: "Essential study skills for academic success",
        downloadUrl: "https://crpf.gov.in/writereaddata/images/pdf/The_Stress_Management.pdf"
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
        title: "How to get rid of loneliness and become happy ",
        duration: "11:21",
        url: "https://www.youtube.com/embed/vZT-bB66iIk",
        thumbnail: "https://img.youtube.com/vi/vZT-bB66iIk/maxresdefault.jpg",
        language: "en",
        description: "Practical tips to overcome loneliness"
      },
      {
        id: 2,
        title: "अकेलेपन से कैसे निपटें",
        duration: "29:06",
        url: "https://www.youtube.com/embed/y04OcY_4ttU",
        thumbnail: "https://i.ytimg.com/vi/y04OcY_4ttU/hqdefault.jpg",
        language: "hi",
        description: "हिंदी में अकेलेपन से निकलने के तरीके"
      },
      {
        id: 3,
        title: "How to Practice Mindfulness",
        duration: "7:51",
        url: "https://www.youtube.com/embed/bLpChrgS0AY",
        thumbnail: "https://i.ytimg.com/vi/bLpChrgS0AY/maxresdefault.jpg",
        language: "en",
        description:"A guided mindfulness exercise to calm your mind and improve focus."
      },
      {
        id: 4,
        title: "जर्नलिंग की शक्ति (कैसे शुरू करें)",
        duration: "7:51",
        url: "https://www.youtube.com/embed/gJdRH9XfHFI",
        thumbnail: "https://i.ytimg.com/vi/gJdRH9XfHFI/maxresdefault.jpg",
        language: "hi",
        description:"जर्नलिंग से जीवन बदलने का सरल तरीका बताता वीडियो"
      },
      {
        id: 5,
        title: "WHAT IS HO'OPONOPONO AFFIRMATION TECHNIQUE.",
        duration: "13:20",
        url: "https://www.youtube.com/embed/E6KABb97VaU",
        thumbnail: "https://i.ytimg.com/vi/E6KABb97VaU/hqdefault.jpg",
        language: "ur",
        description: " تکنیک سے ذہنی سکون اور مثبت سوچ حاصل کریں۔"
      }
    ],
    books: [
      {
        id: 1,
        title: "HOW TO OVERCOME FEELINGS OF LONELINESS",
        author: "Catherine Mwaniki",
        rating: 4.6,
        pages: 32,
        coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
        description: "Understanding and overcoming loneliness",
        downloadUrl: "https://thedocs.worldbank.org/en/doc/911231595605767961-0230032020/original/20200723HowtoOvercomeFeelingsofLoneliness.pdf"
      }
    ]
  }
};