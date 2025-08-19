// src/components/Dashboard/TopTracksPreview.js - Removed Play Button Overlay
import React from 'react';
import SpotifyButton from '../Music/SpotifyButton';
import './TopTracksPreview.css';

const TopTracksPreview = ({ tracks }) => {
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const getPopularityColor = (popularity) => {
    if (popularity >= 80) return '#1DB954';
    if (popularity >= 60) return '#FFB347';
    if (popularity >= 40) return '#87CEEB';
    return '#D3D3D3';
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="tracks-preview-empty">
        <span className="empty-icon">🎵</span>
        <p>No tracks data available</p>
      </div>
    );
  }

  return (
    <div className="tracks-preview">
      {tracks.slice(0, 5).map((track, index) => (
        <div key={track.id} className="track-preview-item">
          <div className="track-rank">
            <span className="rank-number">#{index + 1}</span>
          </div>
          
          <div className="track-image">
            <img 
              src={track.album?.images?.[0]?.url || 'https://via.placeholder.com/60x60/1DB954/ffffff?text=♪'} 
              alt={`${track.name} album cover`}
              loading="lazy"
            />
            {/* Removed the image overlay with play button */}
          </div>
          
          <div className="track-info">
            <h3 className="track-name" title={track.name}>
              {track.name}
            </h3>
            <p className="track-artist" title={track.artists?.map(a => a.name).join(', ')}>
              {track.artists?.map(a => a.name).join(', ')}
            </p>
            <div className="track-details">
              <span className="track-duration">
                {formatDuration(track.duration_ms)}
              </span>
              <div className="track-popularity">
                <div className="popularity-bar">
                  <div 
                    className="popularity-fill" 
                    style={{ 
                      width: `${track.popularity}%`,
                      backgroundColor: getPopularityColor(track.popularity)
                    }}
                  />
                </div>
                <span className="popularity-value">{track.popularity}%</span>
              </div>
            </div>
          </div>

          <div className="track-actions">
            {track.external_urls?.spotify && (
              <SpotifyButton 
                href={track.external_urls.spotify}
                size="icon-small"
                variant="minimal"
                title="Play in Spotify"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopTracksPreview;