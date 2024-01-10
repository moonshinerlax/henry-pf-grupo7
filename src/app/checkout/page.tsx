/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { RootState } from "@/redux/store";
import CheckoutForm from "@/components/PaymentForm/CheckoutForm";
import AddressForm from "@/components/PaymentForm/AddressForm";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { savePaymentId } from "@/redux/slices/cartSlice";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutProps {
  clientSecret: string;
  amount: string;
  Cart: any;
}

interface CartItem {
  cart_item_id: number;
  userid: string;
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

const Checkout: React.FC<CheckoutProps> = ({ clientSecret, amount, Cart }: CheckoutProps) => {

  const stripeElementsOptions: StripeElementsOptions = {
    clientSecret: clientSecret,
    appearance: {
      theme: 'night'
    }
  }

  return (
    <div className="flex flex-row justify-around items-center w-90p p-5 border-0 border-solid border-gray-300">
      {clientSecret && (
        <Elements options={stripeElementsOptions} stripe={stripePromise}>
          <div className="w-1/3"><AddressForm /></div>
          <CheckoutForm />
          <div>
          <table className="min-w-full bg-gray-800 rounded-lg border-0 border-solid border-gray-400">
              <thead className="border-b border-gray-400 text-gray-300">
                <tr>
                  <th className="p-5 text-left">Product</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {Cart.map((item: CartItem) => (
                  <tr key={item.id} className="border-b border-gray-400 text-gray-400">
                    <td>
                      <Link
                        href={`/product/${item.id}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.id}
                          width={50}
                          height={50}
                          className="p-1 rounded-md"
                        ></Image>
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <h1>{item.qty}</h1>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>  
                  <th>{amount}</th>  
                </tr>
              </tfoot>
            </table>
          </div>
        </Elements>
      )}
    </div>
  );
};

export default function CheckOutWrapper() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentid, setPaymentid] = useState<string | null>(null)
  const [amount, setAmount] = useState('$3400')
  const { payment_id, user_id, itemsPrice, payment_intent, cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const status = searchParams.get('redirect_status')
  const prevPay = searchParams.get('payment_intent_client_secret')

  useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  // if(payment_intent){setPaymentid(payment_intent);
  //                     setClientSecret(payment_id)}
  if(!status && !prevPay){
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({itemsPrice, payment_intent}),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.PaymentIntent.client_secret);
        setPaymentid(data.PaymentIntent.id);
        setAmount(data.PaymentIntent.amount)
        console.log(data)
      });}
    }, []);

  useEffect(()=>{
    if(!status){
    fetch("/api/create-payment-intent", {
      method: "PUT",
      body: JSON.stringify({clientSecret, user_id, paymentid})
    })
    .then((res) => res.json())
      .then((data) => {
        console.log(data);})
  }},[paymentid])

  useEffect(()=>{if(prevPay){setClientSecret(prevPay)}},[])
  

  return <Checkout clientSecret={clientSecret} amount={amount} Cart={cartItems} />;
}
