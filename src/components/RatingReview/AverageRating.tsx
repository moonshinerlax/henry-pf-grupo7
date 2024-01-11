'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Review {
  id: string;
  productId: string;
  rating: number;
  review: string;
}

const useAverageRating = () => {
  const { id } = useParams<{ id: string }>();
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/review?id=${id}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          const totalRating = data.data.reduce((total: number, review: Review) => total + review.rating, 0);
          const avgRating = totalRating / data.data.length;
          setAverageRating(avgRating);
        } else {
          console.error('Los datos devueltos por la API no son un array', data);
        }
      })
      .catch(error => console.error('Error obteniendo las reseñas', error));
  }, [id]);

  return averageRating;
};

const AverageRatingStars: React.FC = () => {
  const averageRating = useAverageRating();

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-6 w-6 ${averageRating > i ? "text-yellow-400" : "text-gray-400"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 15.27L16.18 21l-1.64-7.03L22 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 4.73L3.82 21z"></path>
        </svg>
      ))}
      <span className="text-sm font-medium text-gray-700">{averageRating === 0 ? averageRating : averageRating.toFixed(2)}</span>
    </div>
  );
};





export default AverageRatingStars ;
