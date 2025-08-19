// src/components/Auth/AuthCallback.js
import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '../Common/Loading';
import './AuthCallback.css';

const AuthCallback = () => {
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        console.error('Spotify auth error:', error);
        navigate('/?error=auth_failed');
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        navigate('/?error=no_code');
        return;
      }

      try {
        await handleAuthCallback(code);
        // Redirect to dashboard on success
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Auth callback processing error:', error);
        navigate('/?error=callback_failed');
      }
    };

    processCallback();
  }, [searchParams, handleAuthCallback, navigate]);

  return (
    <div className="auth-callback-container">
      <div className="callback-content">
        <div className="callback-card">
          <div className="callback-animation">
            <div className="spotify-logo">
              <svg viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.297.479-1.02.718-1.559.42z"/>
              </svg>
            </div>
            <div className="connection-arrow">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div className="yearinsongs-logo">
              🎶
            </div>
          </div>

          <div className="callback-text">
            <h1>Connecting to Spotify</h1>
            <p>Setting up your personalized music dashboard...</p>
            
            <div className="progress-steps">
              <div className="step active">
                <div className="step-icon">✓</div>
                <span>Authentication confirmed</span>
              </div>
              <div className="step active">
                <div className="step-icon">
                  <div className="spinner-small"></div>
                </div>
                <span>Fetching your profile</span>
              </div>
              <div className="step">
                <div className="step-icon">○</div>
                <span>Preparing dashboard</span>
              </div>
            </div>
          </div>

          <Loading message="Just a moment while we set everything up..." />
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;