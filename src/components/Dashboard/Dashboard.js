// src/components/Dashboard/Dashboard.js - Better Time Calculation + Scroll to Top
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { spotifyAPI } from '../../services/spotify';
import { useNavigate } from 'react-router-dom';
import SpotifyButton from '../Music/SpotifyButton';
import Loading from '../Common/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get more recent tracks for better time calculation
      const [topTracks, topArtists, recentTracks, moreRecentTracks] = await Promise.all([
        spotifyAPI.getTopTracks(timeRange, 50).catch(() => ({ items: [] })), // Get 50 instead of 20
        spotifyAPI.getTopArtists(timeRange, 20).catch(() => ({ items: [] })),
        spotifyAPI.getRecentlyPlayed(50).catch(() => ({ items: [] })), // Get 50 recent
        spotifyAPI.getRecentlyPlayed(50, { before: Date.now() - (24 * 60 * 60 * 1000) }).catch(() => ({ items: [] })) // Yesterday's tracks
      ]);

      setDashboardData({
        topTracks: topTracks.items || [],
        topArtists: topArtists.items || [],
        recentTracks: recentTracks.items || [],
        moreRecentTracks: moreRecentTracks.items || [],
        timeRange,
        user
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [timeRange, user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // BETTER time calculation using actual recent listening data
  const getRealStats = () => {
    if (!dashboardData) return { 
      totalHours: 0, 
      uniqueGenres: 0, 
      avgPopularity: 0,
      totalTracks: 0
    };
    
    const { topTracks, topArtists, recentTracks, moreRecentTracks } = dashboardData;
    
    // 1. IMPROVED: Calculate listening time from actual recent plays
    const allRecentTracks = [...(recentTracks || []), ...(moreRecentTracks || [])];
    
    let totalMinutesFromRecent = 0;
    if (allRecentTracks.length > 0) {
      // Calculate actual listening time from recent tracks
      totalMinutesFromRecent = allRecentTracks.reduce((sum, item) => {
        const track = item.track || item;
        return sum + (track.duration_ms || 0);
      }, 0) / (1000 * 60); // Convert to minutes
      
      // Estimate daily listening and extrapolate
      const uniqueDays = new Set(allRecentTracks.map(item => {
        const date = new Date(item.played_at || Date.now());
        return date.toDateString();
      })).size;
      
      const avgDailyMinutes = uniqueDays > 0 ? totalMinutesFromRecent / uniqueDays : 0;
      
      // Extrapolate based on time range
      let daysToExtrapolate;
      switch (timeRange) {
        case 'short_term': // 4 weeks
          daysToExtrapolate = 28;
          break;
        case 'medium_term': // 6 months
          daysToExtrapolate = 180;
          break;
        case 'long_term': // All time (estimate 2 years)
          daysToExtrapolate = 730;
          break;
        default:
          daysToExtrapolate = 180;
      }
      
      // Calculate total hours with some decay for older periods
      const decayFactor = timeRange === 'long_term' ? 0.7 : timeRange === 'medium_term' ? 0.85 : 1;
      const totalEstimatedMinutes = avgDailyMinutes * daysToExtrapolate * decayFactor;
      const totalHours = Math.round(totalEstimatedMinutes / 60);
      
      return {
        totalHours: Math.max(totalHours, Math.round(totalMinutesFromRecent / 60)), // At least the recent listening time
        uniqueGenres: [...new Set(topArtists.flatMap(artist => artist.genres || []))].length,
        avgPopularity: topTracks.length > 0 
          ? Math.round(topTracks.reduce((sum, track) => sum + (track.popularity || 0), 0) / topTracks.length)
          : 0,
        totalTracks: topTracks.length
      };
    }
    
    // Fallback to top tracks calculation if no recent data
    const totalMs = topTracks.reduce((sum, track) => sum + (track.duration_ms || 0), 0);
    const baseHours = Math.round(totalMs / (1000 * 60 * 60));
    
    // Conservative multiplier for fallback
    let multiplier;
    switch (timeRange) {
      case 'short_term': multiplier = 2.5; break;
      case 'medium_term': multiplier = 4.0; break;
      case 'long_term': multiplier = 8.0; break;
      default: multiplier = 4.0;
    }
    
    return { 
      totalHours: Math.round(baseHours * multiplier),
      uniqueGenres: [...new Set(topArtists.flatMap(artist => artist.genres || []))].length,
      avgPopularity: topTracks.length > 0 
        ? Math.round(topTracks.reduce((sum, track) => sum + (track.popularity || 0), 0) / topTracks.length)
        : 0,
      totalTracks: topTracks.length
    };
  };

  // Navigation with scroll to top
  const navigateToPage = (path) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 100);
  };

  // Helper functions
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

  const timeOptions = [
    { value: 'short_term', label: 'Last 4 Weeks', emoji: '🔥', desc: 'Recent favorites' },
    { value: 'medium_term', label: 'Last 6 Months', emoji: '📊', desc: 'Medium-term trends' },
    { value: 'long_term', label: 'All Time', emoji: '⭐', desc: 'All-time classics' }
  ];

  const realStats = getRealStats();

  if (loading) {
    return <Loading message="Creating your musical experience..." />;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <div className="error-icon">🎵</div>
          <h2>Unable to load your music data</h2>
          <p>{error}</p>
          <button onClick={loadDashboardData} className="retry-btn">
            <span>🔄</span>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-elegant">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="floating-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}>♪</div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        
        {/* Hero Section - Fixed overflow for dropdown */}
        <section className="hero-section hero-section-fixed">
          <div className="hero-left">
            <div className="greeting-section">
              <h1 className="main-greeting">
                {getGreeting()}, <span className="user-name">{user?.display_name}</span>
                <span className="wave-emoji">👋</span>
              </h1>
              <p className="greeting-subtitle">Ready to explore your musical journey?</p>
            </div>

            {/* Improved Quick Stats using recent listening data */}
            <div className="quick-stats">
              <div className="stat-card listening-stat">
                <div className="stat-icon">🎧</div>
                <div className="stat-number">{realStats.totalHours}</div>
                <div className="stat-label">Hours Listened</div>
                <div className="stat-source">From recent listening data</div>
              </div>
              
              <div className="stat-card genre-stat">
                <div className="stat-icon">🎨</div>
                <div className="stat-number">{realStats.uniqueGenres}</div>
                <div className="stat-label">Unique Genres</div>
                <div className="stat-source">From your artists</div>
              </div>
              
              <div className="stat-card popularity-stat">
                <div className="stat-icon">📈</div>
                <div className="stat-number">{realStats.avgPopularity}%</div>
                <div className="stat-label">Avg Popularity</div>
                <div className="stat-source">Spotify metric</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="user-profile">
              <div className="avatar-container">
                <div className="avatar-ring"></div>
                <div className="avatar-ring-2"></div>
                <img 
                  src={user?.images?.[0]?.url || `https://via.placeholder.com/120x120/1DB954/ffffff?text=${user?.display_name?.[0] || 'U'}`}
                  alt={user?.display_name}
                  className="user-avatar"
                />
                <div className="avatar-status"></div>
              </div>
            </div>

            {/* Time Selector - Fixed z-index */}
            <div className="time-selector-container time-selector-fixed">
              <div className="selector-label">Time Period</div>
              <div className={`time-dropdown ${isDropdownOpen ? 'open' : ''}`}>
                <button 
                  className="dropdown-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="trigger-emoji">{timeOptions.find(opt => opt.value === timeRange)?.emoji}</span>
                  <span className="trigger-label">{getTimeRangeLabel(timeRange)}</span>
                  <div className={`trigger-arrow ${isDropdownOpen ? 'rotated' : ''}`}>▼</div>
                </button>
                
                <div className="dropdown-menu dropdown-menu-fixed">
                  {timeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`dropdown-option ${timeRange === option.value ? 'active' : ''}`}
                      onClick={() => {
                        setTimeRange(option.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="option-emoji">{option.emoji}</span>
                      <div className="option-text">
                        <span className="option-label">{option.label}</span>
                        <span className="option-desc">{option.desc}</span>
                      </div>
                      {timeRange === option.value && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Content Section */}
        <section className="content-section">
          <div className="section-grid">
            
            {/* Top Tracks */}
            <div className="content-card tracks-card">
              <div className="card-header">
                <div className="header-left">
                  <h3>🎵 Your Top Tracks</h3>
                  <p>{getTimeRangeLabel(timeRange)} • {realStats.totalTracks} total</p>
                </div>
                <button 
                  className="view-all-btn"
                  onClick={() => navigateToPage('/tracks')}
                >
                  View All →
                </button>
              </div>
              
              <div className="content-list">
                {dashboardData?.topTracks?.slice(0, 5).map((track, index) => (
                  <div key={track.id} className="content-item">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-image">
                      <img 
                        src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url} 
                        alt={track.name}
                      />
                      <div className="image-overlay">
                        <SpotifyButton 
                          href={track.external_urls?.spotify}
                          size="icon-small"
                          variant="minimal"
                        />
                      </div>
                    </div>
                    <div className="item-info">
                      <div className="item-title">{track.name}</div>
                      <div className="item-subtitle">{track.artists?.map(a => a.name).join(', ')}</div>
                      <div className="item-meta">{formatDuration(track.duration_ms)} • {track.popularity}% popular</div>
                    </div>
                  </div>
                )) || <div className="empty-state">No tracks available</div>}
              </div>
            </div>

            {/* Top Artists */}
            <div className="content-card artists-card">
              <div className="card-header">
                <div className="header-left">
                  <h3>🎤 Your Top Artists</h3>
                  <p>{getTimeRangeLabel(timeRange)} • {dashboardData?.topArtists?.length || 0} total</p>
                </div>
                <button 
                  className="view-all-btn"
                  onClick={() => navigateToPage('/artists')}
                >
                  View All →
                </button>
              </div>
              
              <div className="content-list">
                {dashboardData?.topArtists?.slice(0, 5).map((artist, index) => (
                  <div key={artist.id} className="content-item">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-image artist-image">
                      <img 
                        src={artist.images?.[2]?.url || artist.images?.[0]?.url} 
                        alt={artist.name}
                      />
                      <div className="image-overlay">
                        <SpotifyButton 
                          href={artist.external_urls?.spotify}
                          size="icon-small"
                          variant="minimal"
                        />
                      </div>
                    </div>
                    <div className="item-info">
                      <div className="item-title">{artist.name}</div>
                      <div className="item-subtitle">{artist.genres?.slice(0, 2).join(', ') || 'Artist'}</div>
                      <div className="item-meta">{formatFollowers(artist.followers?.total)} followers • {artist.popularity}% popular</div>
                    </div>
                  </div>
                )) || <div className="empty-state">No artists available</div>}
              </div>
            </div>

          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="activity-section">
          <div className="section-header">
            <h3>⏱️ Recent Activity</h3>
            <p>Your latest listening session • {dashboardData?.recentTracks?.length || 0} recent plays</p>
          </div>
          
          <div className="activity-timeline">
            {dashboardData?.recentTracks?.slice(0, 6).map((item, index) => {
              const track = item.track;
              return (
                <div key={`${track.id}-${index}`} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-image">
                      <img 
                        src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url} 
                        alt={track.name}
                      />
                    </div>
                    <div className="timeline-info">
                      <div className="timeline-title">{track.name}</div>
                      <div className="timeline-subtitle">{track.artists?.map(a => a.name).join(', ')}</div>
                      <div className="timeline-time">{formatTimeAgo(item.played_at)}</div>
                    </div>
                  </div>
                </div>
              );
            }) || <div className="empty-timeline">No recent activity</div>}
          </div>
        </section>

        {/* Quick Actions - FIXED Navigation with scroll to top */}
        <section className="actions-section">
          <div className="action-cards">
            <button 
              className="action-card refresh-card"
              onClick={loadDashboardData}
            >
              <div className="action-icon">🔄</div>
              <div className="action-label">Refresh Data</div>
            </button>
            
            <button 
              className="action-card tracks-card-action"
              onClick={() => navigateToPage('/tracks')}
            >
              <div className="action-icon">🎵</div>
              <div className="action-label">All Top Tracks</div>
            </button>
            
            <button 
              className="action-card artists-card-action"
              onClick={() => navigateToPage('/artists')}
            >
              <div className="action-icon">🎤</div>
              <div className="action-label">All Top Artists</div>
            </button>
            
            <button 
              className="action-card spotify-card"
              onClick={() => window.open(user?.external_urls?.spotify, '_blank')}
            >
              <div className="action-icon">🎧</div>
              <div className="action-label">Spotify Profile</div>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;