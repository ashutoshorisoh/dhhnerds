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
    <div className="flex flex-col justify-center gap-5 items-center text-white h-auto w-screen hero-bg">
      {/* Hero Section */}
      <div className="flex justify-center items-center text-center pl-40 pr-40 lg:flex-wrap flex-nowrap ">
        <div className="lg:text-6xl mt-20 text-3xl font-semibold">
          <h1>
            Track Latest Release Desi Hip Hop Projects
            Tell your friends what’s good. 
            Get started
            <p className="mt-5">
              — it‘s <span className="bg-yellow-600">free!</span>
            </p>
          </h1>

          {/* Show Welcome message if user is logged in */}
          {username ? (
            <p className="mt-5 font-thin">Welcome, {username}!</p>
          ) : (
            <p className="mt-5">Welcome, Guest!</p>
          )}

          <button
            onClick={scrollToReleaseSection} // Add click handler to scroll to the release section
            className="bg-green-800 rounded-sm lg:pl-10 pl-5 lg:pr-10 pr-5 lg:pt-5 pt-3 pb-3 lg:pb-5 mt-5 lg:text-xl text-sm hover:bg-green-200 hover:text-black"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Recent Releases Section */}
      <div 
        ref={releaseSectionRef} // Attach the ref to this div
        className="w-full max-h-screen overflow-y-auto flex justify-center lg:pl-5 lg:pr-5 pl-2 pr-2 items-start lg:pt-8 pt-2 lg:pb-8"
      >
        <div className="flex -gap-1 gap-2 w-full overflow-x-auto hide-scrollbar">
          {recentAlbums.length > 0 ? (
            recentAlbums.slice(-7).map((album, index) => (
              <div key={index} className="lg:w-[30%] w-full flex justify-center">
                <div className="relative cursor-pointer w-[200px] h-[200px] lg:h-[300px] overflow-hidden rounded-lg shadow-lg bg-[#2C2C2C] hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <img
                    src={album.coverartURL || "default-album-cover.jpg"}
                    alt={`Cover art of ${album.artist}'s album`}
                    onClick={() => handleClick(album)}
                    className="h-full w-full object-cover rounded-lg"
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
      </div>

      {/* Footer Section with Button */}
      <div className="w-full flex justify-center mt-8">
        <button
          onClick={() => router.push("/addArtist")}
          className="bg-[#FF5722] text-white px-6 py-3 rounded-full text-sm mb-10 font-semibold hover:bg-[#E64A19] transition-all duration-300"
        >
          Didn't see your favorite artist's project? Add his name
        </button>
      </div>
    </div>
  );
};

export default RecentAlbums;
