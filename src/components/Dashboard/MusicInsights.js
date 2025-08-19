// src/components/Dashboard/MusicInsights.js - Music Analytics and Insights
import React from 'react';
import './MusicInsights.css';

const MusicInsights = ({ data }) => {
  const generateInsights = () => {
    if (!data || !data.topTracks.length || !data.topArtists.length) {
      return [];
    }

    const insights = [];
    const { topTracks, topArtists, recentTracks } = data;

    // Genre Analysis
    const allGenres = topArtists.flatMap(artist => artist.genres || []);
    const genreCount = {};
    allGenres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
    const topGenre = Object.entries(genreCount).sort(([,a], [,b]) => b - a)[0];
    
    if (topGenre) {
      insights.push({
        id: 'genre',
        icon: '🎨',
        title: 'Top Genre',
        value: topGenre[0],
        description: `${topGenre[1]} artists in your top list`,
        color: '#E74C3C',
        trend: 'up'
      });
    }

    // Popularity Analysis
    const avgPopularity = topTracks.reduce((sum, track) => sum + (track.popularity || 0), 0) / topTracks.length;
    const popularityCategory = avgPopularity >= 70 ? 'Mainstream' : avgPopularity >= 40 ? 'Balanced' : 'Underground';
    
    insights.push({
      id: 'popularity',
      icon: '📊',
      title: 'Music Taste',
      value: popularityCategory,
      description: `Average popularity: ${Math.round(avgPopularity)}%`,
      color: '#3498DB',
      trend: avgPopularity >= 60 ? 'up' : 'down'
    });

    // Discovery Rate
    const indieArtists = topArtists.filter(artist => (artist.followers?.total || 0) < 1000000);
    const discoveryRate = Math.round((indieArtists.length / topArtists.length) * 100);
    
    insights.push({
      id: 'discovery',
      icon: '💎',
      title: 'Discovery Rate',
      value: `${discoveryRate}%`,
      description: 'Artists with <1M followers',
      color: '#9B59B6',
      trend: discoveryRate >= 50 ? 'up' : 'stable'
    });

    // Listening Diversity
    const uniqueArtistCount = new Set(topTracks.flatMap(track => track.artists?.map(a => a.id) || [])).size;
    const diversityScore = Math.min(100, Math.round((uniqueArtistCount / topTracks.length) * 100));
    
    insights.push({
      id: 'diversity',
      icon: '🌈',
      title: 'Diversity Score',
      value: `${diversityScore}%`,
      description: `${uniqueArtistCount} different artists`,
      color: '#2ECC71',
      trend: diversityScore >= 70 ? 'up' : 'stable'
    });

    // Recent Activity Insight
    if (recentTracks && recentTracks.length > 0) {
      const recentHours = recentTracks.length;
      const activityLevel = recentHours >= 30 ? 'High' : recentHours >= 15 ? 'Moderate' : 'Low';
      
      insights.push({
        id: 'activity',
        icon: '🎧',
        title: 'Activity Level',
        value: activityLevel,
        description: `${recentHours} tracks recently`,
        color: '#F39C12',
        trend: 'up'
      });
    }

    // Era Analysis
    const decades = {};
    topTracks.forEach(track => {
      if (track.album?.release_date) {
        const year = parseInt(track.album.release_date.substring(0, 4));
        const decade = Math.floor(year / 10) * 10;
        decades[decade] = (decades[decade] || 0) + 1;
      }
    });
    
    const topDecade = Object.entries(decades).sort(([,a], [,b]) => b - a)[0];
    if (topDecade) {
      insights.push({
        id: 'era',
        icon: '📅',
        title: 'Favorite Era',
        value: `${topDecade[0]}s`,
        description: `${topDecade[1]} tracks from this decade`,
        color: '#E67E22',
        trend: 'stable'
      });
    }

    return insights.slice(0, 6); // Limit to 6 insights
  };

  const insights = generateInsights();

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '📊';
    }
  };

  if (insights.length === 0) {
    return (
      <div className="music-insights">
        <div className="insights-header">
          <h3 className="section-title">
            <span className="title-icon">💡</span>
            Music Insights
          </h3>
        </div>
        <div className="empty-insights">
          <div className="empty-icon">📊</div>
          <p>Generating insights...</p>
          <span>We need more data to show your music insights</span>
        </div>
      </div>
    );
  }

  return (
    <div className="music-insights">
      <div className="insights-header">
        <h3 className="section-title">
          <span className="title-icon">💡</span>
          Music Insights
        </h3>
        <div className="insights-subtitle">
          Discover patterns in your listening habits
        </div>
      </div>

      <div className="insights-grid">
        {insights.map((insight, index) => (
          <div 
            key={insight.id} 
            className="insight-card"
            style={{ 
              '--insight-color': insight.color,
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="card-glow"></div>
            
            <div className="card-header">
              <div className="insight-icon">{insight.icon}</div>
              <div className="trend-indicator">
                {getTrendIcon(insight.trend)}
              </div>
            </div>
            
            <div className="card-content">
              <div className="insight-value">{insight.value}</div>
              <div className="insight-title">{insight.title}</div>
              <div className="insight-description">{insight.description}</div>
            </div>
            
            <div className="card-accent"></div>
          </div>
        ))}
      </div>

      <div className="insights-footer">
        <div className="insight-summary">
          <span className="summary-icon">🔍</span>
          <span className="summary-text">
            Insights update based on your listening patterns
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicInsights;