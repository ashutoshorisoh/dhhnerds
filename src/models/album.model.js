import mongoose from "mongoose";
import User from "./user.model";
import Artist from "./artist.model";

const albumSchema = new mongoose.Schema({
  albumname: {
    type: String,
    required: [true, "Please enter album name"],
    unique: true,
  },
  coverartURL: {
    type: String,
    required: [true, "Please enter album cover art URL"],
    unique: true,
  },
  releaseDate: {
    type: Date,
    required: [true, "Please provide the release date for this album"],
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist", // Reference the Artist model
    required: [true, "Please provide the artist for this album"],
  },
  otherartists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist", // Reference the Artist model for other artists
    }
  ],
  reviews: [
    {
      username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Make sure this matches the model name
        required: [true, "Please enter username"],
      },
      reviewText: {
        type: String,
        required: [true, "Please provide a review"],
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

albumSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  }
};

albumSchema.pre("save", function(next) {
  this.calculateAverageRating();
  next();
});

const Album = mongoose.models.Album || mongoose.model("Album", albumSchema);

export default Album;
