'use client'
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";



interface Product {
  id: string;
  model: string;
  image: string;
  price: string;
}

export default function PurchaseHistory({
  params,
}: {
  params: { id: string };
}) {
    const {user} = useUser()
    const userId =  user.id;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    
  const fetchDetail = async () => {
    try {
      const response = await fetch(`/api/detail?id=${params.id}`);
      if (response.ok) {
        const details = await response.json();
        setProducts(details.products);
      } else {
        setError("Failed to fetch product details");
      }
    } catch (error) {
      setError("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main>
      <h1>Purchase History</h1>
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.model}</h2>
            <img src={product.image} alt={product.model} />
            <p>Price: {product.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
