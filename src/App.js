// src/App.js

import React from 'react';
import Footer from './components/Common/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { spotifyAPI } from './services/spotify';
import Navigation from './components/Common/Navigation';
import Loading from './components/Common/Loading';
import Login from './components/Auth/Login';
import AuthCallback from './components/Auth/AuthCallback';
import Dashboard from './components/Dashboard/Dashboard';
import TopTracks from './components/Music/TopTracks';
import TopArtists from './components/Music/TopArtists';
import Analytics from './components/Analytics/Analytics';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // While auth state is loading, show a spinner
    return <Loading />;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected children
  return children;
};

function App() {
  // Optionally set the token getter on your spotifyAPI instance
  const { getValidToken } = useAuth();
  useEffect(() => {
    spotifyAPI.setTokenGetter(getValidToken);
  }, [getValidToken]);

  return (
    <AuthProvider>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Router>
          <Navigation />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/callback" element={<AuthCallback />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/top-tracks"
                element={
                  <ProtectedRoute>
                    <TopTracks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/top-artists"
                element={
                  <ProtectedRoute>
                    <TopArtists />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
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
