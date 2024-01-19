'use client'
import { useState, useEffect } from 'react';

interface Review {
  ratingId: number;
  userid: string;
  productId: string;
  rating: number;
  review: string;
}
interface ReviewFormProps {
  productId: string;
}

const AverageRatingStars: React.FC<ReviewFormProps> = ({ productId }) => {

  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/review?id=${productId}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.ratings) && data.ratings.length > 0) {
          const totalRating = data.ratings.reduce((total: number, review: Review) => total + review.rating, 0);
          const avgRating = totalRating / data.ratings.length;
          setAverageRating(avgRating);
        }
      })
      .catch(error => console.error('Error obteniendo las reseñas', error));
  }, [productId]);


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
