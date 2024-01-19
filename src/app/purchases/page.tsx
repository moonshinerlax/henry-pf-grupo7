"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import AverageRatingStars from "@/components/RatingReview/AverageRating";
import ReviewForm from "@/components/RatingReview/ReviewForm";

interface Product {
  buyId: string;
  productId: string;
  rating: number;
  review: string;
  userId: string;
  ratingId: number;
}

// ... Importaciones e interfaces

const PurchaseHistory = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetailsArray, setProductDetailsArray] = useState<any[]>([]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`/api/review?id=${userId}`);
      const responseData = await response.json();

      if (!Array.isArray(responseData.purchases)) {
        console.error(
          "Error: La propiedad 'purchases' no es un array:",
          responseData
        );
        setError("Error fetching product details");
        return;
      }

      const purchases = responseData.purchases;

      const detailsArray = await Promise.all(
        purchases.map(async (purchase: Product) => {
          const productId = purchase.productId;
          const response = await fetch(`/api/detail?id=${productId}`);
          const data = await response.json();
          const productDetails = data.products[0];
          return { productDetails };
        })
      );
      console.log(detailsArray);
      setProductDetailsArray(detailsArray);
    } catch (error) {
      setError("Error fetching product details");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <div className="flex flex-wrap flex-col content-center items-start mx-5">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>
      <div className="flex flex-wrap justify-center my-8">
        {productDetailsArray.length > 0 ? (
          productDetailsArray.map(({ productDetails }, index) => (
            <div
              key={index}
              className="flex flex-col h-96 w-72 cursor-pointer items-center border-solid border-x border-y border-gray-300 rounded m-2 hover:border-blue-600 bg-white justify-center"
            >
              <Link href={`/product/${productDetails.id}`}>
                <div className="flex justify-center mt-2 self-start">
                  <AverageRatingStars productId={productDetails.id} />
                </div>
                <div className="w-52 h-56 flex justify-center items-center">
                  <Image
                    className="hover:w-52 mt-5"
                    src={productDetails.image}
                    width={200}
                    height={200}
                    // layout="responsive"
                    alt={productDetails.model}
                  />
                </div>
                <div className="flex bg-white text-center justify-center mb-4 border-solid border-2 border-gray rounded-2xl w-11/12 mx-5 my-2 p-2 text-xs font-bold items-center">
                  <p className="text-black">{productDetails.model}</p>
                  <p className="bg-blue-600 mx-2 p-1 rounded-2xl text-white">
                    ${productDetails.price} USD
                  </p>
                </div>
              </Link>
              {/* <button className="bg-blue-600 text-white py-1 px-4 rounded-md">
                Leave Feedback
              </button> */}
              {/* Open the modal using document.getElementById('ID').showModal() method */}
              <button
                className="bg-blue-600 text-white py-1 px-4 rounded-md"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Leave Feddback
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <ReviewForm/>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          ))
        ) : (
          <p className="text-sm font-medium mt-4">
            No tienes compras registradas.
          </p>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
