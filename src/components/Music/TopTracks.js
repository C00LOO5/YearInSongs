// src/components/Music/TopTracks.js - With Dropdown Time Selector
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { spotifyAPI } from '../../services/spotify';
import SpotifyButton from './SpotifyButton';
import Loading from '../Common/Loading';
import './TopTracks.css';

const TopTracks = () => {
  const { timeRange: urlTimeRange } = useParams();
  const { user } = useAuth();
  
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(urlTimeRange || 'medium_term');

  useEffect(() => {
    loadTracks();
  }, [timeRange]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await spotifyAPI.getTopTracks(timeRange, 50);
      setTracks(response.items || []);
    } catch (error) {
      console.error('Error loading top tracks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatPopularity = (popularity) => {
    if (popularity >= 80) return { level: 'Hot', color: '#FF6B6B' };
    if (popularity >= 60) return { level: 'Popular', color: '#4ECDC4' };
    if (popularity >= 40) return { level: 'Moderate', color: '#45B7D1' };
    return { level: 'Niche', color: '#96CEB4' };
  };

  const getTimeRangeLabel = (range) => {
    switch (range) {
      case 'short_term': return 'Last 4 Weeks';
      case 'medium_term': return 'Last 6 Months';
      case 'long_term': return 'All Time';
      default: return 'Last 6 Months';
    }
  };

  const timeRangeOptions = [
    { value: 'short_term', label: 'Last 4 Weeks', emoji: '🔥' },
    { value: 'medium_term', label: 'Last 6 Months', emoji: '📊' },
    { value: 'long_term', label: 'All Time', emoji: '⭐' }
  ];

  if (loading) return <Loading message="Loading your top tracks..." />;

  if (error) {
    return (
      <div className="error-container">
        <h2>Failed to load tracks</h2>
        <p>{error}</p>
        <button onClick={loadTracks} className="retry-button">Try Again</button>
      </div>
    );
  }

  return (
    <div className="top-tracks-page">
      {/* Header Section */}
      <div className="tracks-header">
        <div className="header-content">
          <h1 className="page-title">🎵 Your Top Tracks</h1>
          <p className="page-subtitle">
            The songs that soundtrack your life • {getTimeRangeLabel(timeRange)}
          </p>
        </div>

        <div className="tracks-controls">
          {/* Dropdown Time Selector */}
          <div className="time-selector-dropdown">
            <label htmlFor="timeRange" className="selector-label">
              Time Period:
            </label>
            <div className="dropdown-container">
              <select
                id="timeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="time-dropdown"
              >
                {timeRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
              <div className="dropdown-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="tracks-container">
        {tracks.map((track, index) => {
          const popularityInfo = formatPopularity(track.popularity);
          
          return (
            <div key={track.id} className="track-card">
              <div className="track-rank">
                <span className="rank-number">#{index + 1}</span>
              </div>

              <div className="track-image-section">
                <div className="image-wrapper">
                  <img 
                    src={track.album?.images?.[0]?.url || 'https://via.placeholder.com/300x300/1DB954/ffffff?text=♪'} 
                    alt={`${track.name} album cover`}
                    loading="lazy"
                  />
                  
                  <div className="image-overlay">
                    <SpotifyButton 
                      href={track.external_urls?.spotify}
                      size="medium"
                      variant="primary"
                      title="Play in Spotify"
                    >
                      Play Track
                    </SpotifyButton>
                  </div>
                </div>
              </div>

              <div className="track-content">
                <div className="track-main-info">
                  <h3 className="track-name" title={track.name}>
                    {track.name}
                  </h3>
                  <p className="track-artists" title={track.artists?.map(a => a.name).join(', ')}>
                    {track.artists?.map(a => a.name).join(', ')}
                  </p>
                  <p className="track-album" title={track.album?.name}>
                    {track.album?.name}
                  </p>
                </div>

                <div className="track-metadata">
                  <div className="track-stats">
                    <span className="track-duration">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                      {formatDuration(track.duration_ms)}
                    </span>
                    
                    <span 
                      className="track-popularity"
                      style={{ '--popularity-color': popularityInfo.color }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L17.18 22 12 19.27 6.82 22l1.09-7.26L2 9l6.91-1.74L12 2z"/>
                      </svg>
                      {track.popularity}% • {popularityInfo.level}
                    </span>
                  </div>

                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill" 
                      style={{ 
                        width: `${track.popularity}%`,
                        backgroundColor: popularityInfo.color
                      }}
                    />
                  </div>
                </div>

                <div className="track-actions">
                  {track.preview_url && (
                    <button 
                      className="preview-btn"
                      title="Preview (30s)"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Preview
                    </button>
                  )}
                  
                  {track.external_urls?.spotify && (
                    <SpotifyButton 
                      href={track.external_urls.spotify}
                      size="small"
                      variant="secondary"
                      title="Open in Spotify"
                    >
                      Open in Spotify
                    </SpotifyButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {tracks.length === 0 && (
        <div className="no-tracks">
          <span className="no-tracks-icon">🎵</span>
          <h3>No tracks found</h3>
          <p>Try selecting a different time range to see your top tracks.</p>
        </div>
      )}
    </div>
  );
};

export default TopTracks;