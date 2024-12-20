import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Album from "@/models/album.model";
import User from "@/models/user.model";

connectDB().then(() => console.log("Database connected successfully")).catch(err => console.error("Database connection error:", err));


export async function POST(req) {
  const albumId = req.nextUrl.pathname.split('/').slice(-2, -1)[0];

  if (!albumId) {
    return NextResponse.json({ error: "Album ID is required" }, { status: 400 });
  }

  try {
    const { email, reviewText, rating } = await req.json();
    console.log("Request received with data:", { email, reviewText, rating });


    // Validate required fields
    if (!email || !reviewText || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid or missing data" }, { status: 400 });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("User Found:", user);

    const username = user._id; // Use ObjectId from the User model
; // Get the username from the user object

    // Find the album by ID
    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }
    console.log("Album Found:", album);

    // Add the review to the album using the username
    album.reviews.push({ username: user._id, reviewText, rating });
    await album.save();

    return NextResponse.json({ message: "Review added successfully", album });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}
