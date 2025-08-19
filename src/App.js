// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { spotifyAPI } from './services/spotify';
import Navigation from './components/Common/Navigation';
import Footer from './components/Common/Footer';
import Loading from './components/Common/Loading';
import Login from './components/Auth/Login';
import AuthCallback from './components/Auth/AuthCallback';
import Dashboard from './components/Dashboard/Dashboard';
import TopTracks from './components/Music/TopTracks';
import TopArtists from './components/Music/TopArtists';
import Analytics from './components/Analytics/Analytics';
import './App.css';

// Protected Route HOC
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loading message="Loading your music data..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const { getValidToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && getValidToken) {
      spotifyAPI.setTokenGetter(getValidToken);
    }
  }, [isAuthenticated, getValidToken]);

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<AuthCallback />} />

          {/* Protected */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tracks" element={<TopTracks />} />
                  <Route path="/tracks/:timeRange" element={<TopTracks />} />
                  <Route path="/artists" element={<TopArtists />} />
                  <Route path="/artists/:timeRange" element={<TopArtists />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Always render the footer */}
      <Footer />
    </div>
  );
};

export default () => (
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);
