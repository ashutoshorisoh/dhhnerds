"use client"
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { emailContext } from "./context/context";

const RecentAlbums = () => {
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(""); // State for storing the username
  const router = useRouter();
  const { userEmail } = emailContext(); // Assuming you're using a context to get user email

  // Create a ref for the release section
  const releaseSectionRef = useRef(null);

  const handleClick = (album) => {
    const albumId = String(album._id); 
    const name = album.albumname;
  
    const url = `/album/albumId=${albumId}`;
    router.push(url);
  };

  // Scroll to the release section
  const scrollToReleaseSection = () => {
    if (releaseSectionRef.current) {
      releaseSectionRef.current.scrollIntoView({
        behavior: "smooth", // Smooth scroll effect
        block: "start", // Align to the top
      });
    }
  };

  // Fetch username based on email
  useEffect(() => {
    if (userEmail) {
      const fetchUsername = async () => {
        try {
          const response = await fetch("/api/getusername", {
            method: "POST", // Use POST to send data in the body
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail }), // Pass email in the request body
          });

          const data = await response.json();
          
          if (response.ok) {
            setUsername(data.username); // Set the fetched username
          } else {
            console.error(data.error || "Unable to fetch username");
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      };
      
      fetchUsername();
    }
  }, [userEmail]);

  // Fetch recent albums
  useEffect(() => {
    const fetchRecentAlbums = async () => {
      try {
        const response = await fetch("/api/getRecentReleaseCoverArt");
        const data = await response.json();
        console.log('Fetched data:', data); // Log the full response
        
        if (response.ok) {
          setRecentAlbums(data.recentAlbums || []);
        } else {
          setError(data.error || "Unknown error");
          console.log("Error data:", data);
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
    <div className="flex flex-col justify-center items-center text-white h-auto w-screen overflow-x-hidden hero-bg">
    {/* Hero Section */}
    {/* Hero Section */}
<div
className={`flex flex-col justify-center items-center text-white h-screen w-screen overflow-hidden hero-bg ${userEmail ? 'hidden' : 'block'}`}
>
  <div className="text-center px-8 lg:px-40">
    <h1 className="text-5xl lg:text-7xl  font-light mb-10">
      Track Latest Release Desi Hip Hop Projects Tell your friends what’s good. 
    </h1>
    

    {/* Welcome Message */}
    {username ? (
      <p className="text-2xl  font-thin">Welcome, <span className="bg-red-600 font-semibold pl-3 pr-3 rounded-lg">{username}! </span></p>
    ) : (
      <p className="text-xl font-light mb-8">Welcome, Guest!</p>
    )}

    {/* Get Started Button */}
    <button
      onClick={scrollToReleaseSection}
      className="bg-green-800 rounded-full px-8 py-4 text-lg lg:text-xl mt-5 hover:bg-green-200 hover:text-black transition duration-300"
    >
      Get Started
    </button>
  </div>
</div>

  
    {/* Recent Releases Section */}
    {/* Recent Releases Section */}
<div
  ref={releaseSectionRef}
  className="w-full max-h-screen overflow-y-auto px-4 py-10"
>
  <h2 className="text-2xl font-semibold mb-5 text-left pl-4">Recent Releases</h2>
  <div className="flex overflow-x-auto gap-x-4 hide-scrollbar">
  {recentAlbums.length > 0 ? (
  recentAlbums.map((album, index) => (
    <div key={index} className="flex-shrink-0">
      <div className="relative cursor-pointer w-[150px] h-[200px] overflow-hidden rounded-md shadow-md bg-[#2C2C2C] hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <img
          src={album.coverArtURL || "default-album-cover.jpg"}
          alt={`Cover art of ${album.artist?.name || 'Unknown Artist'}'s album`}
          onClick={() => handleClick(album)}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white text-sm font-semibold">
          {album.details?.name}
        </div>
      </div>
    </div>
  ))
) : (
  <p className="text-center text-gray-400">No recent albums found.</p>
)}

  </div>
</div>

  
    {/* Footer Section */}
    <div className="w-full flex justify-center py-8">
      <button
        onClick={() => router.push("/addArtist")}
        className="bg-[#FF5722] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#E64A19] transition-all duration-300"
      >
        Didn't see your favorite artist's project? Add their name
      </button>
    </div>
  </div>
  
  );
};

export default RecentAlbums;
