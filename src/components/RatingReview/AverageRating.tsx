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
    
    <div className="rating">
    {[...Array(5)].map((_, i) => (
      <input
        key={i}
        type="radio"
        name="rating"
        className={`mask mask-star-2 ${averageRating > i ? "bg-orange-400" : "bg-gray-400"}`}
        disabled
      />
    ))}
  </div>
  );
};





export default AverageRatingStars ;
