import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Static Layout Layouts (Keep static since they are present on every view)
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Lazy Pages for Route splitting / Optimizing initial load speed
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const InterviewSetup = lazy(() => import('./pages/Interview/InterviewSetup'));
const LiveInterview = lazy(() => import('./pages/Interview/LiveInterview'));
const ResumeAnalyzer = lazy(() => import('./pages/ResumeAnalyzer'));
const CodingSandbox = lazy(() => import('./pages/CodingSandbox'));
const Analytics = lazy(() => import('./pages/Analytics'));
const MentorChat = lazy(() => import('./pages/MentorChat'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Lazy Legal & Info Pages
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/Legal/TermsConditions'));
const RefundPolicy = lazy(() => import('./pages/Legal/RefundPolicy'));
const CookiePolicy = lazy(() => import('./pages/Legal/CookiePolicy'));
const AboutUs = lazy(() => import('./pages/Legal/AboutUs'));
const ContactUs = lazy(() => import('./pages/Legal/ContactUs'));

// Loading skeleton placeholder representing standard dashboard shell
function PageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-pulse w-full select-none">
      <div className="h-20 bg-white/5 border border-white/5 rounded-3xl w-full"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white/5 border border-white/5 rounded-2xl"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 h-96 bg-white/5 border border-white/5 rounded-3xl"></div>
        <div className="h-96 bg-white/5 border border-white/5 rounded-3xl"></div>
      </div>
    </div>
  );
}

// Global network offline state detector banner
function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black py-2.5 px-4 font-black text-center text-xs select-none relative flex items-center justify-center gap-2 animate-fadeIn shadow-lg shrink-0 z-50">
      <span className="animate-bounce">⚠️</span>
      <span>NETWORK DISRUPTED: Working offline. Real-time speech evaluations and code compiler judges will resume when connectivity is restored.</span>
    </div>
  );
}

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
        <OfflineBanner />
        <Navbar />
        
        <div className="flex flex-col md:flex-row flex-grow w-full relative">
          {/* Only render sidebar for protected student dashboard views */}
          {user && (
            <Sidebar />
          )}

          <main className="flex-grow w-full bg-cyber-darker relative min-w-0">
            <Suspense fallback={<PageLoadingSkeleton />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

                {/* Public Legal & Business Routes */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsConditions />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />

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
            </Suspense>
          </main>
        </div>
      </div>
    </Router>
  );
}
