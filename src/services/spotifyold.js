// src/services/spotify.js
const BASE_URL = 'https://api.spotify.com/v1';

const getAuthHeader = () => {
  const token = localStorage.getItem('spotify_access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const spotifyAPI = {
  // User Profile
  getCurrentUser: async () => {
    const response = await fetch(`${BASE_URL}/me`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Top Items
  getTopTracks: async (timeRange = 'medium_term', limit = 50) => {
    const response = await fetch(
      `${BASE_URL}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      { headers: getAuthHeader() }
    );
    return response.json();
  },

  getTopArtists: async (timeRange = 'medium_term', limit = 50) => {
    const response = await fetch(
      `${BASE_URL}/me/top/artists?time_range=${timeRange}&limit=${limit}`,
      { headers: getAuthHeader() }
    );
    return response.json();
  },

  // Audio Features
  getAudioFeatures: async (trackIds) => {
    const response = await fetch(
      `${BASE_URL}/audio-features?ids=${trackIds.join(',')}`,
      { headers: getAuthHeader() }
    );
    return response.json();
  },

  // Recently Played
  getRecentlyPlayed: async (limit = 50) => {
    const response = await fetch(
      `${BASE_URL}/me/player/recently-played?limit=${limit}`,
      { headers: getAuthHeader() }
    );
    return response.json();
  },

  // Playlists
  getUserPlaylists: async (limit = 50) => {
    const response = await fetch(
      `${BASE_URL}/me/playlists?limit=${limit}`,
      { headers: getAuthHeader() }
    );
    return response.json();
  },
};