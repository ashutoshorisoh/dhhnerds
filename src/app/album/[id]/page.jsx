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
    <div className="min-h-screen w-full overflow-y-auto bg-[#1A1A1A] text-white">
      <div className="flex flex-col lg:flex-row lg:p-20 p-10 justify-center items-center gap-8 lg:gap-12 w-full">
        
        {/* Album Image (Box 1) */}
        <div className="flex justify-center items-center rounded-lg overflow-hidden lg:w-1/2 w-full bg-[#2C2C2C] shadow-lg">
          <img
            src={albumData?.coverartURL || "default-image.jpg"}
            alt={`${albumData?.albumname || "Album"} Cover`}
            className="h-auto w-full object-cover rounded-md shadow-md"
          />
        </div>

        {/* Album Details, Reviews, and Form (Box 2) */}
        <div className="flex flex-col bg-[#2C2C2C] p-6 rounded-lg shadow-lg lg:w-1/2 w-full gap-6">
          
          {/* Album Name and Rating */}
          <div className="text-center">
            <h2 className="lg:text-xl text-lg font-bold mb-4">
              {albumData?.albumname || "Unknown"}
            </h2>
            <p className="text-sm font-light">
              Average Rating:
              <span className="bg-orange-600 text-white rounded-md px-2 py-1 ml-2">
                {albumData?.averageRating || 0}/5
              </span>
            </p>
          </div>

          {/* Review Form */}
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
            
            {/* Rating and Textarea on the Same Line */}
            <div className="flex gap-4">
              <div className="flex flex-col" style={{ minWidth: "100px" }}>
                <label className="text-sm font-medium mb-2">Rate:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  disabled={isSubmitting}
                  className="w-full p-2 bg-[#3A3A3A] text-white rounded-md"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>

              <div className="flex flex-col flex-grow">
                <label className="text-sm font-medium mb-2">Your Thoughts:</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 bg-[#3A3A3A] text-white rounded-md resize-none min-h-[60px]"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Submit Button Below */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-sm font-bold ${
                isSubmitting ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
              } text-white transition duration-200`}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          {/* Display Message */}
          {message && (
            <div className="mt-4 text-center text-sm text-yellow-400">{message}</div>
          )}

          {/* Reviews Section */}
          <div className="flex flex-col overflow-y-auto mt-5 max-h-96 gap-4">
            <h3 className="text-lg font-semibold">Reviews</h3>
            {albumData?.reviews?.length > 0 ? (
              albumData.reviews.map((review) => (
                <div key={review._id} className="p-4 bg-[#3A3A3A] rounded-md shadow-md">
                  <p className="text-sm">{review.reviewText}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
