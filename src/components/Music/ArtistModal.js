// src/components/Music/ArtistModal.js
import React, { useEffect } from 'react';
import './ArtistModal.css';

const ArtistModal = ({ artist, isOpen, onClose, formatFollowers }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !artist) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getPopularityLevel = (popularity) => {
    if (popularity >= 90) return { level: 'Legendary', emoji: '👑' };
    if (popularity >= 80) return { level: 'Superstar', emoji: '⭐' };
    if (popularity >= 70) return { level: 'Popular', emoji: '🎯' };
    if (popularity >= 60) return { level: 'Rising', emoji: '📈' };
    if (popularity >= 40) return { level: 'Emerging', emoji: '🌱' };
    return { level: 'Indie', emoji: '💎' };
  };

  const popularityInfo = getPopularityLevel(artist.popularity);

  return (
    <div className="artist-modal-overlay" onClick={handleOverlayClick}>
      <div className="artist-modal">
        <div className="modal-header">
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="artist-hero">
            <div className="artist-image-large">
              <img 
                src={artist.image || 'https://via.placeholder.com/400x400/1DB954/ffffff?text=♪'} 
                alt={`${artist.name} profile`}
              />
              <div className="rank-badge-large">
                #{artist.rank}
              </div>
            </div>

            <div className="artist-details">
              <h2 className="artist-name-large">{artist.name}</h2>
              
              <div className="artist-level">
                <span className="level-emoji">{popularityInfo.emoji}</span>
                <span className="level-text">{popularityInfo.level} Artist</span>
              </div>

              <div className="key-stats">
                <div className="key-stat">
                  <span className="stat-number">{formatFollowers(artist.followers)}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="key-stat">
                  <span className="stat-number">{artist.popularity}%</span>
                  <span className="stat-label">Popularity</span>
                </div>
                <div className="key-stat">
                  <span className="stat-number">#{artist.rank}</span>
                  <span className="stat-label">Your Rank</span>
                </div>
              </div>

              <div className="popularity-detailed">
                <div className="popularity-header">
                  <span className="popularity-title">Popularity Score</span>
                  <span className="popularity-percentage">{artist.popularity}%</span>
                </div>
                <div className="popularity-bar-large">
                  <div 
                    className="popularity-fill-large" 
                    style={{ width: `${artist.popularity}%` }}
                  />
                </div>
                <div className="popularity-description">
                  {artist.popularity >= 90 && "One of the most popular artists on Spotify"}
                  {artist.popularity >= 80 && artist.popularity < 90 && "Very popular mainstream artist"}
                  {artist.popularity >= 70 && artist.popularity < 80 && "Well-known and widely listened to"}
                  {artist.popularity >= 60 && artist.popularity < 70 && "Growing in popularity"}
                  {artist.popularity >= 40 && artist.popularity < 60 && "Building a solid fanbase"}
                  {artist.popularity < 40 && "Indie artist with dedicated fans"}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-sections">
            <div className="section">
              <h3 className="section-title">🎵 Musical Genres</h3>
              <div className="genres-detailed">
                {artist.genres && artist.genres.length > 0 ? (
                  artist.genres.map((genre, index) => (
                    <span key={index} className="genre-pill">
                      {genre}
                    </span>
                  ))
                ) : (
                  <p className="no-data">No genre information available</p>
                )}
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">📊 Your Listening Stats</h3>
              <div className="listening-insights">
                <div className="insight-item">
                  <span className="insight-icon">🎯</span>
                  <div className="insight-content">
                    <strong>Your #{artist.rank} most played artist</strong>
                    <p>They're clearly one of your favorites!</p>
                  </div>
                </div>
                
                <div className="insight-item">
                  <span className="insight-icon">🌟</span>
                  <div className="insight-content">
                    <strong>Popularity Match</strong>
                    <p>
                      {artist.popularity >= 80 && "You have mainstream taste with this one!"}
                      {artist.popularity >= 60 && artist.popularity < 80 && "Good balance of popular and unique taste"}
                      {artist.popularity < 60 && "You discovered them before they were cool!"}
                    </p>
                  </div>
                </div>

                {artist.genres && artist.genres.length > 0 && (
                  <div className="insight-item">
                    <span className="insight-icon">🎨</span>
                    <div className="insight-content">
                      <strong>Genre Explorer</strong>
                      <p>You enjoy {artist.genres[0]} and {artist.genres.length - 1} other genre{artist.genres.length > 2 ? 's' : ''}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">🔗 Quick Actions</h3>
              <div className="modal-actions">
                {artist.external_urls?.spotify && (
                  <button 
                    className="modal-action-btn spotify-btn"
                    onClick={() => window.open(artist.external_urls.spotify, '_blank')}
                  >
                    <span className="btn-icon">🎵</span>
                    <span className="btn-text">Open in Spotify</span>
                  </button>
                )}
                
                <button 
                  className="modal-action-btn share-btn"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Check out ${artist.name} on YearInSongs`,
                        text: `${artist.name} is my #${artist.rank} most played artist!`,
                        url: window.location.href
                      });
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(`${artist.name} is my #${artist.rank} most played artist on YearInSongs!`);
                      alert('Artist info copied to clipboard!');
                    }
                  }}
                >
                  <span className="btn-icon">🔗</span>
                  <span className="btn-text">Share Artist</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistModal;