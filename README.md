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

## 🗄️ Backend Integration

Currently running with **mock data**. To integrate with your backend:

1. Update `frontend/src/lib/backendConfig.js`:

```javascript
export const BACKEND_ENABLED = true;
export const API_BASE = "http://localhost:5000"; // Your API URL
```

2. Or use environment variables in `frontend/.env`:

```env
VITE_BACKEND_ENABLED=true
VITE_API_BASE=http://localhost:5000
```

See `BACKEND_MIGRATION.md` for detailed backend integration guide.

## 📝 Storage

- **Theme & Language:** Persisted in localStorage
- **User Session:** Persisted in localStorage
- **All other data:** Ephemeral (session-only) until backend is connected

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
