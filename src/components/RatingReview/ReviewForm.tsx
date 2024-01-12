"use client";
import { useState, useEffect, FormEvent } from "react";

interface ReviewFormProps {
  productId: string;
}
interface Review {
  id: number;
  productId: string;
  rating: number;
  review: string;
}
const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [errors, setErrors] = useState<{rating: string, review: string}>({rating: "", review: ""});
  const [touched, setTouched] = useState<{rating: boolean, review: boolean}>({rating: false, review: false});

  useEffect(() => {
    let errors = {rating: "", review: ""};
    if (touched.rating && rating > 0 && review.length < 5) {
      errors.review = "La reseña debe tener al menos 5 caracteres.";
    }
    if (touched.review && review.length < 5) {
      errors.review = "La reseña debe tener al menos 5 caracteres.";
    }
    if (touched.review && rating < 1 && review.length < 5) {
      errors.rating = "El rating mínimo es 1.";
      errors.review = "La reseña debe tener al menos 5 caracteres.";
    }
    if (touched.review && rating < 1 && review.length > 5) {
      errors.rating = "El rating mínimo es 1.";
    }
    setErrors(errors);
  }, [rating, review, touched]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Si no hay errores, procesa el formulario
    if (!errors.rating && !errors.review) {
      const response = await fetch('http://localhost:3000/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          rating,
          review
        })
      });

      if (response.ok) {
        console.log('Reseña enviada');

        // Resetea el formulario
        resetForm();
      } else {
        console.error('Error enviando la reseña');
      }
    }
  }

  const resetForm = () => {
    setRating(0);
    setReview("");
    setTouched({rating: false, review: false});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rating flex space-x-2">
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label key={i} className="cursor-pointer">
              <input
                className={`mask mask-star-2 ${rating > i ? "bg-orange-400" : "bg-gray-400"}`}
                type="radio"
                value={ratingValue}
                onClick={() => {
                  setRating(ratingValue);
                  setTouched({...touched, rating: true});
                }}
              />
              
            </label>
          );
        })}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reseña
        </label>
        <textarea
          value={review}
          onChange={(event) => {
            setReview(event.target.value);
            setTouched({...touched, review: true});
          }}
          className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
        />
      </div>
      {errors.rating && <p>{errors.rating}</p>}
      {errors.review && <p>{errors.review}</p>}
      <div className="flex space-x-4">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Enviar reseña
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
