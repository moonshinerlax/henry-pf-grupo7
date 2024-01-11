'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Review {
  id: string;
  productId: string;
  rating: number;
  review: string;
}

const ReviewsList: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [reviews, setReviews] = useState<Review[]>([]);
  
    useEffect(() => {
      fetch(`/api/review?id=${id}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.data)) {
            setReviews(data.data);
          } else {
            console.error('Los datos devueltos por la API no son un array', data);
          }
        })
        .catch(error => console.error('Error obteniendo las reseñas', error));
    }, [id]);
  
  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className="flex flex-col space-y-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-6 w-6 ${review.rating > i ? "text-yellow-400" : "text-gray-400"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 15.27L16.18 21l-1.64-7.03L22 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 4.73L3.82 21z"></path>
                </svg>
              ))}
            </div>
            <div>
              <p className="block text-sm font-medium text-gray-700">{review.review}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm font-medium text-gray-700">Este producto todavía no tiene reseñas.</p>
      )}
    </div>
  );
};

export default ReviewsList;


