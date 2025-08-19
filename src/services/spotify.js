// src/services/spotify.js - Real Spotify API Implementation
const API_BASE_URL = 'https://api.spotify.com/v1';

class SpotifyAPI {
  constructor() {
    this.getAuthToken = null; // Will be set by AuthProvider
  }

  // Set the token getter function from AuthContext
  setTokenGetter(getTokenFunction) {
    this.getAuthToken = getTokenFunction;
  }

  // Make authenticated API requests
  async makeRequest(endpoint, options = {}) {
    if (!this.getAuthToken) {
      throw new Error('Authentication not initialized');
    }

    const token = await this.getAuthToken();
    if (!token) {
      throw new Error('No valid authentication token');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token might be expired
      throw new Error('Authentication failed - please login again');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    return response.json();
  }

  // Get current user's profile
  async getCurrentUser() {
    return this.makeRequest('/me');
  }

  // Get user's top tracks
  async getTopTracks(timeRange = 'medium_term', limit = 20) {
    const params = new URLSearchParams({
      time_range: timeRange,
      limit: limit.toString(),
    });
    
    return this.makeRequest(`/me/top/tracks?${params}`);
  }

  // Get user's top artists
  async getTopArtists(timeRange = 'medium_term', limit = 20) {
    const params = new URLSearchParams({
      time_range: timeRange,
      limit: limit.toString(),
    });
    
    return this.makeRequest(`/me/top/artists?${params}`);
  }

  // Get audio features for tracks
  async getAudioFeatures(trackIds) {
    if (!Array.isArray(trackIds) || trackIds.length === 0) {
      throw new Error('Track IDs must be a non-empty array');
    }

    // Spotify API limits to 100 tracks per request
    const maxBatchSize = 100;
    const allFeatures = [];

    for (let i = 0; i < trackIds.length; i += maxBatchSize) {
      const batch = trackIds.slice(i, i + maxBatchSize);
      const ids = batch.join(',');
      
      try {
        const response = await this.makeRequest(`/audio-features?ids=${ids}`);
        allFeatures.push(...(response.audio_features || []));
      } catch (error) {
        console.error('Error fetching audio features batch:', error);
        // Continue with other batches
      }
    }

    return { audio_features: allFeatures };
  }

  // Get user's recently played tracks
  async getRecentlyPlayed(limit = 20) {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    
    return this.makeRequest(`/me/player/recently-played?${params}`);
  }

  // Get user's saved tracks (liked songs)
  async getSavedTracks(limit = 20, offset = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    return this.makeRequest(`/me/tracks?${params}`);
  }

  // Get user's playlists
  async getUserPlaylists(limit = 20, offset = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    return this.makeRequest(`/me/playlists?${params}`);
  }

  // Get tracks from a specific playlist
  async getPlaylistTracks(playlistId, limit = 50, offset = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    return this.makeRequest(`/playlists/${playlistId}/tracks?${params}`);
  }

  // Get detailed artist information
  async getArtist(artistId) {
    return this.makeRequest(`/artists/${artistId}`);
  }

  // Get multiple artists
  async getArtists(artistIds) {
    if (!Array.isArray(artistIds) || artistIds.length === 0) {
      throw new Error('Artist IDs must be a non-empty array');
    }

    const ids = artistIds.slice(0, 50).join(','); // API limit is 50
    return this.makeRequest(`/artists?ids=${ids}`);
  }

  // Get track information
  async getTrack(trackId) {
    return this.makeRequest(`/tracks/${trackId}`);
  }

  // Get multiple tracks
  async getTracks(trackIds) {
    if (!Array.isArray(trackIds) || trackIds.length === 0) {
      throw new Error('Track IDs must be a non-empty array');
    }

    const ids = trackIds.slice(0, 50).join(','); // API limit is 50
    return this.makeRequest(`/tracks?ids=${ids}`);
  }

  // Search for tracks, artists, albums, etc.
  async search(query, type = 'track', limit = 20) {
    const params = new URLSearchParams({
      q: query,
      type: type,
      limit: limit.toString(),
    });
    
    return this.makeRequest(`/search?${params}`);
  }

  // Get user's listening statistics (calculated from available data)
  async getListeningStats(timeRange = 'medium_term') {
    try {
      const [topTracks, topArtists, recentTracks] = await Promise.all([
        this.getTopTracks(timeRange, 50),
        this.getTopArtists(timeRange, 50),
        this.getRecentlyPlayed(50).catch(() => ({ items: [] })) // Fallback if not available
      ]);

      // Calculate statistics
      const stats = {
        totalTopTracks: topTracks.items?.length || 0,
        totalTopArtists: topArtists.items?.length || 0,
        totalRecentTracks: recentTracks.items?.length || 0,
        uniqueArtistsFromTracks: new Set(
          topTracks.items?.flatMap(track => 
            track.artists?.map(artist => artist.id) || []
          ) || []
        ).size,
        genres: this.extractGenres(topArtists.items || []),
        timeRange: timeRange
      };

      return stats;
    } catch (error) {
      console.error('Error getting listening stats:', error);
      return {
        totalTopTracks: 0,
        totalTopArtists: 0,
        totalRecentTracks: 0,
        uniqueArtistsFromTracks: 0,
        genres: [],
        timeRange: timeRange
      };
    }
  }

  // Extract and count genres from artists
  extractGenres(artists) {
    const genreCount = {};
    
    artists.forEach(artist => {
      if (artist.genres) {
        artist.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });

    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));
  }

  // Check if user has premium account
  async hasSpotifyPremium() {
    try {
      const user = await this.getCurrentUser();
      return user.product === 'premium';
    } catch (error) {
      console.error('Error checking Spotify premium status:', error);
      return false;
    }
  }

  // Get user's detailed profile information
  async getUserProfile() {
    try {
      const user = await this.getCurrentUser();
      const stats = await this.getListeningStats();
      
      return {
        ...user,
        stats,
        isPremium: user.product === 'premium',
        followerCount: user.followers?.total || 0,
        profileImage: user.images?.[0]?.url || null,
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
}

// Create and export a single instance
const spotifyAPI = new SpotifyAPI();

export { spotifyAPI };
export default spotifyAPI;