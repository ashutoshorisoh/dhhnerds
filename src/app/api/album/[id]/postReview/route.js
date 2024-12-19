import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Album from "@/models/album.model";
import jwt from "jsonwebtoken";

// Connect to MongoDB if not already connected
connectDB();

// Function to extract user ID from JWT
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // Assuming you have a JWT secret
    return decoded.userId; // Return userId from JWT
  } catch (error) {
    return null; // Token verification failed
  }
};

// Handle POST request for posting a review
export async function POST(req, { params }) {
  const { id } = params; // Extract album id from URL params

  // Get the token from cookies (assuming it's stored as 'token' in cookies)
  const token = req.cookies.get("token"); // Use cookies.get() to retrieve token

  console.log("Received Token:", token); // Log the token for debugging

  const userId = getUserIdFromToken(token); // Verify token and get user ID
  console.log("Decoded User ID:", userId); // Log the decoded userId for debugging

  // If no userId (i.e., token verification failed), return unauthorized error
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Please log in to post a review." }, { status: 401 });
  }

  try {
    const { reviewText, rating } = await req.json(); // Get review data from request body

    // Validate the review data
    if (!reviewText || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid review or rating" }, { status: 400 });
    }

    // Find the album by ID
    const album = await Album.findById(id);

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    // Add the review to the album's reviews array
    album.reviews.push({
      username: userId,
      reviewText,
      rating,
    });

    // Save the album with the new review
    await album.save();

    // Return the updated album data with reviews
    return NextResponse.json(album);
  } catch (error) {
    // Handle any errors during the process
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
