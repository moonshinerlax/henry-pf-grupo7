'use client'

import { useUser } from "@clerk/nextjs"
import Image from "next/image";
import { useEffect, useState } from "react"
import ReviewForm from "../RatingReview/ReviewForm";
import ReviewFromOrders from "../RatingReview/ReviewFromOrders";

interface Product {
    payment_id: string;
    purchase_id: string;
    purchase_date: string;
    cart: any;
  }
  
  interface CartItem {
    cart_item_id: string;
    id: string;
    image: string;
    name: string;
    price: string;
    qty: number;
    userid: string;
  }

export default function Purchases() {
    const user = useUser();
    const id = user.user?.id;
    const [products, setProducts] = useState<Product[]>([]);
  
    useEffect(() => {
      const fetchPurchases = async () => {
        try {
          const response = await fetch(`/api/orders?id=${id}`);
  
          if (response.ok) {
            const { purchases } = await response.json();
            setProducts(purchases)
          } else {
            console.error(`Failed to fetch purchases. Status: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching purchases:", error);
        }
      };
  
      if (id) {
        fetchPurchases();
      }
    }, [id]);
  
    return (
      <div className="text-black">
        {products.map((order) => (
          <div className="w-full border border-2 border-gray-900 m-4 rounded-lg" key={order.payment_id}>
            <h1 className="ml-2 text-lg">Order: {order.payment_id}</h1>
            <table className="min-w-full rounded-lg">
            <thead className="border-b">
              <tr className="font-bold">
                  <th className="p-5 text-left">Product</th>
                  <th className="p-5 text-center">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  {/* <th className="p-5 text-center">Review</th> */}
              </tr>
            </thead>
            <tbody>
              {order.cart.cartItems.map((item: CartItem) => (
                <tr key={item.id} className="border-b">
                  <td className="p-5 text-left flex flex-row items-center">
                    <Image className='rounded-lg mr-2' src={item.image} height={50} width={50} alt={item.name} />
                  {item.name}</td>
                  <td className="p-5 text-center">{item.qty}</td>
                  <td className="p-5 text-right">{item.price}</td>
                  <td className="text-right"><ReviewFromOrders productId={item.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-evenly text-lg">
            <h1 className="font-bold size-lg">Purchase Date: {formatPurchaseDate(order.purchase_date)}</h1>
            <h1 className="font-bold size-lg">Total: ${calculateOrderTotal(order.cart.cartItems)}</h1>
          </div>
          </div>
        ))}
      </div>
    );
  }

  function formatPurchaseDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };;
    const purchaseDate = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(purchaseDate);
    
    return formattedDate.replace(/\s(\d+)$/, ` $1`);
  }

  function calculateOrderTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
  }