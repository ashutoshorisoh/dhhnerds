"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import axios from 'axios';
import jwt from 'jsonwebtoken'; // Import jwt to verify the token

// Helper function to decode token and extract userId
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // Verify and decode the token
    return decoded.userId; // Assuming 'userId' is in the token payload
  } catch (error) {
    return null; // Token verification failed
  }
};

const AlbumPage = () => {
  const params = useParams(); // Access dynamic route parameters with `useParams`
  const { id } = params; // 'id' is something like 'albumId=6763215dec8ac02458bb6995'
  
  // Split the id string to extract the actual albumId
  const albumId = id?.split('D')[1]; // This will give '6763215dec8ac02458bb6995'

  const [albumData, setAlbumData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State for handling form submission

  // Fetch album data when albumId changes
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
    
    // Get the token from cookies (same as in middleware)
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    
    if (token) {
      const userId = getUserIdFromToken(token.split('=')[1]); // Get the userId from the token
      if (userId) {
        setIsLoggedIn(true); // User is logged in
      }
    } else {
      setIsLoggedIn(false); // No token found, user is not logged in
    }
  }, [albumId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Validation for review text and rating
    if (!reviewText.trim() || rating < 1 || rating > 5) {
      alert('Please provide a valid review and ensure rating is between 1 and 5.');
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      reviewText: reviewText.trim(),
      rating,
    };

    try {
      // Post review to the API endpoint without adding token to headers
      const response = await axios.post(`/api/album/${albumId}/postReview`, reviewData, {
        headers: { 'Content-Type': 'application/json' }, // No need to include the token here
        withCredentials: true, // Include credentials if needed for authentication
      });

      if (response.data.message === 'Review posted successfully') {
        alert('Review submitted successfully!');
        setReviewText(''); // Reset review text
        setRating(1); // Reset rating
      } else {
        alert(response.data.error || 'Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An unexpected error occurred. Please try again.');
    }

    setIsSubmitting(false); // Stop submitting
  };

  if (loading) return <div>Loading...</div>; // Show loading message
  if (error) return <div>Error: {error}</div>; // Show error message

  return (
    <div>
      <h1>Album ID: <p className="bg-blue">{albumId}</p></h1>
      <h1>Album: {albumData?.name}</h1>
      <img src={albumData?.coverartURL} alt="Album Cover" />
      <p>{albumData?.description}</p>
      <p>Artist: {albumData?.artist}</p>

      {/* Display login status */}
      <h2>{isLoggedIn ? 'You are logged in!' : 'Please log in to post a review'}</h2>

      {/* Review Form */}
      {isLoggedIn && (
        <div>
          <h2>Post a Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <label>
              Rating:
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={isSubmitting}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>
            <br />
            <label>
              Review:
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="4"
                cols="50"
                disabled={isSubmitting}
              />
            </label>
            <br />
            <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white p-2 mt-4 rounded">
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AlbumPage;
