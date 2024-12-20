"use client";

import { useState } from "react";
import axios from "axios";

const ArtistForm = () => {
    const [artistname, setArtistname] = useState("");
    const [spotifyURL, setSpotifyURL] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(""); // Reset message before new submission

        try {
            const response = await axios.post("/api/artistsubmission", { 
                artistname,
                spotifyURL,
            }, {
                headers: {
                    "Content-Type": "application/json", // Ensure content-type is JSON
                }
            });

            if (response.data.success) {
                setMessage("Artist added successfully!");
                // Clear form fields after successful submission
                setArtistname("");
                setSpotifyURL("");
            } else {
                // Check if the error message corresponds to a known issue
                if (response.data.message.includes("already exists")) {
                    setMessage("The artist already exists or the Spotify URL is incorrect. URL example: https://open.spotify.com/artist/4Ai0pGz6GhQavjzaRhPTvz");
                } else {
                    setMessage(response.data.message || "An error occurred.");
                }
            }
        } catch (error) {
            console.error("Error adding artist:", error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 500) {
                setMessage("Internal server error. Please try again later.");
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-[#2C2C2C] border border-[#444] rounded-xl shadow-lg text-white">
            <h2 className="text-2xl font-semibold mb-6 text-center">Add Artist</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="artistname" className="block text-sm font-medium text-gray-300">Artist Name</label>
                    <input
                        type="text"
                        id="artistname"
                        value={artistname}
                        onChange={(e) => setArtistname(e.target.value)}
                        className="mt-2 block w-full p-3 bg-[#333] border border-[#555] rounded-lg text-white placeholder-gray-400 focus:ring-[#FF5722] focus:border-[#FF5722] transition-all duration-300"
                        required
                        placeholder="Enter artist name"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="spotifyURL" className="block text-sm font-medium text-gray-300">Spotify URL</label>
                    <input
                        type="url"
                        id="spotifyURL"
                        value={spotifyURL}
                        onChange={(e) => setSpotifyURL(e.target.value)}
                        className="mt-2 block w-full p-3 bg-[#333] border border-[#555] rounded-lg text-white placeholder-gray-400 focus:ring-[#FF5722] focus:border-[#FF5722] transition-all duration-300"
                        required
                        placeholder="Enter Spotify URL"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-[#FF5722] text-white rounded-lg text-lg font-semibold hover:bg-[#E64A19] transition-all duration-300 disabled:bg-[#666]"
                    disabled={isLoading}
                >
                    {isLoading ? "Adding..." : "Add Artist"}
                </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-gray-400">{message}</p>}
        </div>
    );
};

export default ArtistForm;
