import mongoose from "mongoose";
import Artist from "./artist.model";
import Album from "./album.model";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
  },
  fullname: {
    type: String,
    required: [true, "Please enter a fullname"],
  },
  email: {
    type: String,
    required: [true, "Please enter a email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isCurator: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifiedToken: String,
  verifiedTokenExpiry: Date,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
