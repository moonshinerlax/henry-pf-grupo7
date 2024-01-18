'use client'
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Product {
  buyId: string,
  productId: string,
  rating: number,
  review: string,
  userId: string,
  ratingId: number
}

interface Products {
  buyId: string;
  productId: string;
}
// ... (importaciones y definiciones de interfaces)

const PurchaseHistory =  () => {
  const { user } = useUser();
  const userId = user?.id;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetailsArray, setProductDetailsArray] = useState<any[]>([]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`/api/review?id=${userId}`);
      const purchases = await response.json();
      console.log(purchases);
      const detailsArray = await Promise.all(
        purchases.map(async (purchase: Product) => {
          const productId = purchase.productId;
          const response = await fetch(`/api/detail?id=${productId}`);
          const productDetails = await response.json();
          console.log(productDetails);
          return { productDetails };
        })
      );

      ;
      setProductDetailsArray(detailsArray)

      console.log(productDetailsArray)
    } catch (error) {
      setError("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []); // ejecuta fetchProductDetails cuando el componente se monta

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div>
      <h1>Purchase History</h1>
    <div>
      {productDetailsArray.length > 0 ?
        (productDetailsArray.map((purchase, index) => (
        <div key={index}>
          {/* <img src={purchase.productDetails.image} alt={`Product ${index}`} /> */}
          <p>Product ID: {purchase.productId}</p>
          {/* <p>Product Model: {purchase.model}</p>
          <p>Product Price: {purchase.price}</p> */}
          <hr />
        </div>
        ))) : (
          <p className="text-sm font-medium ">
            Este producto todavía no tiene reseñas.
          </p>
        )}
      </div>
      
      
    </div>
  );
}
export default PurchaseHistory;