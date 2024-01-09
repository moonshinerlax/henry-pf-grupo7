'use client'
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "@/components/PaymentForm/CheckoutForm";
import AddressForm from "@/components/PaymentForm/AddressForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutProps {
  clientSecret: string;
}

const Checkout: React.FC<CheckoutProps> = ({ clientSecret }) => {
  const appearance = {
    theme: 'night',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="flex flex-row justify-around items-center w-90p p-5 border-0 border-solid border-gray-300">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <AddressForm/>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default function CheckOutWrapper() {
  const [clientSecret, setClientSecret] = useState('pi_3OWaElK6mkRrJf7C02F9iEk1_secret_ApoNnEyGo6HqIebboyHkhbGuC');

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch("/api/create-payment-intent", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  // }, []);

  return <Checkout clientSecret={clientSecret} />;
}
