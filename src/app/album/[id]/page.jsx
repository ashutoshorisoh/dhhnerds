"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import axios from 'axios';
import { emailContext } from "@/app/context/context";

const AlbumPage = () => {
  const params = useParams(); // Access dynamic route parameters with `useParams`
  const { id } = params; // Extract album ID from URL params

  const albumId = id?.split('D')[1]; // Extract the actual album ID

  const [albumData, setAlbumData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State for handling form submission
  const [message, setMessage] = useState(''); // State for messages
  const { userEmail } = emailContext()

  useEffect(() => {
    if (albumId) {
      setLoading(true); // Start loading
      fetch(`/api/album/${albumId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch album data');
          }
          return response.json();
        })
        .then((data) => {
          setAlbumData(data); // Set the fetched data
          setLoading(false); // Stop loading
        })
        .catch((error) => {
          setError(error.message); // Set the error message
          setLoading(false); // Stop loading
        });
    }
  }, [albumId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      setMessage("Please log in to submit a review.");
      return;
    }

    if (!reviewText.trim() || rating < 1 || rating > 5) {
      setMessage('Please provide a valid review and ensure the rating is between 1 and 5.');
      return;
    }

    setIsSubmitting(true);
  
    const reviewData = {
      email: userEmail, // Include email in the request body
      reviewText: reviewText.trim(),
      rating,
    };
  
    try {
      const response = await axios.post(`/api/album/${albumId}/postReview`, reviewData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setMessage("Review submitted successfully! Refresh to see your comment.");
        setReviewText(''); // Clear the review text field after submission
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('An unexpected error occurred. Please try again.');
    }
  
    setIsSubmitting(false); // Stop submitting
  };

  if (loading) return <div>Loading...</div>; // Show loading message
  if (error) return <div>Error: {error}</div>; // Show error message

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-gray-900 text-white">
    <div className="flex flex-col lg:flex-row lg:p-20 p-10 justify-center items-center gap-12 w-full">
  
      {/* Album Image Section */}
      <div className="flex justify-center items-center rounded-lg overflow-hidden lg:w-1/2 w-full bg-gray-800 shadow-lg">
        <img
          src={albumData?.coverartURL || "default-image.jpg"}
          alt={`${albumData?.albumname || "Album"} Cover`}
          className="w-full object-cover rounded-md"
        />
      </div>
  
      {/* Album Details and Reviews Section */}
      <div className="flex flex-col bg-gray-800 p-8 rounded-lg shadow-lg lg:w-1/2 w-full">
        {/* Album Name and Rating */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {albumData?.albumname || "Unknown Album"}
          </h2>
          <p className="text-sm">
            Average Rating:
            <span className="bg-orange-600 text-white rounded px-2 py-1 ml-2">
              {albumData?.averageRating || 0}/5
            </span>
          </p>
        </div>
  
        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
          {/* Rating and Thoughts */}
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex flex-col w-full lg:w-1/3">
              <label className="text-sm font-medium mb-2">Rate:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={isSubmitting}
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
  
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium mb-2">Your Thoughts:</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                disabled={isSubmitting}
                rows={4}
              />
            </div>
          </div>
  
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold transition duration-200 ${
    isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
  } text-white`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
  
        {/* Feedback Message */}
        {message && (
          <div className="mt-4 text-center text-sm text-yellow-400">{message}</div>
        )}
  
        {/* Reviews Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Reviews</h3>
          <div className="flex flex-col gap-4 max-h-80 overflow-y-auto">
            {albumData?.reviews?.length > 0 ? (
              albumData.reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-gray-700 rounded-lg shadow-md"
                >
                  <h4 className="font-bold mb-1">
                    {review.username?.username}
                  </h4>
                  <p className="text-sm text-gray-300">{review.reviewText}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AlbumPage;
