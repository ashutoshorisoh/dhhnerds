import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Album from "@/models/album.model"; // Path to your album model

// Connect to MongoDB if not already connected
connectDB();

// Handle GET request for fetching album by ID
export async function GET(req, { params }) {
  const { id } = await params; // Extract album id from URL params

  try {
    // Fetch album data from MongoDB and populate the username field in reviews
    const album = await Album.findById(id)
      .populate({
        path: "reviews.username",  // Populate the `username` field from the user model
        select: "username",         // Only select the `username` field from the user model
      });

    // If no album is found, return an error response
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    // Return the album data in the response
    return NextResponse.json(album);
  } catch (error) {
    // Handle any errors (e.g., database connection or query issues)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
