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
            } else {
                setMessage(response.data.message || "An error occurred.");
            }
        } catch (error) {
            console.error("Error adding artist:", error.response ? error.response.data : error.message);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Artist</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="artistname" className="block text-sm font-medium text-gray-700">Artist Name</label>
                    <input
                        type="text"
                        id="artistname"
                        value={artistname}
                        onChange={(e) => setArtistname(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="spotifyURL" className="block text-sm font-medium text-gray-700">Spotify URL</label>
                    <input
                        type="url"
                        id="spotifyURL"
                        value={spotifyURL}
                        onChange={(e) => setSpotifyURL(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={isLoading}
                >
                    {isLoading ? "Adding..." : "Add Artist"}
                </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
        </div>
    );
};

export default ArtistForm;
