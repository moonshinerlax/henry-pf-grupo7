import { useState, useEffect } from "react";
interface CheckRatingProps {
  productId: string;
  userId: string;
}

const CheckRating: React.FC<CheckRatingProps> = ({ productId, userId }) => {
  const [hasExistingRating, setHasExistingRating] = useState(null);

  useEffect(() => {
    const checkRating = async () => {
      try {
        const response = await fetch(
          `/api/check-rating?id=${productId}&userId=${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setHasExistingRating(data.hasExistingRating);
        } else {
          console.error("Error checking existing rating:", data.message);
        }
      } catch (error) {
        console.error("Error checking existing rating:", error);
      }
    };

    checkRating();
  }, [productId, userId]);

  return hasExistingRating; // Devuelve true o false según corresponda, o null si hay un error.
};

export default CheckRating;
