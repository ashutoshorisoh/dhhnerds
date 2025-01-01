import { fetchSpotifyAccessToken, getAccessToken, ensureValidAccessToken } from '../accesstoken/route';
import axios from 'axios';
import connectDB from '@/dbconfig/dbconfig';
import Artist from '@/models/artist.model';
import Album from '@/models/album.model';

export async function GET(req) {
  connectDB();
  try {
    // Ensure a valid token before proceeding
    await ensureValidAccessToken();

    // Get the current access token
    const accessToken = getAccessToken();

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Failed to fetch access token' }), { status: 500 });
    }

    // Fetch artists with pagination to avoid large single query timeouts
    const artistsPerPage = 100;  // Adjust as needed
    let artists = [];
    let page = 0;

    // Paginate through artists
    while (true) {
      const pagedArtists = await Artist.find().skip(page * artistsPerPage).limit(artistsPerPage);
      if (pagedArtists.length === 0) break;  // No more artists
      artists = [...artists, ...pagedArtists];
      page++;
    }

    if (!artists || artists.length === 0) {
      return new Response(JSON.stringify({ error: 'No artists found' }), { status: 404 });
    }

    // Use Promise.all to parallelize Spotify API requests for efficiency
    const albumRequests = artists.map(async (artist) => {
      const spotifyURL = artist.spotifyURL;
      const artistSpotifyId = spotifyURL.split('/').pop().split("?")[0];

      // Fetch the artist's recent album from Spotify
      const spotifyAPI = `https://api.spotify.com/v1/artists/${artistSpotifyId}/albums?include_groups=album&limit=1`;
      try {
        const response = await axios.get(spotifyAPI, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const recentAlbum = response.data.items[0];  // Get the most recent album

        if (recentAlbum) {
          // Check if the album already exists in the database
          const existingAlbum = await Album.findOne({
            albumname: recentAlbum.name,
            coverartURL: recentAlbum.images[0]?.url || '',
          });

          if (!existingAlbum) {
            // If album doesn't exist, create a new one
            const newAlbum = new Album({
              albumname: recentAlbum.name,
              coverartURL: recentAlbum.images[0]?.url || '',
              releaseDate: new Date(recentAlbum.release_date),
              artist: artist._id,  // Link the album to the artist
              averageRating: 0,
              reviews: [],
              otherartists: [],
            });

            // Save the album to the database
            await newAlbum.save();
            console.log(`Album ${recentAlbum.name} saved to database.`);
          }
        }
      } catch (error) {
        console.error(`Error fetching albums for artist ${artist.artistname}:`, error.message);
      }
    });

    // Wait for all requests to finish
    await Promise.all(albumRequests);

    // Fetch all albums with necessary data (e.g., cover art, artist)
    const allAlbums = await Album.find().populate('artist');  // .populate('artist') to get artist info if needed

    // Map data to send only necessary fields to frontend
    const recentAlbumsCoverArt = allAlbums.map((album) => ({
      _id: album._id,
      coverartURL: album.coverartURL,
      artistName: album.artist.artistname,  // Adjust according to how you structure your artist's name
    }));

    // Return all album data
    return new Response(JSON.stringify({ recentAlbumsCoverArt }), { status: 200 });

  } catch (error) {
    console.error('Error in Spotify request:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

