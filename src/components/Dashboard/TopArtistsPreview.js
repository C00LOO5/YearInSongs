// src/components/Dashboard/TopArtistsPreview.js - Enhanced with Hover Animation and Info
import React from 'react';
import SpotifyButton from '../Music/SpotifyButton';
import './TopArtistsPreview.css';

const TopArtistsPreview = ({ artists }) => {
  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count?.toLocaleString() || '0';
  };

  if (!artists || artists.length === 0) {
    return (
      <div className="artists-preview-empty">
        <span className="empty-icon">🎤</span>
        <p>No artists data available</p>
      </div>
    );
  }

  return (
    <div className="artists-preview-enhanced">
      {artists.slice(0, 5).map((artist, index) => (
        <div key={artist.id} className="artist-preview-card">
          <div className="artist-rank-badge">
            <span className="rank-number">#{index + 1}</span>
          </div>
          
          <div className="artist-image-container">
            <img 
              src={artist.images?.[0]?.url || 'https://via.placeholder.com/50x50/1DB954/ffffff?text=♪'} 
              alt={`${artist.name} profile`}
              loading="lazy"
              className="artist-image"
            />
            <div className="artist-glow-effect"></div>
          </div>
          
          <div className="artist-main-info">
            <h3 className="artist-name" title={artist.name}>
              {artist.name}
            </h3>
            <div className="artist-basic-stats">
              <span className="followers-stat">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zM12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                </svg>
                {formatFollowers(artist.followers?.total)}
              </span>
              <span className="popularity-stat">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L17.18 22 12 19.27 6.82 22l1.09-7.26L2 9l6.91-1.74L12 2z"/>
                </svg>
                {artist.popularity}%
              </span>
            </div>
          </div>

          {/* Enhanced Hover Info Panel */}
          <div className="artist-hover-info">
            <div className="hover-info-content">
              <div className="artist-detailed-stats">
                <div className="stat-item">
                  <span className="stat-label">Popularity</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ width: `${artist.popularity}%` }}
                    />
                  </div>
                  <span className="stat-value">{artist.popularity}%</span>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Followers</span>
                  <span className="stat-big-value">{formatFollowers(artist.followers?.total)}</span>
                </div>
              </div>

              <div className="artist-genres-hover">
                {artist.genres?.slice(0, 3).map((genre, idx) => (
                  <span key={idx} className="genre-tag-hover">
                    {genre}
                  </span>
                )) || <span className="no-genres">No genres available</span>}
              </div>

              <div className="hover-actions">
                {artist.external_urls?.spotify && (
                  <SpotifyButton 
                    href={artist.external_urls.spotify}
                    size="small"
                    variant="primary"
                  >
                    Open Artist
                  </SpotifyButton>
                )}
              </div>
            </div>
          </div>

          <div className="artist-quick-action">
            {artist.external_urls?.spotify && (
              <SpotifyButton 
                href={artist.external_urls.spotify}
                size="icon-small"
                variant="minimal"
                title="Open in Spotify"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopArtistsPreview;