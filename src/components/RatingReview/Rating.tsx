"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Review {
  ratingId: number;
  userId: string;
  productId: string;
  rating: number;
  review: string;
}

const ReviewsList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch(`/api/review?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setReviews(data.data);
        } else {
          console.error("Los datos devueltos por la API no son un array", data);
        }
      })
      .catch((error) => console.error("Error obteniendo las reseñas", error));
  }, [id]);

  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.ratingId} className="flex flex-col space-y-2">
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <input
                  key={i}
                  type="radio"
                  name="rating"
                  className={`mask mask-star-2 ${
                    review.rating > i ? "bg-orange-400" : "bg-gray-400"
                  }`}
                  disabled={true}
                />
              ))}
            </div>
            <div>
              <p className="block text-sm font-medium">
                {review.review}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm font-medium ">
          Este producto todavía no tiene reseñas.
        </p>
      )}
    </div>
  );
};

export default ReviewsList;
