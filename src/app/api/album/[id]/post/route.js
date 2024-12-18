import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Album from "@/models/album.model"; // Path to your album model
import jwt from "jsonwebtoken"; // Import JWT library to verify token

// Connect to MongoDB if not already connected
connectDB();

// Helper function to get the user ID from the token
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // Assuming you have a JWT secret
    return decoded.userId; // Return userId from JWT
  } catch (error) {
    return null; // Token verification failed
  }
};

// Handle POST request
export async function POST(req, { params }) {
  const albumId = await params.id; // Directly destructure params to get albumId

  // Get token from cookies (passed via middleware)
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // Get the user ID using the token
  const userId = getUserIdFromToken(token); // Use token value directly

  if (!userId) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  // Parse the incoming request body (review data)
  const { reviewText, rating } = await req.json();

  // Validate the review data
  if (!reviewText || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid review data" }, { status: 400 });
  }

  try {
    // Find the album by its ID
    const album = await Album.findById(albumId);

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    // Create the new review object
    const newReview = {
      username: userId,
      reviewText,
      rating,
    };

    // Add the new review to the album's reviews array
    album.reviews.push(newReview);

    // Recalculate the average rating
    album.calculateAverageRating();

    // Save the updated album
    await album.save();

    return NextResponse.json({ message: "Review posted successfully", album });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
  }
}
