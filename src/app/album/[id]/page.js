'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const AlbumPage = () => {
  const { id } = useParams(); // Access the dynamic 'id' parameter
  const [album, setAlbum] = useState(null);
  const router = useRouter(); // Use router for navigation

  useEffect(() => {
    const fetchAlbum = async () => {
      const res = await fetch(`/api/album/${id}`);
      const data = await res.json();

      if (data.album) {
        setAlbum(data.album);
      } else {
        console.error(data.error);
      }
    };

    fetchAlbum();
  }, [id]);

  if (!album) return <div>Loading...</div>;

  return (
    <div>
      <h1>{album.albumname}</h1>
      <img src={album.coverartURL} alt={album.albumname} />
      <p>Release Date: {new Date(album.releaseDate).toLocaleDateString()}</p>
      <p>Artist: {album.artist.artistname}</p> {/* Assuming you have the artist's name populated */}

      {/* Reviews Section */}
      <h2>Reviews</h2>
      <ul>
        {album.reviews.map((review) => (
          <li key={review._id}>
            <p>{review.username}: {review.reviewText}</p>
            <p>Rating: {review.rating}</p>
          </li>
        ))}
      </ul>

      {/* Button to redirect to the Post Review page */}
      <button
        onClick={() => router.push(`/album/${id}/post`)}
        className="bg-blue-500 text-white p-2 mt-4 rounded"
      >
        Post a Review
      </button>
    </div>
  );
};

export default AlbumPage;
