// src/utils/constants.js
export const SPOTIFY_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000/callback',
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'user-library-read'
  ],
};

export const TIME_RANGES = {
  SHORT_TERM: 'short_term',   // ~4 weeks
  MEDIUM_TERM: 'medium_term', // ~6 months
  LONG_TERM: 'long_term',     // several years
};

export const API_ENDPOINTS = {
  BASE_URL: 'https://api.spotify.com/v1',
  AUTH_URL: 'https://accounts.spotify.com/authorize',
  TOKEN_URL: 'https://accounts.spotify.com/api/token',
};