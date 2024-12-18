import connectDB from "@/dbconfig/dbconfig";
import Artist from "@/models/artist.model";

connectDB();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { artistname, spotifyURL } = reqBody;

        // Check if the artist already exists
        const isArtist = await Artist.findOne({ artistname });
        if (isArtist) {
            return new Response(
                JSON.stringify({ message: "Artist already exists" }),
                { status: 400 }
            );
        }

        // Create a new artist and save to DB
        const newArtist = new Artist({
            artistname,
            spotifyURL,
        });

        const savedArtist = await newArtist.save();

        return new Response(
            JSON.stringify({
                message: "Artist added successfully",
                success: true,
                savedArtist,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST:", error);
        return new Response(
            JSON.stringify({ message: "Something went wrong" }),
            { status: 500 }
        );
    }
}
