// app/api/getartist
import connectDB from '@/dbconfig/dbconfig';
import Artist from '@/models/artist.model';

connectDB();

export async function GET(request) {
  try {
    // Fetch all artists
    const artists = await Artist.find();

    // Transform the artist data
    const artistsWithSpotifyId = artists.map((artist) => ({
      id: artist._id,
      name: artist.artistname,
      spotifyId: artist.spotifyURL.split('/').pop(), // Extract Spotify ID
    }));

    // Return the transformed response
    return new Response(JSON.stringify(artistsWithSpotifyId), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
