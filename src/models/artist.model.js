import mongoose from "mongoose";
import User from "./user.model";
import Album from "./album.model";

const artistSchema = new mongoose.Schema({
    artistname: {
        type: String,
        required: [true, "Please enter artist name"],
        unique: true,
    },
    
    spotifyURL: {
        type: String,
        required: [true, "Please enter artist's spotify URL"],
        unique: true,
    },
});

const Artist = mongoose.models.Artist || mongoose.model("Artist", artistSchema);

export default Artist;
