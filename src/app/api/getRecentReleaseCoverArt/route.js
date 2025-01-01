import { fetchSpotifyAccessToken, getAccessToken, ensureValidAccessToken } from '../accesstoken/route'; 
import axios from 'axios';
import connectDB from '@/dbconfig/dbconfig';
import Artist from '@/models/artist.model';
import Release from '@/models/releases.model'; // Assuming the release model is properly set up

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
    const releaseRequests = artists.map(async (artist) => {
      const spotifyURL = artist.spotifyURL;
      const artistSpotifyId = spotifyURL.split('/').pop().split("?")[0];

      // Fetch the artist's releases from Spotify (e.g., singles, albums, etc.)
      const spotifyAPI = `https://api.spotify.com/v1/artists/${artistSpotifyId}/albums?include_groups=album,single,appears_on,compilation&limit=10`;
      try {
        const response = await axios.get(spotifyAPI, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const releases = response.data.items;  // Get all releases

        // Process each release
        for (let releaseItem of releases) {
          const existingRelease = await Release.findOne({
            name: releaseItem.name,
            releaseDate: releaseItem.release_date,
            artist: artist._id,  // Ensure it matches the correct artist
          });

          if (!existingRelease) {
            // If release doesn't exist, create a new one
            const newRelease = new Release({
              details: {
                name: releaseItem.name,
                coverArtURL: releaseItem.images[0]?.url || '',  // Optional: add other details from releaseItem
                releaseDate: new Date(releaseItem.release_date),
              },
              artist: artist._id,  // Link the release to the artist
              reviews: [],
              averageRating: 0,
            });

            // Save the new release to the database
            await newRelease.save();
            console.log(`Release ${releaseItem.name} saved to database.`);
          }
        }
      } catch (error) {
        console.error(`Error fetching releases for artist ${artist.artistname}:`, error.message);
      }
    });

    // Wait for all requests to finish
    await Promise.all(releaseRequests);

    // Optionally, return a response with the saved releases (for confirmation)
    const allReleases = await Release.find().populate('artist');  // You can populate artist data if needed

    const recentAlbums = allReleases.map((album) => ({
      _id: album._id,
      coverartURL: album.details.coverArtURL,
      artist: album.artist,  // Adjust according to how you structure your artist's name
    }));

    // Return all album data
    console.log('Returning recent albums:', recentAlbums);
    return new Response(JSON.stringify({ recentAlbums }), { status: 200 });
    
    

  } catch (error) {
    console.error('Error in Spotify request:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
