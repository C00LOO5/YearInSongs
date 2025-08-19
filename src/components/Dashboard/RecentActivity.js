// src/components/Dashboard/RecentActivity.js - Recent Listening Activity
import React from 'react';
import SpotifyButton from '../Music/SpotifyButton';
import './RecentActivity.css';

const RecentActivity = ({ recentTracks }) => {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const played = new Date(timestamp);
    const diffInMinutes = Math.floor((now - played) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return played.toLocaleDateString();
  };

  const getUniqueRecentTracks = () => {
    if (!recentTracks || recentTracks.length === 0) return [];
    
    const seen = new Set();
    return recentTracks.filter(item => {
      const track = item.track;
      if (seen.has(track.id)) return false;
      seen.add(track.id);
      return true;
    }).slice(0, 8);
  };

  const uniqueTracks = getUniqueRecentTracks();

  if (uniqueTracks.length === 0) {
    return (
      <div className="recent-activity">
        <div className="activity-header">
          <h3 className="section-title">
            <span className="title-icon">⏱️</span>
            Recent Activity
          </h3>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <p>No recent activity found</p>
          <span>Start listening to see your activity here</span>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3 className="section-title">
          <span className="title-icon">⏱️</span>
          Recent Activity
        </h3>
        <div className="activity-stats">
          <span className="stats-text">Last 50 tracks</span>
        </div>
      </div>

      <div className="activity-timeline">
        {uniqueTracks.map((item, index) => {
          const track = item.track;
          return (
            <div key={`${track.id}-${index}`} className="timeline-item">
              <div className="timeline-marker">
                <div className="marker-dot"></div>
                {index < uniqueTracks.length - 1 && <div className="marker-line"></div>}
              </div>
              
              <div className="timeline-content">
                <div className="track-card">
                  <div className="track-image">
                    <img 
                      src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || 'https://via.placeholder.com/64x64/1DB954/ffffff?text=♪'}
                      alt={`${track.name} album cover`}
                    />
                    <div className="image-overlay">
                      <SpotifyButton 
                        href={track.external_urls?.spotify}
                        size="icon-small"
                        variant="minimal"
                        title="Play in Spotify"
                      />
                    </div>
                  </div>
                  
                  <div className="track-info">
                    <div className="track-main">
                      <h4 className="track-name" title={track.name}>
                        {track.name}
                      </h4>
                      <p className="track-artist" title={track.artists?.map(a => a.name).join(', ')}>
                        {track.artists?.map(a => a.name).join(', ')}
                      </p>
                    </div>
                    
                    <div className="track-meta">
                      <span className="play-time">{formatTimeAgo(item.played_at)}</span>
                      {track.explicit && (
                        <span className="explicit-badge">E</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="activity-footer">
        <div className="listening-summary">
          <div className="summary-item">
            <span className="summary-icon">🎧</span>
            <span className="summary-text">{recentTracks.length} plays recently</span>
          </div>
          
          {recentTracks.length > 0 && (
            <div className="summary-item">
              <span className="summary-icon">🕒</span>
              <span className="summary-text">
                Last played {formatTimeAgo(recentTracks[0].played_at)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;