// src/components/Auth/Login.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = () => {
    login();
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="music-notes">
          <span className="note note1">♪</span>
          <span className="note note2">♫</span>
          <span className="note note3">♪</span>
          <span className="note note4">♬</span>
          <span className="note note5">♪</span>
          <span className="note note6">♫</span>
        </div>
      </div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <h1 className="app-title">🎶 YearInSongs</h1>
            <p className="app-subtitle">Your Music, Your Story</p>
          </div>

          <div className="login-body">
            <div className="feature-preview">
              <h2>Discover Your Musical Journey</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <div className="feature-text">
                    <h3>Personal Dashboard</h3>
                    <p>View your top stats and listening insights</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <span className="feature-icon">🎵</span>
                  <div className="feature-text">
                    <h3>Top Tracks & Artists</h3>
                    <p>Explore your most played songs and artists</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <span className="feature-icon">📈</span>
                  <div className="feature-text">
                    <h3>Music Analytics</h3>
                    <p>Interactive charts of your music personality</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <span className="feature-icon">🎭</span>
                  <div className="feature-text">
                    <h3>Mood Analysis</h3>
                    <p>Discover the emotions in your music taste</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="login-actions">
              <p className="login-description">
                Connect your Spotify account to unlock personalized music insights 
                and discover patterns in your listening history.
              </p>
              
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <span className="error-text">{error}</span>
                </div>
              )}

              <button 
                className={`spotify-login-btn ${loading ? 'loading' : ''}`}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span className="spotify-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.297.479-1.02.718-1.559.42z"/>
                      </svg>
                    </span>
                    <span>Connect with Spotify</span>
                  </>
                )}
              </button>

              <div className="privacy-note">
                <p>
                  🔒 We only access your listening history and basic profile info. 
                  Your data is never shared with third parties.
                </p>
              </div>
            </div>
          </div>

          <div className="login-footer">
            <div className="permissions-info">
              <h4>What we'll access:</h4>
              <ul className="permissions-list">
                <li>
                  <span className="permission-icon">👤</span>
                  <span>Your profile information</span>
                </li>
                <li>
                  <span className="permission-icon">🎵</span>
                  <span>Your top tracks and artists</span>
                </li>
                <li>
                  <span className="permission-icon">📊</span>
                  <span>Audio features for analysis</span>
                </li>
                <li>
                  <span className="permission-icon">📚</span>
                  <span>Your saved music library</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;