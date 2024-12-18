"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RecentAlbums = () => {
  const [recentAlbums, setRecentAlbums] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Handle click on album cover and redirect to album page with full album data
  const handleClick = (album) => {
    const albumId = String(album._id); // Ensure _id is a string
    router.push(`/album/${albumId}`);  // Pass the albumId in the URL
  };

  useEffect(() => {
    const fetchRecentAlbums = async () => {
      try {
        const response = await fetch("/api/getRecentReleaseCoverArt");
        const data = await response.json();

        if (response.ok) {
          // Set the recent albums data to the state
          setRecentAlbums(data.recentAlbumsCoverArt || []);
        } else {
          setError(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching recent albums:", error);
        setError("An error occurred while fetching the albums.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAlbums();
  }, []);

  if (loading) {
    return <p>Loading recent albums...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div className="text-white">
      <h2>Recent Album Releases</h2>
      <div className="albums-grid">
        {recentAlbums.length > 0 ? (
          recentAlbums.map((album, index) => (
            <div key={index} className="album-item">
              <h3>{album.artistName}</h3>
              <img
                src={album.coverartURL}
                alt={`Cover art of ${album.artistName}'s album`}
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
                onClick={() => handleClick(album)} // Pass the full album object
              />
            </div>
          ))
        ) : (
          <p>No recent albums found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentAlbums;
