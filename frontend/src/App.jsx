import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/AdminDashboard';
import SentimentAnalysis from './pages/SentimentAnalysis';
import ClickstreamAnalytics from './pages/ClickstreamAnalytics';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import { trackEvent } from './services/api';

function App() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Track Page View
    trackEvent({
      type: 'PAGE_VIEW',
      page: location.pathname
    }).catch(err => console.error('Tracking error:', err));

    // Track Clicks
    const handleGlobalClick = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        trackEvent({
          type: 'BUTTON_CLICK',
          page: location.pathname,
          element: target.innerText || target.tagName,
          metadata: { id: target.id, className: target.className }
        }).catch(err => console.error('Tracking error:', err));
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col relative items-center w-full">
      {/* Background elements */}
      <div className="bg-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="noise-overlay"></div>

      <Navbar />
      <main className="flex-1 flex flex-col relative z-10">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/jobs" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

          {/* Candidate */}
          <Route path="/my-applications" element={
            <ProtectedRoute roles={['CANDIDATE']}>
              <MyApplications />
            </ProtectedRoute>
          } />

          {/* Recruiter */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['RECRUITER']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Shared authenticated */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/sentiment" element={
            <ProtectedRoute roles={['RECRUITER', 'ADMIN']}>
              <SentimentAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute roles={['RECRUITER', 'ADMIN']}>
              <ClickstreamAnalytics />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
