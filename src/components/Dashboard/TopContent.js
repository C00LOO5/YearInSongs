// src/components/Dashboard/TopContent.js - Elegant Top Content Display
import React, { useState } from 'react';
import SpotifyButton from '../Music/SpotifyButton';
import './TopContent.css';

const TopContent = ({ tracks, artists, onViewMore }) => {
  const [activeTab, setActiveTab] = useState('tracks');

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatFollowers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count?.toLocaleString() || '0';
  };

  const displayTracks = tracks.slice(0, 6);
  const displayArtists = artists.slice(0, 6);

  return (
    <div className="top-content">
      <div className="content-header">
        <div className="header-tabs">
          <button 
            className={`tab-btn ${activeTab === 'tracks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            <span className="tab-icon">🎵</span>
            <span className="tab-label">Top Tracks</span>
            <div className="tab-indicator"></div>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'artists' ? 'active' : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            <span className="tab-icon">🎤</span>
            <span className="tab-label">Top Artists</span>
            <div className="tab-indicator"></div>
          </button>
        </div>
        
        <button 
          className="view-more-btn"
          onClick={() => onViewMore(activeTab === 'tracks' ? 'top-tracks' : 'top-artists')}
        >
          View All
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </button>
      </div>

      <div className="content-body">
        <div className={`content-pane tracks-pane ${activeTab === 'tracks' ? 'active' : ''}`}>
          <div className="content-grid">
            {displayTracks.map((track, index) => (
              <div key={track.id} className="content-item track-item">
                <div className="item-rank">
                  <span className="rank-number">#{index + 1}</span>
                </div>
                
                <div className="item-image">
                  <img 
                    src={track.album?.images?.[0]?.url || 'https://via.placeholder.com/80x80/1DB954/ffffff?text=♪'}
                    alt={`${track.name} album cover`}
                  />
                  <div className="image-overlay">
                    <SpotifyButton 
                      href={track.external_urls?.spotify}
                      size="icon-small"
                      variant="primary"
                      title="Play in Spotify"
                    />
                  </div>
                </div>
                
                <div className="item-info">
                  <h3 className="item-title" title={track.name}>
                    {track.name}
                  </h3>
                  <p className="item-subtitle" title={track.artists?.map(a => a.name).join(', ')}>
                    {track.artists?.map(a => a.name).join(', ')}
                  </p>
                  <div className="item-meta">
                    <span className="track-duration">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                      {formatDuration(track.duration_ms)}
                    </span>
                    <span className="track-popularity">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L17.18 22 12 19.27 6.82 22l1.09-7.26L2 9l6.91-1.74L12 2z"/>
                      </svg>
                      {track.popularity}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`content-pane artists-pane ${activeTab === 'artists' ? 'active' : ''}`}>
          <div className="content-grid">
            {displayArtists.map((artist, index) => (
              <div key={artist.id} className="content-item artist-item">
                <div className="item-rank">
                  <span className="rank-number">#{index + 1}</span>
                </div>
                
                <div className="item-image artist-image">
                  <img 
                    src={artist.images?.[0]?.url || 'https://via.placeholder.com/80x80/1DB954/ffffff?text=♪'}
                    alt={`${artist.name} profile`}
                  />
                  <div className="image-overlay">
                    <SpotifyButton 
                      href={artist.external_urls?.spotify}
                      size="icon-small"
                      variant="primary"
                      title="View on Spotify"
                    />
                  </div>
                </div>
                
                <div className="item-info">
                  <h3 className="item-title" title={artist.name}>
                    {artist.name}
                  </h3>
                  <p className="item-subtitle">
                    {artist.genres?.slice(0, 2).join(', ') || 'Artist'}
                  </p>
                  <div className="item-meta">
                    <span className="artist-followers">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zM12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      {formatFollowers(artist.followers?.total)} followers
                    </span>
                    <span className="artist-popularity">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L17.18 22 12 19.27 6.82 22l1.09-7.26L2 9l6.91-1.74L12 2z"/>
                      </svg>
                      {artist.popularity}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopContent;