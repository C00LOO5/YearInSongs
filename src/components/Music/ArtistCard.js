// src/components/Music/ArtistCard.js
import React from 'react';
import './ArtistCard.css';

const ArtistCard = ({ 
  artist, 
  viewMode = 'grid', 
  isFavorite = false,
  onArtistClick,
  onFavoriteToggle,
  formatFollowers 
}) => {
  const handleCardClick = () => {
    onArtistClick(artist);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle(artist.id);
  };

  const handleSpotifyClick = (e) => {
    e.stopPropagation();
    if (artist.external_urls?.spotify) {
      window.open(artist.external_urls.spotify, '_blank');
    }
  };

  const getPopularityColor = (popularity) => {
    if (popularity >= 80) return '#1DB954'; // Green
    if (popularity >= 60) return '#FFB347'; // Orange
    if (popularity >= 40) return '#87CEEB'; // Blue
    return '#D3D3D3'; // Gray
  };

  const getTopGenres = (genres) => {
    return (genres || []).slice(0, 3);
  };

  if (viewMode === 'list') {
    return (
      <div className={`artist-card list-mode ${isFavorite ? 'favorited' : ''}`} onClick={handleCardClick}>
        <div className="artist-rank">
          <span className="rank-number">#{artist.rank}</span>
        </div>

        <div className="artist-image">
          <img 
            src={artist.image || 'https://via.placeholder.com/300x300/1DB954/ffffff?text=♪'} 
            alt={`${artist.name} profile`}
            loading="lazy"
          />
          <div className="image-overlay">
            <button className="play-artist-btn" title="View details">
              👁️
            </button>
          </div>
        </div>

        <div className="artist-info">
          <div className="artist-main">
            <h3 className="artist-name" title={artist.name}>
              {artist.name}
            </h3>
            <div className="artist-genres">
              {getTopGenres(artist.genres).map((genre, index) => (
                <span key={index} className="genre-chip">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="artist-stats-inline">
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <span className="stat-text">{formatFollowers(artist.followers)} followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-text">{artist.popularity}% popularity</span>
            </div>
          </div>
        </div>

        <div className="artist-actions">
          <button 
            className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          
          {artist.external_urls?.spotify && (
            <button 
              className="action-btn spotify-btn"
              onClick={handleSpotifyClick}
              title="Open in Spotify"
            >
              🎵
            </button>
          )}
        </div>
      </div>
    );
  }

  // Grid mode
  return (
    <div className={`artist-card grid-mode ${isFavorite ? 'favorited' : ''}`} onClick={handleCardClick}>
      <div className="artist-rank-badge">
        #{artist.rank}
      </div>

      <div className="artist-image">
        <img 
          src={artist.image || 'https://via.placeholder.com/300x300/1DB954/ffffff?text=♪'} 
          alt={`${artist.name} profile`}
          loading="lazy"
        />
        <div className="image-overlay">
          <button className="view-artist-btn" title="View details">
            <span className="btn-icon">👁️</span>
            <span className="btn-text">View Details</span>
          </button>
        </div>
        <button 
          className={`favorite-btn-floating ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="artist-content">
        <h3 className="artist-name" title={artist.name}>
          {artist.name}
        </h3>

        <div className="artist-genres">
          {getTopGenres(artist.genres).map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>

        <div className="artist-stats">
          <div className="stat-row">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{formatFollowers(artist.followers)}</span>
            <span className="stat-label">followers</span>
          </div>
          
          <div className="popularity-section">
            <div className="popularity-header">
              <span className="popularity-label">Popularity</span>
              <span className="popularity-value">{artist.popularity}%</span>
            </div>
            <div className="popularity-bar">
              <div 
                className="popularity-fill" 
                style={{ 
                  width: `${artist.popularity}%`,
                  backgroundColor: getPopularityColor(artist.popularity)
                }}
              />
            </div>
          </div>
        </div>

        <div className="artist-actions-grid">
          {artist.external_urls?.spotify && (
            <button 
              className="action-btn spotify-btn"
              onClick={handleSpotifyClick}
              title="Open in Spotify"
            >
              <span className="btn-icon">🎵</span>
              <span className="btn-text">Spotify</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;