'use client'
import { useState, useEffect } from "react";
import useSWR from "swr";

interface Review {
  id: number;
  productId: string;
  userId: number;
  rating: number;
  review: string;
  timestamp: string;
}

interface ReviewsProps {
  productId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
  const { data, error } = useSWR<Review[]>(
    `/api/review?productId=${productId}`,
    fetcher
  );

  if (error) return <div>Error al cargar las reseñas.</div>;
  if (!data) return <div>Producto sin Resenas</div>;

  return (
    <div className="space-y-4">
      {data.map((review) => (
        <div key={review.id} className="p-4 border rounded shadow-sm space-y-2">
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    ratingValue <= review.rating
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 15.27L16.18 21l-1.64-7.03L22 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 4.73L3.82 21z"></path>
                </svg>
              );
            })}
          </div>
          <p>{review.review}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
