// spotifyToken.js
import axios from 'axios';

// Environment variables for credentials
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// State variables
let accessToken = '';
let tokenExpirationTime = 0;

// Function to fetch a new access token
export async function fetchSpotifyAccessToken() {
  try {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error('Missing Spotify API credentials');
    }

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000;

    console.log('Spotify access token fetched successfully');
  } catch (error) {
    console.error('Error fetching access token:', error.message, error.response?.data || '');
    throw new Error('Failed to fetch Spotify access token');
  }
}

// Background task to refresh the token automatically
export function startTokenRefreshTask() {
  const refreshInterval = 1000 * 60 * 50; // Refresh every 50 minutes (slightly before token expiry)

  setInterval(async () => {
    try {
      console.log('Refreshing Spotify access token...');
      await fetchSpotifyAccessToken();
    } catch (error) {
      console.error('Error during automatic token refresh:', error.message);
    }
  }, refreshInterval);
}

// Middleware function to ensure a valid token
export async function ensureValidAccessToken() {
  if (Date.now() >= tokenExpirationTime) {
    await fetchSpotifyAccessToken();
  }
}

// Initialize automatic token refresh
startTokenRefreshTask();

// Export the current access token
export function getAccessToken() {
  return accessToken;
}
