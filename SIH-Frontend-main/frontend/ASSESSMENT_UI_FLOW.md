# New Assessment History Flow

## User Interface Layout

### Main View - Grid of Assessments

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Assessment History                    [Back Button]            │
│  You have completed 6 assessments                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────┐ │
│  │ PHQ-9              │  │ GAD-7              │  │ PHQ-9    │ │
│  │                    │  │                    │  │          │ │
│  │ Score:             │  │ Score:             │  │ Score:   │ │
│  │    8               │  │    5               │  │    5     │ │
│  │  / 27              │  │  / 21              │  │  / 27    │ │
│  │                    │  │                    │  │          │ │
│  │ [Mild Badge]       │  │ [Minimal Badge]    │  │ [Min..]  │ │
│  │                    │  │                    │  │          │ │
│  │ 7 days ago         │  │ 5 days ago         │  │ 3 days.. │ │
│  │                    │  │                    │  │          │ │
│  │ Click to view AI   │  │ Click to view AI   │  │ Click..  │ │
│  │ insights           │  │ insights           │  │          │ │
│  └────────────────────┘  └────────────────────┘  └──────────┘ │
│                                                                 │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────┐ │
│  │ GAD-7              │  │ PHQ-9              │  │ BDI-II   │ │
│  │                    │  │                    │  │          │ │
│  │ Score:             │  │ Score:             │  │ Score:   │ │
│  │   12               │  │   15               │  │   18     │ │
│  │  / 21              │  │  / 27              │  │  / 63    │ │
│  │                    │  │                    │  │          │ │
│  │ [Moderate Badge]   │  │ [Moderate Badge]   │  │ [Mild]   │ │
│  │                    │  │                    │  │          │ │
│  │ 1 day ago          │  │ 2 weeks ago        │  │ 3 weeks..│ │
│  │                    │  │                    │  │          │ │
│  │ Click to view AI   │  │ Click to view AI   │  │ Click..  │ │
│  │ insights           │  │ insights           │  │          │ │
│  └────────────────────┘  └────────────────────┘  └──────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Card Hover State

```
┌────────────────────┐
│ PHQ-9    [HOVER]   │  ← Scales up slightly
│                    │  ← Shadow increases
│ Score:             │
│    14              │
│  / 27              │
│                    │
│ [Moderate Badge]   │
│                    │
│ 1 day ago at 2:30  │
│                    │
│ ▶ Click to view    │
│   AI insights      │
└────────────────────┘
```

## Modal View - Assessment Details

### When User Clicks a Card

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  PHQ-9 Assessment Details                            [Close X]   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Assessment Details                                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Score:          14 / 27                                    │ │
│  │ Severity:       [Moderate Orange Badge]                   │ │
│  │ Date:           11/20/2024                                │ │
│  │ Time:           02:30 PM                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Personalized Insights                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [AI Badge with Gradient]                                   │ │
│  │                                                             │ │
│  │ "Your PHQ-9 assessment indicates moderate depressive       │ │
│  │ symptoms. This is an important time to take action. Con-   │ │
│  │ sider reaching out to a mental health professional for     │ │
│  │ personalized guidance. Professional support, combined      │ │
│  │ with lifestyle changes like exercise, social connection,   │ │
│  │ and addressing sleep issues, can significantly improve     │ │
│  │ your wellbeing."                                           │ │
│  │                                                             │ │
│  │ ← Left border accent (cyan)                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Interaction Flow

```
Student Opens Assessment History
         │
         ▼
    ┌─────────────────────┐
    │ See Grid of Cards   │
    │ - All assessments   │
    │ - Scores visible    │
    │ - Color badges      │
    │ - Dates shown       │
    └─────────────────────┘
         │
         ▼
    Student Clicks Card
         │
         ▼
    ┌──────────────────────┐
    │ Modal Opens with:    │
    │ - Full score info    │
    │ - Severity level     │
    │ - Date & time        │
    │ - AI insights        │
    │ - Beautiful styling  │
    └──────────────────────┘
         │
         ▼
    Student Reads AI Response
         │
         ▼
    ┌──────────────────────┐
    │ Gets Personalized    │
    │ Recommendations      │
    │ Based on Score       │
    └──────────────────────┘
         │
         ▼
    Student Closes Modal
         │
         ▼
    Back to Grid View
```

## Severity Color Coding

```
Card Badge Colors:
────────────────────────────────────────
[Minimal]        → Green badge
[Mild]          → Yellow badge
[Moderate]      → Orange badge
[Moderately Severe] → Red badge
[Severe]        → Dark Red badge
────────────────────────────────────────
```

## Responsive Behavior

```
Mobile (< 768px)
┌─────────────┐
│ Assessment  │  1 column
│   Card      │  Full width
│ [Score]     │  Stacked
└─────────────┘
│ Assessment  │
│   Card      │
│ [Score]     │
└─────────────┘

Tablet (768px - 1024px)
┌──────────────┬──────────────┐
│ Assessment   │ Assessment   │  2 columns
│   Card       │   Card       │
└──────────────┴──────────────┘

Desktop (> 1024px)
┌──────────────┬──────────────┬──────────────┐
│ Assessment   │ Assessment   │ Assessment   │  3 columns
│   Card       │   Card       │   Card       │
└──────────────┴──────────────┴──────────────┘
```

## AI Response Examples

### Example 1: Moderate Score
```
Score: PHQ-9 = 14/27 → Moderate

AI Response:
"Your PHQ-9 assessment indicates moderate depressive 
symptoms. This is an important time to take action. 
Consider reaching out to a mental health professional 
for personalized guidance. Professional support, combined 
with lifestyle changes like exercise, social connection, 
and addressing sleep issues, can significantly improve 
your wellbeing."
```

### Example 2: Minimal Score
```
Score: GAD-7 = 5/21 → Minimal

AI Response:
"Excellent progress! Your GAD-7 score has improved 
significantly. You are showing resilience and effective 
coping strategies. Continue with the activities that have 
been helping you. Regular exercise, social engagement, and 
adequate sleep remain important for maintaining your mental 
wellbeing."
```

### Example 3: Severe Score
```
Score: PHQ-9 = 22/27 → Severe

AI Response:
"Your PHQ-9 score indicates severe depression. Please 
reach out to a mental health professional, counselor, or 
crisis helpline immediately for support and guidance. 
If you have thoughts of self-harm, please contact a 
crisis helpline as soon as possible."
```

## Component Structure

```
AssessmentHistory
├── Header Section
│   ├── Title: "Assessment History"
│   ├── Subtitle: "You have completed X assessments"
│   └── Back Button
│
├── Assessment Grid
│   ├── Card 1
│   │   ├── Form Name
│   │   ├── Score Display
│   │   ├── Severity Badge
│   │   ├── Date/Time
│   │   └── Click Hint
│   ├── Card 2
│   ├── Card 3
│   └── ... (responsive grid)
│
└── Modal (When Card Clicked)
    ├── Header with Close Button
    ├── Assessment Details Section
    │   ├── Score
    │   ├── Severity
    │   ├── Date
    │   └── Time
    └── Personalized Insights Section
        ├── AI Badge
        └── AI Response Text
```

---

**Design Pattern:** Simple → Detailed on Click  
**User Flow:** See All → Click One → View Details  
**Performance:** Lightweight, fast loading  
**Accessibility:** Clear badges, readable text, good contrast
