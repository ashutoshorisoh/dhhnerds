// Helper function to extract artist ID from Spotify URL
export function extractArtistId(spotifyURL) {
    const parts = spotifyURL.split('/');
    return parts[parts.length - 1]?.split('?')[0];
  }
  