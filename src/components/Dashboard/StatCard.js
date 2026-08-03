// src/components/Dashboard/StatCard.js
import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, subtitle, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-icon">{icon}</div>
        {trend && (
          <div className={`stat-trend ${trend.direction}`}>
            {trend.direction === 'up' ? '↗️' : '↘️'}
            <span>{trend.percentage}%</span>
          </div>
        )}
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;