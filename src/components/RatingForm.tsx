'use client'
import { useState, FormEvent } from 'react';

interface ReviewFormProps {
  productId: string;
  userId: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, userId }) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userId, rating, review }),
    });
    const data = await response.json();
    // manejar la respuesta
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label key={i} className="cursor-pointer">
              <input
                className="hidden"
                type="radio"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
              />
              <svg
                className={`h-6 w-6 ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 15.27L16.18 21l-1.64-7.03L22 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 4.73L3.82 21z"></path>
              </svg>
            </label>
          );
        })}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Reseña</label>
        <textarea
          value={review}
          onChange={(event) => setReview(event.target.value)}
          className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
        />
      </div>
      <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Enviar reseña
      </button>
    </form>
  );
};

export default ReviewForm;
