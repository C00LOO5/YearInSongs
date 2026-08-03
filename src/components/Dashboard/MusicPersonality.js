// src/components/Dashboard/MusicPersonality.js - Fixed Version with Error Handling
import React from 'react';
import './MusicPersonality.css';

const MusicPersonality = ({ audioFeatures }) => {
  const analyzePersonality = () => {
    // Fix: Ensure audioFeatures is an array and has valid data
    if (!audioFeatures || !Array.isArray(audioFeatures) || audioFeatures.length === 0) {
      return {
        type: "Music Explorer",
        description: "Discovering your musical personality...",
        traits: [],
        color: "#1DB954",
        icon: "🎵"
      };
    }

    // Filter out any invalid entries and ensure we have valid numbers
    const validFeatures = audioFeatures.filter(f => 
      f && 
      typeof f.danceability === 'number' && 
      typeof f.energy === 'number' && 
      typeof f.valence === 'number'
    );

    if (validFeatures.length === 0) {
      return {
        type: "Music Explorer",
        description: "Analyzing your music taste...",
        traits: [],
        color: "#1DB954",
        icon: "🎵"
      };
    }

    // Calculate averages with safe fallbacks
    const avgDanceability = validFeatures.reduce((sum, f) => sum + (f.danceability || 0), 0) / validFeatures.length;
    const avgEnergy = validFeatures.reduce((sum, f) => sum + (f.energy || 0), 0) / validFeatures.length;
    const avgValence = validFeatures.reduce((sum, f) => sum + (f.valence || 0), 0) / validFeatures.length;
    const avgAcousticness = validFeatures.reduce((sum, f) => sum + (f.acousticness || 0), 0) / validFeatures.length;
    const avgInstrumentalness = validFeatures.reduce((sum, f) => sum + (f.instrumentalness || 0), 0) / validFeatures.length;
    const avgTempo = validFeatures.reduce((sum, f) => sum + (f.tempo || 120), 0) / validFeatures.length;

    // Determine personality type
    let personalityType = {};

    if (avgEnergy > 0.7 && avgDanceability > 0.7) {
      personalityType = {
        type: "Party Animal",
        description: "You live for high-energy bangers that get everyone moving!",
        icon: "🎉",
        color: "#FF6B6B",
        traits: ["High Energy", "Dance Master", "Party Ready"]
      };
    } else if (avgValence > 0.7 && avgEnergy > 0.6) {
      personalityType = {
        type: "Sunshine Vibes",
        description: "Your playlist radiates positivity and good vibes all around.",
        icon: "☀️",
        color: "#FFD93D",
        traits: ["Positive", "Uplifting", "Feel Good"]
      };
    } else if (avgAcousticness > 0.6 && avgValence < 0.5) {
      personalityType = {
        type: "Acoustic Soul",
        description: "You appreciate the raw, emotional power of acoustic music.",
        icon: "🎸",
        color: "#A0522D",
        traits: ["Acoustic", "Emotional", "Authentic"]
      };
    } else if (avgInstrumentalness > 0.3) {
      personalityType = {
        type: "Instrumental Enthusiast",
        description: "You find beauty in the language of instruments without words.",
        icon: "🎼",
        color: "#6B5B95",
        traits: ["Instrumental", "Complex", "Artistic"]
      };
    } else if (avgEnergy < 0.4 && avgValence < 0.4) {
      personalityType = {
        type: "Melancholic Dreamer",
        description: "You connect deeply with introspective, emotional soundscapes.",
        icon: "🌙",
        color: "#4A90E2",
        traits: ["Introspective", "Deep", "Emotional"]
      };
    } else if (avgTempo > 140 && avgEnergy > 0.8) {
      personalityType = {
        type: "Electronic Explorer",
        description: "Fast beats and electronic sounds fuel your musical journey.",
        icon: "⚡",
        color: "#E74C3C",
        traits: ["Fast-paced", "Electronic", "Energetic"]
      };
    } else if (avgDanceability > 0.6 && avgValence > 0.5) {
      personalityType = {
        type: "Groove Master",
        description: "You know how to find the perfect rhythm for any moment.",
        icon: "💃",
        color: "#9B59B6",
        traits: ["Groovy", "Rhythmic", "Danceable"]
      };
    } else {
      personalityType = {
        type: "Balanced Curator",
        description: "Your taste spans across moods and styles with perfect balance.",
        icon: "⚖️",
        color: "#1DB954",
        traits: ["Diverse", "Balanced", "Versatile"]
      };
    }

    return personalityType;
  };

  const personality = analyzePersonality();

  const getFeatureBar = (value, label, color) => (
    <div className="feature-bar-container" key={label}>
      <div className="feature-label">
        <span>{label}</span>
        <span className="feature-value">{Math.round((value || 0) * 100)}%</span>
      </div>
      <div className="feature-bar">
        <div 
          className="feature-fill" 
          style={{ 
            width: `${(value || 0) * 100}%`,
            backgroundColor: color 
          }}
        ></div>
      </div>
    </div>
  );

  // Safe feature calculation with error handling
  const features = (() => {
    if (!audioFeatures || !Array.isArray(audioFeatures) || audioFeatures.length === 0) {
      return [];
    }

    const validFeatures = audioFeatures.filter(f => 
      f && 
      typeof f.danceability === 'number' && 
      typeof f.energy === 'number' && 
      typeof f.valence === 'number' &&
      typeof f.acousticness === 'number'
    );

    if (validFeatures.length === 0) {
      return [];
    }

    return [
      { 
        value: validFeatures.reduce((sum, f) => sum + (f.danceability || 0), 0) / validFeatures.length, 
        label: 'Danceability', 
        color: '#FF6B6B' 
      },
      { 
        value: validFeatures.reduce((sum, f) => sum + (f.energy || 0), 0) / validFeatures.length, 
        label: 'Energy', 
        color: '#4ECDC4' 
      },
      { 
        value: validFeatures.reduce((sum, f) => sum + (f.valence || 0), 0) / validFeatures.length, 
        label: 'Positivity', 
        color: '#45B7D1' 
      },
      { 
        value: validFeatures.reduce((sum, f) => sum + (f.acousticness || 0), 0) / validFeatures.length, 
        label: 'Acousticness', 
        color: '#96CEB4' 
      }
    ];
  })();

  return (
    <div className="music-personality">
      <div className="personality-card">
        <div className="card-header">
          <h2 className="section-title">
            <span className="title-icon">🎭</span>
            Your Music Personality
          </h2>
        </div>

        <div className="personality-content">
          <div className="personality-main">
            <div className="personality-avatar" style={{ backgroundColor: personality.color }}>
              <span className="avatar-icon">{personality.icon}</span>
              <div className="avatar-glow" style={{ backgroundColor: personality.color }}></div>
            </div>
            
            <div className="personality-info">
              <h3 className="personality-type">{personality.type}</h3>
              <p className="personality-description">{personality.description}</p>
              
              <div className="personality-traits">
                {personality.traits.map((trait, index) => (
                  <span key={index} className="trait-tag" style={{ borderColor: personality.color, color: personality.color }}>
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {features.length > 0 && (
            <div className="audio-features">
              <h4 className="features-title">Audio Profile</h4>
              <div className="features-grid">
                {features.map(feature => getFeatureBar(feature.value, feature.label, feature.color))}
              </div>
            </div>
          )}

          {features.length === 0 && (
            <div className="no-features">
              <div className="no-features-icon">🎵</div>
              <p>Audio analysis will appear here once more tracks are loaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPersonality;