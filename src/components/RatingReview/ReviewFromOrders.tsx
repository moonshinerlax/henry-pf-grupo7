"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, FormEvent , ChangeEvent} from "react";

interface ReviewFormProps {
  productId: string;
}

const ReviewFromOrders: React.FC<ReviewFormProps> = ({ productId }) => {
  const [rating, setRating] = useState<number>(0);
  const [ratingId, setRatingId] = useState<number>(0);
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
  const [alreadyReview, setAlreadyReview] = useState([]);

  const user = useUser();
  const userId = user.user?.id;

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

  useEffect(()=>{
    const fetchRating = async () =>{
        try {
            const response = await fetch(`/api/review?id=${productId}&userid=${userId}`)
            if(response.ok){
            const products = await response.json();
            setReview(products.ratings[0].review)
            setRating(products.ratings[0].rating)
            setRatingId(products.ratings[0].rating_id)
            setAlreadyReview(products.ratings)}  
        } catch (error) {
            console.log(error)
        }
    }
    fetchRating()
  },[submitSuccess])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!userId) {
      console.error("El usuario no está autenticado");
      return;
    }
    // Si no hay errores, procesa el formulario
    if (alreadyReview.length === 0) {
      try {
        const response = await fetch("/api/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId, rating, review }),
        });

        if (response.ok) {
          console.log("Reseña enviada")
          setSubmitSuccess(true);
          setTimeout(()=>{setSubmitSuccess(false)}, 1000)
        } else {
          console.error("Error enviando la reseña");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    } else {
      try {
        const response = await fetch("/api/review", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ratingId, rating, review }),
        });

        if (response.ok) {
          console.log("Reseña enviada")
          setSubmitSuccess(true);
          setTimeout(()=>{setSubmitSuccess(false)}, 1000)
        } else {
          console.error("Error enviando la reseña");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    }
  };


  const updateReview = async () => {
    if (!userId) {
      console.error("El usuario no está autenticado");
      return;
    }
      try {
        // const response = await fetch("/api/review", {
        //   method: "PUT",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ ratingId, rating, review }),
        // });
        const response = true
        if (response) {
          console.log("Reseña actualizada")
          console.log(rating, ratingId, review)
          setSubmitSuccess(true);
          setTimeout(()=>{setSubmitSuccess(false)}, 1000)
        } else {
          console.error("Error actualizando la reseña");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
  };
  const isSubmitDisabled = !!errors.rating || !!errors.review;

  return (
    <>
      {submitSuccess ? (
        <div role="alert" className="alert alert-success h-6 content-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-4 w-4"
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
          <span>Submitted!</span>
        </div>
      ) :
      <form onSubmit={handleSubmit} className="w-68">
        <div className="rating flex space-x-1">
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i} className="cursor-pointer">
                <input
                  className={`mask mask-star-2 w-4 ${
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
          <label className="block text-sm font-medium"></label>
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
            className="h-10 text-gray-900 block w-full shadow-sm bg-gray-200 rounded-md  sm:text-sm"
            placeholder="Please write at least 5 characters"
          /></div>
          {/* <div className="flex text-xs text-right">
        <span className="">{review.length}/{maxLength}</span>
        </div> */}
        {/* {errors.rating && <p>{errors.rating}</p>}
        {errors.review && <p>{errors.review}</p>} */}
        <div className="flex space-x-4">
          {alreadyReview.length > 0 ?
          <button className="inline-flex py-2 px-4 justify-center items-center h-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          type="submit"
            disabled={isSubmitDisabled}>
            Update
          </button> 
          : 
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex py-2 px-4 justify-center items-center h-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>}
        </div>
      </form>}
    </>
  );
};

export default ReviewFromOrders;