// src/components/Music/TrackItem.js
import React from 'react';
import './TrackItem.css';

const TrackItem = ({ 
  track, 
  rank, 
  isPlaying, 
  onPlay, 
  formatDuration,
  showPopularity = true,
  showRank = true 
}) => {
  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay(track.id);
  };

  const handleTrackClick = () => {
    // Could open track details modal or navigate to track page
    console.log('Track clicked:', track.name);
  };

  return (
    <div 
      className={`track-item ${isPlaying ? 'playing' : ''}`}
      onClick={handleTrackClick}
    >
      {showRank && (
        <div className="track-rank">
          <span className="rank-number">{rank}</span>
        </div>
      )}

      <div className="track-image">
        <img 
          src={track.image || 'https://via.placeholder.com/300x300/1DB954/ffffff?text=♪'} 
          alt={`${track.name} album cover`}
          loading="lazy"
        />
        <div className="play-overlay">
          <button 
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayClick}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
        {isPlaying && (
          <div className="playing-indicator">
            <div className="equalizer">
              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
              <div className="bar bar4"></div>
            </div>
          </div>
        )}
      </div>

      <div className="track-info">
        <div className="track-main">
          <h3 className="track-name" title={track.name}>
            {track.name}
          </h3>
          <p className="track-artist" title={track.artist}>
            {track.artist}
          </p>
          {track.album && (
            <p className="track-album" title={track.album}>
              {track.album}
            </p>
          )}
        </div>

        <div className="track-meta">
          <div className="track-duration">
            <span>{formatDuration(track.duration_ms)}</span>
          </div>
          
          {showPopularity && track.popularity && (
            <div className="track-popularity">
              <div className="popularity-label">Popularity</div>
              <div className="popularity-bar">
                <div 
                  className="popularity-fill" 
                  style={{ width: `${track.popularity}%` }}
                ></div>
              </div>
              <span className="popularity-value">{track.popularity}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="track-actions">
        <button 
          className="action-button"
          onClick={(e) => {
            e.stopPropagation();
            // Add to favorites or playlist functionality
            console.log('Add to favorites:', track.name);
          }}
          title="Add to favorites"
        >
          ❤️
        </button>
        
        <button 
          className="action-button"
          onClick={(e) => {
            e.stopPropagation();
            // Share functionality
            console.log('Share track:', track.name);
          }}
          title="Share track"
        >
          🔗
        </button>

        {track.external_urls?.spotify && (
          <button 
            className="action-button spotify-link"
            onClick={(e) => {
              e.stopPropagation();
              window.open(track.external_urls.spotify, '_blank');
            }}
            title="Open in Spotify"
          >
            🎵
          </button>
        )}
      </div>

      <div className="track-stats">
        <div className="stat-item">
          <span className="stat-label">Rank</span>
          <span className="stat-value">#{rank}</span>
        </div>
        {track.popularity && (
          <div className="stat-item">
            <span className="stat-label">Pop</span>
            <span className="stat-value">{track.popularity}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackItem;