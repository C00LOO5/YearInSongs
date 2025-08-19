// src/components/Dashboard/HeroSection.js - Elegant Hero with Time Selector
import React, { useState } from 'react';
import './HeroSection.css';

const HeroSection = ({ user, timeRange, onTimeRangeChange, data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  const getTimeRangeLabel = (range) => {
    switch (range) {
      case 'short_term': return 'Last 4 Weeks';
      case 'medium_term': return 'Last 6 Months';
      case 'long_term': return 'All Time';
      default: return 'Last 6 Months';
    }
  };

  const timeOptions = [
    { value: 'short_term', label: 'Last 4 Weeks', emoji: '🔥', desc: 'Recent favorites' },
    { value: 'medium_term', label: 'Last 6 Months', emoji: '📊', desc: 'Medium-term trends' },
    { value: 'long_term', label: 'All Time', emoji: '⭐', desc: 'All-time classics' }
  ];

  const getQuickInsight = () => {
    if (!data || !data.topTracks.length || !data.topArtists.length) return null;
    
    const totalTracks = data.topTracks.length;
    const totalArtists = data.topArtists.length;
    const genres = new Set(data.topArtists.flatMap(artist => artist.genres || []));
    
    return {
      tracks: totalTracks,
      artists: totalArtists,
      genres: genres.size
    };
  };

  const insight = getQuickInsight();

  return (
    <div className="hero-section">
      <div className="hero-background">
        <div className="hero-glow"></div>
        <div className="hero-pattern"></div>
      </div>
      
      <div className="hero-content">
        
        {/* Welcome Message */}
        <div className="hero-welcome">
          <div className="welcome-text">
            <h1 className="greeting">
              {getGreeting()}, <span className="user-name">{user?.display_name}</span>
              <div className="greeting-wave">👋</div>
            </h1>
            <p className="welcome-subtitle">
              Ready to explore your musical journey?
            </p>
          </div>
          
          {/* User Avatar */}
          <div className="user-avatar-container">
            <div className="avatar-ring"></div>
            <div className="avatar-ring-2"></div>
            <img 
              src={user?.images?.[0]?.url || 'https://via.placeholder.com/120x120/1DB954/ffffff?text=' + (user?.display_name?.[0] || 'U')}
              alt={user?.display_name}
              className="user-avatar"
            />
            <div className="avatar-status"></div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="hero-controls">
          <div className="time-selector-hero">
            <div className="selector-header">
              <span className="selector-title">Time Period</span>
              <span className="current-period">{getTimeRangeLabel(timeRange)}</span>
            </div>
            
            <div className={`time-dropdown-hero ${isDropdownOpen ? 'open' : ''}`}>
              <button 
                className="dropdown-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="trigger-content">
                  <span className="trigger-emoji">{timeOptions.find(opt => opt.value === timeRange)?.emoji}</span>
                  <span className="trigger-label">{getTimeRangeLabel(timeRange)}</span>
                </span>
                <div className={`trigger-arrow ${isDropdownOpen ? 'rotated' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
              </button>
              
              <div className="dropdown-menu">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`dropdown-option ${timeRange === option.value ? 'active' : ''}`}
                    onClick={() => {
                      onTimeRangeChange(option.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className="option-emoji">{option.emoji}</span>
                    <div className="option-text">
                      <span className="option-label">{option.label}</span>
                      <span className="option-desc">{option.desc}</span>
                    </div>
                    {timeRange === option.value && (
                      <div className="option-check">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        {insight && (
          <div className="hero-insights">
            <div className="insight-card">
              <div className="insight-icon">🎵</div>
              <div className="insight-number">{insight.tracks}</div>
              <div className="insight-label">Top Tracks</div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">🎤</div>
              <div className="insight-number">{insight.artists}</div>
              <div className="insight-label">Top Artists</div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">🎨</div>
              <div className="insight-number">{insight.genres}</div>
              <div className="insight-label">Genres</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HeroSection;