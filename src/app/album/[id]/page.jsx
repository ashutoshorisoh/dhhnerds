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
  const {userEmail, setUserEmail} = emailContext()


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
  
    // Validate review data
    if (!reviewText.trim() || rating < 1 || rating > 5) {
      alert('Please provide a valid review and ensure the rating is between 1 and 5.');
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
            <h1>useremail : {userEmail}</h1>

      <h1>Album ID: <p className="bg-blue">{albumId}</p></h1>
      <h1>Album: {albumData?.name}</h1>
      <img src={albumData?.coverartURL} alt="Album Cover" />
      <p>{albumData?.description}</p>
      <p>Artist: {albumData?.artist}</p>
      <h1>{userEmail}</h1>

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
    </div>
  );
};

export default AlbumPage;
