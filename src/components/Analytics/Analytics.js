// src/components/Analytics/Analytics.js
import { useCallback, useEffect, useState } from 'react';
import { spotifyAPI } from '../../services/spotify';
import Loading from '../Common/Loading';
import '../Music/TopTracks.css'; // Import the exact CSS from Top Tracks
import PieChart from '../Visualization/PieChart';
import './Analytics.css';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [genreData, setGenreData] = useState(null);

  const loadAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const topArtistsData = await spotifyAPI.getTopArtists(timeRange, 50).catch(() => ({ items: [] }));
      const artists = topArtistsData.items || [];

      if (artists.length === 0) {
        setGenreData(null);
        setLoading(false);
        return;
      }

      const genreCounts = {};
      artists.forEach(artist => {
        if (artist.genres) {
          artist.genres.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });

      const sortedGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6);

      if (sortedGenres.length === 0) {
        setGenreData(null);
        setLoading(false);
        return;
      }

      setGenreData(
        sortedGenres.map(([genre, count]) => ({
          genre: genre.charAt(0).toUpperCase() + genre.slice(1),
          count: count
        }))
      );

    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const timeOptions = [
    { value: 'short_term', label: 'Last 4 Weeks', emoji: '🔥' },
    { value: 'medium_term', label: 'Last 6 Months', emoji: '📊' },
    { value: 'long_term', label: 'All Time', emoji: '⭐' }
  ];

  const getTimeRangeLabel = (range) => {
    return timeOptions.find(opt => opt.value === range)?.label || 'Last 6 Months';
  };

  if (loading) {
    return <Loading message="Analyzing your music genres..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Unable to analyze data</h2>
        <p>{error}</p>
        <button onClick={loadAnalyticsData} className="retry-button">Try Again</button>
      </div>
    );
  }

  return (
    <div className="top-tracks-page"> {/* Reuse main wrapper class */}

      {/* Header Section Matched Exactly to TopTracks */}
      <div className="tracks-header">
        <div className="header-content">
          <h1 className="page-title">📊 Your Genre Distribution</h1>
          <p className="page-subtitle">
            Based on your top artists • {getTimeRangeLabel(timeRange)}
          </p>
        </div>

        <div className="tracks-controls">
          <div className="time-selector-dropdown">
            <label htmlFor="timeRange" className="selector-label">
              Time Period:
            </label>
            <div className="dropdown-container">
              <select
                id="timeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="time-dropdown"
              >
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
              <div className="dropdown-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="content-card" style={{ background: 'rgba(38, 40, 40, 0.75)', backdropFilter: 'blur(20px)', padding: 'var(--space-32)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-card-border)', boxShadow: 'var(--shadow-sm)' }}>
        {genreData ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <PieChart genreData={genreData} />
          </div>
        ) : (
          <div className="empty-state-elevated" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="empty-icon" style={{ fontSize: '48px', opacity: 0.5, marginBottom: '16px' }}>🎧</div>
            <h4 style={{ color: 'var(--color-text)', margin: '0 0 8px 0', fontSize: 'var(--font-size-xl)' }}>Not enough data</h4>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Listen to more music to generate your genre profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
