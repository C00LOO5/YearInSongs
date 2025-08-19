// src/components/__tests__/Dashboard.test.js - FIXED VERSION
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import Dashboard from '../Dashboard/Dashboard';

// Create a more robust mock for spotify service
jest.mock('../../services/spotify', () => ({
  spotifyAPI: {
    getCurrentUser: jest.fn(),
    getTopTracks: jest.fn(),
    getTopArtists: jest.fn(),
    getAudioFeatures: jest.fn(),
  }
}));

// Mock the data processor functions  
jest.mock('../../services/dataProcessor', () => ({
  processTopTracks: jest.fn(),
  processTopArtists: jest.fn(),
  calculateMoodProfile: jest.fn(),
}));

// Import the mocked functions so we can control their return values
import { spotifyAPI } from '../../services/spotify';
import { processTopTracks, processTopArtists, calculateMoodProfile } from '../../services/dataProcessor';

describe('Dashboard', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock return values
    spotifyAPI.getCurrentUser.mockResolvedValue({
      display_name: 'Test User',
      email: 'test@example.com',
      id: 'testuser123'
    });

    spotifyAPI.getTopTracks.mockResolvedValue({
      items: [
        {
          id: '1',
          name: 'Test Track 1',
          artists: [{ name: 'Test Artist 1' }],
          album: { 
            name: 'Test Album',
            images: [{ url: 'https://via.placeholder.com/300' }]
          },
          duration_ms: 180000,
          popularity: 85,
          preview_url: 'test-url',
          external_urls: { spotify: 'test' }
        }
      ]
    });

    spotifyAPI.getTopArtists.mockResolvedValue({
      items: [
        {
          id: '1',
          name: 'Test Artist 1',
          genres: ['pop', 'indie'],
          images: [{ url: 'https://via.placeholder.com/300' }],
          followers: { total: 1000000 },
          popularity: 90,
          external_urls: { spotify: 'test' }
        }
      ]
    });

    spotifyAPI.getAudioFeatures.mockResolvedValue({
      audio_features: [
        {
          id: '1',
          danceability: 0.7,
          energy: 0.6,
          valence: 0.8,
          acousticness: 0.3,
          instrumentalness: 0.1,
          speechiness: 0.1
        }
      ]
    });

    // Setup data processor mock return values
    processTopTracks.mockImplementation((tracks) => 
      tracks.items.map((track, index) => ({
        rank: index + 1,
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        image: track.album.images[0]?.url,
        preview_url: track.preview_url,
        popularity: track.popularity,
        duration_ms: track.duration_ms,
        external_urls: track.external_urls,
      }))
    );

    processTopArtists.mockImplementation((artists) => 
      artists.items.map((artist, index) => ({
        rank: index + 1,
        id: artist.id,
        name: artist.name,
        genres: artist.genres || [],
        image: artist.images[0]?.url,
        followers: artist.followers.total,
        popularity: artist.popularity,
        external_urls: artist.external_urls,
      }))
    );

    calculateMoodProfile.mockReturnValue({
      danceability: 0.7,
      energy: 0.6,
      valence: 0.8,
      acousticness: 0.3,
      instrumentalness: 0.1,
      speechiness: 0.1
    });
  });

  test('renders dashboard with user name', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    
    // Wait for the loading to complete and user data to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test User!/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('displays loading state initially', () => {
    render(<Dashboard />);
    
    // Should show loading initially
    expect(screen.getByText(/Loading your music data.../)).toBeInTheDocument();
  });

  test('displays stat cards after loading', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    
    // Wait for stats to load
    await waitFor(() => {
      expect(screen.getByText('Top Genre')).toBeInTheDocument();
      expect(screen.getByText('Total Artists')).toBeInTheDocument();
      expect(screen.getByText('Total Tracks')).toBeInTheDocument();
      expect(screen.getByText('Mood Score')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
