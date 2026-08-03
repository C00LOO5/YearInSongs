// src/components/Common/Navigation.js - Updated with User Profile and Logout
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/tracks', label: 'Top Tracks', icon: '🎵' },
    { path: '/artists', label: 'Top Artists', icon: '🎤' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="app-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>🎶 YearInSongs</h2>
          <span className="nav-subtitle">Your Music, Your Story</span>
        </div>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          {user && (
            <div className="user-menu">
              <button 
                className="user-profile-btn"
                onClick={toggleUserMenu}
                title="User menu"
              >
                {user.images && user.images.length > 0 ? (
                  <img 
                    src={user.images[0].url} 
                    alt={user.display_name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.display_name?.charAt(0)?.toUpperCase() || '👤'}
                  </div>
                )}
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <p className="user-name">{user.display_name || 'Spotify User'}</p>
                      <p className="user-email">{user.email || ''}</p>
                      <p className="user-plan">
                        {user.product === 'premium' ? '✨ Premium' : '🎵 Free'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-actions">
                    {user.external_urls?.spotify && (
                      <button 
                        className="dropdown-item"
                        onClick={() => window.open(user.external_urls.spotify, '_blank')}
                      >
                        <span className="item-icon">🎵</span>
                        <span>View on Spotify</span>
                      </button>
                    )}
                    
                    <button className="dropdown-item" disabled>
                      <span className="item-icon">⚙️</span>
                      <span>Settings (Coming Soon)</span>
                    </button>
                    
                    <button className="dropdown-item" disabled>
                      <span className="item-icon">📊</span>
                      <span>Export Data (Coming Soon)</span>
                    </button>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <span className="item-icon">🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {showUserMenu && (
        <div 
          className="menu-overlay" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navigation;