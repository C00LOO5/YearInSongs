// src/components/Visualizations/Heatmap.js
import React from 'react';
import './Heatmap.css';

const Heatmap = ({ listeningData }) => {
  const { hourlyDistribution, dailyDistribution } = listeningData;
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hourLabels = Array.from({ length: 24 }, (_, i) => 
    i === 0 ? '12 AM' : i === 12 ? '12 PM' : i < 12 ? `${i} AM` : `${i - 12} PM`
  );

  const maxHourlyValue = Math.max(...hourlyDistribution);
  const maxDailyValue = Math.max(...dailyDistribution);

  const getIntensity = (value, max) => {
    if (max === 0) return 0;
    return (value / max) * 100;
  };

  return (
    <div className="heatmap">
      <div className="heatmap-section">
        <h3>Listening by Hour</h3>
        <div className="hourly-heatmap">
          {hourlyDistribution.map((count, hour) => (
            <div
              key={hour}
              className="heatmap-cell"
              style={{
                backgroundColor: `rgba(29, 185, 84, ${getIntensity(count, maxHourlyValue) / 100})`,
              }}
              title={`${hourLabels[hour]}: ${count} tracks`}
            >
              <span className="hour-label">{hour}</span>
              <span className="count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-section">
        <h3>Listening by Day</h3>
        <div className="daily-heatmap">
          {dailyDistribution.map((count, day) => (
            <div
              key={day}
              className="heatmap-cell day-cell"
              style={{
                backgroundColor: `rgba(29, 185, 84, ${getIntensity(count, maxDailyValue) / 100})`,
              }}
              title={`${dayNames[day]}: ${count} tracks`}
            >
              <span className="day-label">{dayNames[day]}</span>
              <span className="count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;