// src/components/Dashboard/QuickActions.js - Quick Action Buttons
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

const QuickActions = ({ user, onRefresh }) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'refresh',
      icon: '🔄',
      title: 'Refresh Data',
      description: 'Update your music stats',
      color: '#1DB954',
      action: onRefresh
    },
    {
      id: 'top-tracks',
      icon: '🎵',
      title: 'Top Tracks',
      description: 'View all your favorite songs',
      color: '#E74C3C',
      action: () => navigate('/top-tracks')
    },
    {
      id: 'top-artists',
      icon: '🎤',
      title: 'Top Artists',
      description: 'Explore your favorite artists',
      color: '#9B59B6',
      action: () => navigate('/top-artists')
    },
    {
      id: 'spotify-profile',
      icon: '🎧',
      title: 'Spotify Profile',
      description: 'Open your Spotify profile',
      color: '#1DB954',
      action: () => window.open(user?.external_urls?.spotify, '_blank')
    }
  ];

  return (
    <div className="quick-actions">
      <div className="actions-header">
        <h3 className="section-title">
          <span className="title-icon">⚡</span>
          Quick Actions
        </h3>
        <div className="actions-subtitle">
          Jump to your favorite features
        </div>
      </div>

      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={action.id}
            className="action-button"
            onClick={action.action}
            style={{ 
              '--action-color': action.color,
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="button-glow"></div>
            
            <div className="button-content">
              <div className="action-icon">{action.icon}</div>
              <div className="action-info">
                <div className="action-title">{action.title}</div>
                <div className="action-description">{action.description}</div>
              </div>
            </div>
            
            <div className="action-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="actions-footer">
        <div className="user-info-card">
          <div className="user-avatar">
            <img 
              src={user?.images?.[0]?.url || 'https://via.placeholder.com/40x40/1DB954/ffffff?text=' + (user?.display_name?.[0] || 'U')}
              alt={user?.display_name}
            />
            <div className="user-status"></div>
          </div>
          
          <div className="user-details">
            <div className="user-name">{user?.display_name}</div>
            <div className="user-followers">
              {user?.followers?.total ? `${user.followers.total.toLocaleString()} followers` : 'Spotify User'}
            </div>
          </div>
          
          <div className="spotify-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.37c-.3 0-.52-.12-.72-.36-1.64-1.99-4.11-2.4-6.8-1.64-.32.09-.66-.09-.75-.41s.09-.66.41-.75c3.08-.87 5.89-.41 7.89 1.89.21.24.21.6-.03.87-.12.12-.27.4-.52.4zm1.03-2.3c-.36 0-.6-.15-.84-.42-2.04-2.47-5.12-3.18-8.5-2.04-.39.13-.81-.08-.94-.47s.08-.81.47-.94c3.83-1.29 7.35-.49 9.85 2.35.27.32.25.8-.07 1.07-.15.12-.36.45-.72.45zm.89-2.4c-.43 0-.72-.18-1.01-.5-2.43-2.94-6.43-3.21-8.76-1.78-.47.29-1.08.15-1.37-.32s-.15-1.08.32-1.37c2.97-1.82 7.54-1.48 10.43 2.05.32.39.27 1.06-.11 1.38-.19.15-.4.54-.75.54z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;