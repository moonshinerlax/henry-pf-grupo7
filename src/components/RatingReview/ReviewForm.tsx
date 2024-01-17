"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";

const ReviewForm: React.FC = () => {
  const user = useUser();
  const userId = user.user?.id;
  
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [errors, setErrors] = useState<{ rating: string; review: string }>({
    rating: "",
    review: "",
  });
  const [touched, setTouched] = useState<{ rating: boolean; review: boolean }>({
    rating: false,
    review: false,
  });
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [buyId, setBuyId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");

  
  console.log(userId);

  const maxLength = 400; // Establece la longitud máxima permitida
  const remainingCharacters = maxLength - review.length;
  const isOverLimit = remainingCharacters < 0;
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length <= maxLength) {
      setReview(inputValue);
      setTouched({ ...touched, review: true });
    }
  };
  useEffect(() => {
    fetch(`/api/review?id=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.ratings)) {
          setBuyId(data.ratings.buyId);
          setProductId(data.ratings.productId);
        }
      })
      .catch((error) => console.error("Error obteniendo las reseñas", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let errors = { rating: "", review: "" };
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

  useEffect(() => {
    if (submitSuccess) {
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Recarga la página después de 2 segundos (ajusta según sea necesario)
    }
  }, [submitSuccess]);

  const resetForm = () => {
    setRating(0);
    setReview("");
    setTouched({ rating: false, review: false });
    setErrors({ rating: "", review: "" }); // Reinicia los errores
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!userId) {
      console.error("El usuario no está autenticado");
      return;
    }
    // Si no hay errores, procesa el formulario
    if (!errors.rating && !errors.review) {
      try {
        const response = await fetch("/api/review", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, buyId, rating, review }),
        });

        if (response.ok) {
          console.log("Reseña enviada");
          resetForm();
          setSubmitSuccess(true);
        } else {
          console.error("Error enviando la reseña");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    }
  };
  const isSubmitDisabled = !!errors.rating || !!errors.review;

  return (
    <>
      {submitSuccess && (
        <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span> Review submitted successfully!</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rating flex space-x-2">
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i} className="cursor-pointer">
                <input
                  className={`mask mask-star-2 ${
                    rating > i ? "bg-orange-400" : "bg-gray-400"
                  }`}
                  type="radio"
                  value={ratingValue}
                  onClick={() => {
                    setRating(ratingValue);
                    setTouched({ ...touched, rating: true });
                  }}
                />
              </label>
            );
          })}
        </div>
        <div>
          <label className="block text-sm font-medium "></label>
          <textarea
            value={review}
            maxLength={400}
            onChange={(event) => {
              const inputValue = event.target.value;
              if (inputValue.length <= 400) {
                setReview(inputValue);
                setTouched({ ...touched, review: true });
              }
            }}
            rows={4}
            className="mt-1 block w-full shadow-sm bg-gray-200 rounded-md  sm:text-sm"
            placeholder="Feedback"
          />
        </div>
        <div className="flex text-sm text-right">
          <span className="mr-auto">
            {review.length}/{maxLength}
          </span>
        </div>
        {errors.rating && <p>{errors.rating}</p>}
        {errors.review && <p>{errors.review}</p>}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Leave Feddback
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default ReviewForm;
