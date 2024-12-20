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
    const name = album.albumname; // URL-safe album name
  
    // Build the query string manually for dynamic routes
    const url = `/album/albumId=${albumId}`;
  
    router.push(url);
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
    <div className="text-white h-screen w-screen flex justify-center item-center bg-blue-800">
      <div className="flex lg:flex-row gap-10 justify-center items-start p-4 h-[1000px] w-[1000px] overflow-hidden ">
        {recentAlbums.length > 0 ? (
          recentAlbums.map((album, index) => (
            <div key={index} className="h-[1000px] w-[1000px] overflow-hidden">
              <img
                src={album.coverartURL}
                alt={`Cover art of ${album.artistName}'s album`}
                style={{ width: "200px", height: "200px", objectFit: "contain" }}
                onClick={() => handleClick(album)} // Pass the full album object
                className="h-full w-full object-contain"
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
