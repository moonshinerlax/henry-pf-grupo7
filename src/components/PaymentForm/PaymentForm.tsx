"use client";

import { CardElement, useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js";
import React from "react";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardElement = elements?.getElement("card");
  
    try {
      if (!stripe || !cardElement) return null;
  
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { amount: 89 } }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }
  
      const { clientSecret } = await response.json();
  
      await stripe?.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <form onSubmit={onSubmit}>
        <PaymentElement/>
      <CardElement />
      <button type="submit">Submit</button>
    </form>
  );
}