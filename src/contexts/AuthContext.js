// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Spotify OAuth configuration
  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const AUTH_URL = process.env.REACT_APP_SPOTIFY_AUTH_URL;
  const TOKEN_URL = process.env.REACT_APP_SPOTIFY_TOKEN_URL;

  const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-library-read',
    'playlist-read-private',
    'user-read-recently-played'
  ].join(' ');

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const storedToken = localStorage.getItem('spotify_access_token');
      const storedRefreshToken = localStorage.getItem('spotify_refresh_token');
      const tokenExpiry = localStorage.getItem('spotify_token_expiry');

      if (storedToken && tokenExpiry) {
        const now = Date.now();
        const expiry = parseInt(tokenExpiry, 10);

        if (now < expiry) {
          // Token is still valid
          setAccessToken(storedToken);
          setRefreshToken(storedRefreshToken);
          await fetchUserProfile(storedToken);
        } else if (storedRefreshToken) {
          // Token expired, try to refresh
          await refreshAccessToken(storedRefreshToken);
        } else {
          // No valid token, user needs to login
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      show_dialog: 'true'
    });

    window.location.href = `${AUTH_URL}?${params.toString()}`;
  };

  const handleAuthCallback = async (code) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        })
      });

      if (!response.ok) {
        throw new Error('Failed to exchange authorization code');
      }

      const data = await response.json();
      
      const { access_token, refresh_token, expires_in } = data;
      const expiryTime = Date.now() + (expires_in * 1000);

      // Store tokens
      localStorage.setItem('spotify_access_token', access_token);
      localStorage.setItem('spotify_refresh_token', refresh_token);
      localStorage.setItem('spotify_token_expiry', expiryTime.toString());

      setAccessToken(access_token);
      setRefreshToken(refresh_token);

      // Fetch user profile
      await fetchUserProfile(access_token);
      
    } catch (error) {
      console.error('Auth callback error:', error);
      setError(error.message);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (refresh_token) => {
    try {
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const { access_token, expires_in } = data;
      const expiryTime = Date.now() + (expires_in * 1000);

      localStorage.setItem('spotify_access_token', access_token);
      localStorage.setItem('spotify_token_expiry', expiryTime.toString());

      setAccessToken(access_token);
      await fetchUserProfile(access_token);

    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthData();
      throw error;
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const clearAuthData = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
  };

  const isAuthenticated = () => {
    return !!(accessToken && user);
  };

  const getValidToken = async () => {
    if (!accessToken) return null;

    const tokenExpiry = localStorage.getItem('spotify_token_expiry');
    if (tokenExpiry && Date.now() >= parseInt(tokenExpiry, 10)) {
      // Token expired, try to refresh
      if (refreshToken) {
        try {
          await refreshAccessToken(refreshToken);
          return accessToken;
        } catch (error) {
          return null;
        }
      }
      return null;
    }

    return accessToken;
  };

  const value = {
    user,
    accessToken,
    loading,
    error,
    login,
    logout,
    handleAuthCallback,
    isAuthenticated: isAuthenticated(),
    getValidToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};