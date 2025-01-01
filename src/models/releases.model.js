import mongoose from "mongoose";
import Artist from "./artist.model";
import User from "./user.model";

// Define the release schema
const releaseSchema = new mongoose.Schema({
  details: {
    name: {
      type: String,
      required: [true, "Please provide the name of the release"],
    },
    coverArtURL: {
      type: String,
      required: [true, "Please provide the cover art URL of the release"],
    },
    releaseDate: {
      type: Date,
      required: [true, "Please provide the release date"],
    },
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist", // Reference the Artist model
    required: [true, "Please provide the artist for this album"],
  },
  reviews: [
    {
      username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference the User model for the reviewer's username
        required: [true, "Please enter the username of the reviewer"],
      },
      reviewText: {
        type: String,
        required: [true, "Please provide a review text"],
      },
      rating: {
        type: Number,
        required: [true, "Please enter a rating"],
        min: 1,
        max: 5,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
});

// Method to calculate the average rating
releaseSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const totalRating = this.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    this.averageRating = totalRating / this.reviews.length;
  }
};

// Pre-save hook to calculate the average rating before saving the release
releaseSchema.pre("save", function (next) {
  this.calculateAverageRating();
  next();
});

// Create and export the Release model
const Release =
  mongoose.models.Release || mongoose.model("Release", releaseSchema);

export default Release;
