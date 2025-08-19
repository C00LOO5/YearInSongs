// src/components/Music/TopArtists.js - With Dropdown Time Selector
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { spotifyAPI } from '../../services/spotify';
import SpotifyButton from './SpotifyButton';
import Loading from '../Common/Loading';
import './TopArtists.css';

const TopArtists = () => {
  const { timeRange: urlTimeRange } = useParams();
  const { user } = useAuth();
  
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(urlTimeRange || 'medium_term');
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    loadArtists();
  }, [timeRange]);

  const loadArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await spotifyAPI.getTopArtists(timeRange, 50);
      setArtists(response.items || []);
    } catch (error) {
      console.error('Error loading top artists:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (artistId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(artistId)) {
      newFavorites.delete(artistId);
    } else {
      newFavorites.add(artistId);
    }
    setFavorites(newFavorites);
  };

  const formatFollowers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count?.toLocaleString() || '0';
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

  if (loading) return <Loading message="Loading your top artists..." />;

  if (error) {
    return (
      <div className="error-container">
        <h2>Failed to load artists</h2>
        <p>{error}</p>
        <button onClick={loadArtists} className="retry-button">Try Again</button>
      </div>
    );
  }

  return (
    <div className="top-artists-elegant">
      {/* Header Section */}
      <div className="artists-header">
        <div className="header-content">
          <h1 className="page-title">🎤 Your Top Artists</h1>
          <p className="page-subtitle">
            Discover the artists that define your musical taste • {getTimeRangeLabel(timeRange)}
          </p>
        </div>

        <div className="artists-controls">
          {/* Dropdown Time Selector */}
          <div className="time-selector-dropdown">
            <label htmlFor="artistTimeRange" className="selector-label">
              Time Period:
            </label>
            <div className="dropdown-container">
              <select
                id="artistTimeRange"
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

      {/* Artists Grid */}
      <div className="artists-container">
        {artists.map((artist, index) => (
          <div key={artist.id} className="artist-card-elegant">
            <div className="artist-rank">
              <span className="rank-badge">#{index + 1}</span>
            </div>

            <div className="artist-image-section">
              <div className="image-wrapper">
                <img 
                  src={artist.images?.[0]?.url || 'https://via.placeholder.com/300x300/1DB954/ffffff?text=♪'} 
                  alt={`${artist.name} profile`}
                  loading="lazy"
                />
                <div className="image-overlay">
                  <SpotifyButton 
                    href={artist.external_urls?.spotify}
                    size="medium"
                    variant="primary"
                  >
                    View Artist
                  </SpotifyButton>
                </div>
              </div>
            </div>

            <div className="artist-content">
              <h3 className="artist-name">{artist.name}</h3>
              
              <div className="artist-genres">
                {artist.genres?.slice(0, 3).map((genre, idx) => (
                  <span key={idx} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="artist-metrics">
                <div className="metric-item">
                  <span className="metric-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zM12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </span>
                  <span className="metric-value">{formatFollowers(artist.followers?.total)} followers</span>
                </div>

                <div className="popularity-metric">
                  <div className="popularity-info">
                    <span className="popularity-label">Popularity</span>
                    <span className="popularity-value">{artist.popularity}%</span>
                  </div>
                  <div className="popularity-bar-container">
                    <div className="popularity-bar">
                      <div 
                        className="popularity-fill" 
                        style={{ width: `${artist.popularity}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="artist-actions">
                <button
                  className={`favorite-btn ${favorites.has(artist.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(artist.id)}
                  title={favorites.has(artist.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.has(artist.id) ? 'currentColor' : 'none'} stroke="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>

                <SpotifyButton 
                  href={artist.external_urls?.spotify}
                  size="icon-small"
                  variant="secondary"
                  title="Open in Spotify"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {artists.length === 0 && (
        <div className="no-artists">
          <span className="no-artists-icon">🎤</span>
          <h3>No artists found</h3>
          <p>Try selecting a different time range to see your top artists.</p>
        </div>
      )}
    </div>
  );
};

export default TopArtists;