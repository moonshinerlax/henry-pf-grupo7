"use client";
import { AddressElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/PaymentForm/PaymentForm";
import CheckOut from "../checkout/page";
import InjectedCheckoutForm from "@/components/PaymentForm/PaymentForm";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { savePaymentId } from "@/redux/slices/cartSlice";
import { RootState, store } from "@/redux/store";
import AddressForm from "@/components/PaymentForm/AddressForm";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);


async function fetchClientSecret(amount: number) {
  try {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
    
    if (response.ok) {
      const {paymentIntent} = await response.json();
      
      return paymentIntent;
    } else {
      throw new Error("Failed to fetch client secret");
    }
  } catch (error) {
    console.error("Error fetching client secret:", error);
    throw error;
  }
}

export default function Payment() {
  const amount = 100
  const dispatch = useDispatch()
  const {  } = useSelector((state: RootState) => state.cart)
  const [paymentIntent, setPaymentIntent] = useState()

  // useEffect(()=>{
  //   fetchClientSecret(amount)
  //   .then((data)=>{
  //     console.log(data.id)
  //     dispatch(savePaymentId(data))
  //     // setPaymentIntent(data)
  //   })
  //   // console.log(paymentIntent)
  // },[])

    const options = {
        clientSecret: 'pi_3OWaElK6mkRrJf7C02F9iEk1_secret_ApoNnEyGo6HqIebboyHkhbGuC',        
      };
  
      const appearance = {
        theme: 'night',
        labels: 'floating'
      };
  
    return (
     
    <Elements stripe={stripePromise} options={options}>
      <AddressForm/>
      <InjectedCheckoutForm clientSecret={'pi_3OWaElK6mkRrJf7C02F9iEk1_secret_ApoNnEyGo6HqIebboyHkhbGuCclientSecret'}/>
    </Elements>
  );
}