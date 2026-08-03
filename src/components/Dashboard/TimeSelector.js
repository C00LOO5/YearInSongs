// src/components/Dashboard/TimeSelector.js
import React from 'react';
import './TimeSelector.css';

const TimeSelector = ({ timeRange, onChange, label }) => {
  const timeOptions = [
    { value: 'short_term', label: 'Last 4 Weeks' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' }
  ];

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="time-selector">
      <label className="time-selector-label">Time Period</label>
      <select 
        className="time-selector-dropdown"
        value={timeRange}
        onChange={handleChange}
      >
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="time-selector-display">
        Currently showing: <span className="current-period">{label}</span>
      </div>
    </div>
  );
};

export default TimeSelector;