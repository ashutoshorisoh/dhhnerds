'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

const PostReviewPage = () => {
  const pathname = usePathname(); // Get the current URL path
  const albumId = pathname.split('/')[2]; // Extract albumId from the path (e.g., /album/:albumId/post)
  
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for review text and rating
    if (!albumId || !reviewText.trim() || rating < 1 || rating > 5) {
      alert('Please provide a valid review and ensure the album ID is present and rating is between 1 and 5.');
      return;
    }

    const reviewData = {
      reviewText: reviewText.trim(),
      rating,
    };

    try {
      // Log review data for debugging
      console.log('Review Data:', reviewData);

      // Update the URL for posting a review
      const response = await axios.post(`/api/album/${albumId}/post`, reviewData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // Include credentials if needed for authentication
      });

      // Handle response
      if (response.data.message === 'Review posted successfully') {
        alert('Review submitted successfully!');
        router.push(`/album/${albumId}`); // Redirect to the album details page
      } else {
        alert(response.data.error || 'Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="text-black bg-blue-200">
      <h1>Post a Review for Album</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
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
          ></textarea>
        </label>
        <br />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4 rounded">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default PostReviewPage;
