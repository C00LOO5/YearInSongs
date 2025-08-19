// src/App.js - Updated with Real Spotify Authentication
import React, { useEffect } from 'react';
import Footer from './components/Common/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { spotifyAPI } from './services/spotify';
import Dashboard from './components/Dashboard/Dashboard';
import TopTracks from './components/Music/TopTracks';
import TopArtists from './components/Music/TopArtists';
import Analytics from './components/Analytics/Analytics';
import Navigation from './components/Common/Navigation';
import Login from './components/Auth/Login';
import AuthCallback from './components/Auth/AuthCallback';
import Loading from './components/Common/Loading';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Loading your music data..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};

// Main App Content (requires authentication)
const AppContent = () => {
  const { user, getValidToken, isAuthenticated } = useAuth();

  useEffect(() => {
    // Initialize the Spotify API with the auth token getter
    if (isAuthenticated && getValidToken) {
      spotifyAPI.setTokenGetter(getValidToken);
    }
  }, [isAuthenticated, getValidToken]);

  return (
    <div className="App">
      <Navigation user={user} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/tracks" element={<TopTracks />} />
          <Route path="/tracks/:timeRange" element={<TopTracks />} />
          <Route path="/artists" element={<TopArtists />} />
          <Route path="/artists/:timeRange" element={<TopArtists />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Root App Component
function App() {
  return (
    <AuthProvider>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Router>
          <Navigation />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/callback" element={<AuthCallback />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/top-tracks" element={<ProtectedRoute><TopTracks /></ProtectedRoute>} />
              <Route path="/top-artists" element={<ProtectedRoute><TopArtists /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}


export default App;