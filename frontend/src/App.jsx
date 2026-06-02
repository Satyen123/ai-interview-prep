import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import InterviewSetup from './pages/Interview/InterviewSetup';
import LiveInterview from './pages/Interview/LiveInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CodingSandbox from './pages/CodingSandbox';
import Analytics from './pages/Analytics';
import MentorChat from './pages/MentorChat';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route wrapper checks JWT authentication
function PrivateRoute({ children }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" replace />;
}

// Admin Route wrapper checks double verification (Logged in + admin role)
function AdminRoute({ children }) {
  const { user } = useAuthStore();
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const { user } = useAuthStore();

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Navbar />
        
        <div className="flex flex-col md:flex-row flex-grow w-full relative">
          {/* Only render sidebar for protected student dashboard views */}
          {user && (
            <Sidebar />
          )}

          <main className="flex-grow w-full bg-cyber-darker relative min-w-0">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

              {/* Protected Student Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/interview-setup" element={<PrivateRoute><InterviewSetup /></PrivateRoute>} />
              <Route path="/live-interview" element={<PrivateRoute><LiveInterview /></PrivateRoute>} />
              <Route path="/resume-analyzer" element={<PrivateRoute><ResumeAnalyzer /></PrivateRoute>} />
              <Route path="/coding-sandbox" element={<PrivateRoute><CodingSandbox /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              <Route path="/mentor-chat" element={<PrivateRoute><MentorChat /></PrivateRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* Fallback routing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
