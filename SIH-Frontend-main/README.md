# SensEase - Mental Health Support Platform

A comprehensive mental health and wellness platform for students, counselors, and administrators.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will run at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── Assessment/    # Mental health assessments
│   │   ├── Dashboard/     # Role-based dashboards
│   │   ├── WellnessTools/ # Journaling, timers, etc.
│   │   ├── ui/            # Reusable UI components (shadcn/ui)
│   │   └── Layout/        # Layout wrappers
│   ├── context/           # React contexts (Auth, Theme, Language)
│   ├── lib/               # Utilities and configs
│   ├── mock/              # Mock data (for development)
│   └── data/              # Static content
├── public/                # Static assets
└── vite.config.js         # Vite configuration
```

## 🔑 Features

- **Multi-role dashboards** (Student, Counselor, Admin)
- **Mental health assessments** (PHQ-9, GAD-7, GHQ-12)
- **Wellness tools** (Journaling, Pomodoro Timer, Eisenhower Matrix)
- **Community chat** and support groups
- **Direct messaging** between students and counselors
- **Appointment scheduling**
- **Multi-language support** (English, Hindi, Spanish, French, German)
- **Theme customization** (6 themes including dark mode)

## 🔧 Tech Stack

- **Frontend:** React 18 + Vite
- **UI Library:** shadcn/ui + Tailwind CSS
- **State Management:** React Context API
- **Routing:** React Router v6
- **Icons:** Lucide React

## 🗄️ Data Storage

Currently running with **mock data** (session-only):

- All assessment data, wellness logs, and user interactions are ephemeral
- Data persists only during the current session
- Theme & Language preferences are saved in localStorage
- Perfect for testing and development

## 📝 Storage

- **Theme & Language:** Persisted in localStorage
- **User Session:** Persisted in localStorage
- **All other data:** Ephemeral (session-only)

## 🎨 Available Themes

- Default (Cyan/Blue)
- Purple Magic
- Forest Green
- Sunset Orange
- Ocean Blue
- Dark Mode

## 🌍 Supported Languages

- English
- हिंदी (Hindi)
- Español (Spanish)
- Français (French)
- Deutsch (German)

## 📄 License

MIT
