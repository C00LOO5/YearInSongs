// src/components/Analytics/Analytics.js - Fixed Navigation
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();

  // Fixed navigation function that preserves auth state
  const navigateToPage = (path) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="analytics-coming-soon">
      {/* Animated Background */}
      <div className="coming-soon-background">
        <div className="bg-gradient-analytics-1"></div>
        <div className="bg-gradient-analytics-2"></div>
        <div className="floating-icons">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`floating-icon icon-${i + 1}`}>
              {['📊', '📈', '🎵', '📉', '🎧', '📋'][i]}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="coming-soon-content">
        
        {/* Hero Section */}
        <div className="hero-section-coming-soon">
          <div className="coming-soon-icon">
            <div className="icon-wrapper">
              <span className="main-icon">📊</span>
              <div className="icon-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
          </div>
          
          <h1 className="coming-soon-title">
            Analytics
            <span className="title-accent">Coming Soon</span>
          </h1>
          
          <p className="coming-soon-subtitle">
            We're building something amazing for you! Get ready for deep insights into your music taste, 
            listening patterns, and personalized analytics that will help you discover more about your musical journey.
          </p>
        </div>

        {/* Features Preview */}
        <div className="features-preview">
          <div className="features-grid">
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Listening Trends</h3>
              <p>Track your music evolution over time with detailed charts and insights</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Genre Analysis</h3>
              <p>Discover your genre preferences and how they change throughout the year</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Time Patterns</h3>
              <p>See when you listen most and what moods drive your music choices</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Deep Insights</h3>
              <p>Get personalized recommendations based on your unique listening patterns</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Statistics</h3>
              <p>Comprehensive stats about your artists, tracks, and musical journey</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Predictions</h3>
              <p>AI-powered predictions for your next favorite songs and artists</p>
            </div>
            
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-section">
          <h2>What's Coming</h2>
          <div className="timeline">
            <div className="timeline-item active">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>✅ Phase 1: Foundation</h4>
                <p>Dashboard, Top Tracks & Artists - <strong>Complete!</strong></p>
              </div>
            </div>
            
            <div className="timeline-item upcoming">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>🚧 Phase 2: Analytics</h4>
                <p>Advanced insights and data visualization - <strong>In Development</strong></p>
              </div>
            </div>
            
            <div className="timeline-item future">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>🔮 Phase 3: AI Features</h4>
                <p>Smart recommendations and predictions - <strong>Coming Soon</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - FIXED NAVIGATION */}
        <div className="cta-section">
          <div className="cta-card">
            <h3>Stay Tuned! 🎵</h3>
            <p>In the meantime, explore your current music data in the Dashboard, Tracks, and Artists sections.</p>
            <div className="cta-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigateToPage('/')}
              >
                <span>🏠</span>
                Back to Dashboard
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigateToPage('/tracks')}
              >
                <span>🎵</span>
                Explore Tracks
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;