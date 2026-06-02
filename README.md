# AI Interview Preparation Platform (MERN Stack)

Welcome to the **AI Interview Preparation Platform**, a startup-level, production-ready SaaS cockpit engineered to prepare students for technical and HR hiring loops. This platform features contextually aligned AI Mock Interviews, HTML5 Speech Integration, real-time PDF ATS Resume Analysis, a robust DSA Coding Sandbox with isolated assertions, and detailed visual performance dashboards.

---

## 🚀 Key System Capabilities

1.  **AI Voice Mock Interviews**: Simulates realistic HR, Technical, and System Design boards using prompt orchestration. Reads questions using native browser SpeechSynthesis (TTS) and transcribes responses dynamically with HTML5 SpeechRecognition (STT).
2.  **ATS Resume Assessor**: Extracts PDF cv text on the fly using `pdf-parse`, parses missing keywords, generates phrasing optimizations, and issues dial ratings.
3.  **DSA Coding Sandbox**: Interactive code playground supporting JS, Python, C++, and Java. Isolates JS assertion tests in browser contexts and provides AI time-space complexity logs (Big-O analysis).
4.  **Gamification & Streaks**: Auto-awards XP points for prep tasks, calculates daily login streaks, manages progression levels, and issues unlocked badges in real-time.
5.  **Administrative monitors**: Custom panels tracking platform registrations, mock templates catalog additions, and activity audit logs.

---

## 🛠️ Architecture & Technologies

### Backend Core
*   **Runtime**: Node.js & Express.js (configured as ES Modules)
*   **Database**: MongoDB & Mongoose schemas
*   **Security**: Helmet.js headers, CORS configurations, rate-limiting layers
*   **Authentication**: Password bcrypt hashing & JWT validation middleware
*   **AI Engine**: Google Gemini API via `@google/generative-ai`

### Frontend Cockpit
*   **Library**: React.js & React Router DOM routing
*   **Styles**: Tailwind CSS obsidian gradients & custom premium Glassmorphism keyframes
*   **Animations**: Framer Motion entry offsets
*   **State Management**: Zustand lightweight persistent stores
*   **Analytics**: Recharts Area, Bar, and Radar charts

---

## 📂 Core Folder Map

```
AI-powered Interview Preparation/
 ├── backend/
 │    ├── config/           # MongoDB configuration
 │    ├── controllers/      # API logic controllers (Auth, Interviews, Resumes)
 │    ├── middleware/       # Auth guards, multer uploads, error boundaries
 │    ├── models/           # DB schemas (User, Interview, Resume, Problem)
 │    ├── routes/           # Routing maps
 │    ├── services/         # Gemini Prompt wrappers & PDF text parsers
 │    └── server.js         # Entry point
 ├── frontend/
 │    ├── src/
 │    │    ├── components/  # Layout Sidebar, Navbars, animated Wrappers
 │    │    ├── store/       # Zustand authStore, interviewStore, codingStore
 │    │    ├── pages/       # Dashboards, Sandboxes, Setup forms, Chats
 │    │    ├── App.jsx      # Navigation routers
 │    │    └── index.css    # Tailwind CSS & glass variables
 │    └── tailwind.config.js
 └── README.md
```

---

## 🔌 API Route Catalog

### Authentication
*   `POST /api/auth/register` — Create a new student account
*   `POST /api/auth/login` — Secure JWT validation & streak update
*   `GET /api/auth/me` — Fetch authorized user cockpit details
*   `PUT /api/auth/me` — Sync target profiles & tag skills

### Mock Interviews
*   `POST /api/interview/start` — Initialize mock session & load first question
*   `POST /api/interview/answer` — Evaluate response, compile scores, step to next question
*   `GET /api/interview/history` — Query past completed session transcripts

### Resume ATS
*   `POST /api/resume/upload` — Upload PDF resume & parse gap reports
*   `GET /api/resume/history` — Query past analyzed ATS documents list

### Coding Sandbox
*   `GET /api/coding/problems` — Fetch seeded DSA problem lists
*   `POST /api/coding/submit` — Submit solution logic & extract AI Big-O complexity

### Analytics & Administrative
*   `GET /api/analytics/user` — Compile Area timeline arrays & Strong/Weak pillars
*   `GET /api/admin/stats` — Audit platform stats & recently registered users list (Admin only)
*   `POST /api/admin/problems` — Seed custom coding problem templates (Admin only)

---

## 🏃 Launch Checklist

To start the platform development environment, complete the following commands relative to the main workspace:

### 1. Backend Server Setup
Create a `backend/.env` file with:
```env
PORT=5000
MONGO_URI=your-mongodb-atlas-uri-or-localhost-string
JWT_SECRET=super-secret-cryptography-phrase
GEMINI_API_KEY=your-gemini-pro-api-key-from-ai-studio
NODE_ENV=development
```

Run inside `backend/`:
```bash
npm run dev
```

### 2. Frontend Cockpit Setup
Run inside `frontend/`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge to access the cockpit!

---

## 🛡️ Administrative seed setup
To configure an administrative profile, register a standard student and update the database role attribute to `'admin'` using MongoDB Compass or Atlas console. This instantly unlocks the Admin Console sidebar!
