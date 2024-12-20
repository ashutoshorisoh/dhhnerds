"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RecentAlbums = () => {
  const [recentAlbums, setRecentAlbums] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleClick = (album) => {
    const albumId = String(album._id); 
    const name = album.albumname;
  
    const url = `/album/albumId=${albumId}`;
    router.push(url);
  };
  
  useEffect(() => {
    const fetchRecentAlbums = async () => {
      try {
        const response = await fetch("/api/getRecentReleaseCoverArt");
        const data = await response.json();

        if (response.ok) {
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
    <div className="w-full min-h-screen overflow-y-auto flex justify-center items-start pt-8 pb-8 bg-[#1A1A1A]">
  {/* Parent container for albums */}
  <div className="w-full max-w-screen-xl px-6">
    {/* Recent Releases Label */}
    <h2 className="text-3xl font-semibold text-white mb-6 text-center">Recent Releases</h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
      {recentAlbums.length > 0 ? (
        recentAlbums.map((album, index) => (
          <div key={index} className="w-full flex justify-center">
            <div className="relative w-full overflow-hidden rounded-lg shadow-lg bg-[#2C2C2C] hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <img
                src={album.coverartURL || "default-album-cover.jpg"}
                alt={`Cover art of ${album.artist}'s album`}
                onClick={() => handleClick(album)}
                className="w-full h-auto object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent text-white text-xs font-semibold">
                {album.albumname}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 w-full">No recent albums found.</p>
      )}
    </div>

    {/* Footer Section with Button */}
    <div className="w-full flex justify-center mt-8">
      <button
        onClick={() => router.push("/addArtist")}
        className="bg-[#FF5722] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#E64A19] transition-all duration-300"
      >
        Didn't see your favorite artist's project? Add his name
      </button>
    </div>
  </div>
</div>



  
  );
};

export default RecentAlbums;
