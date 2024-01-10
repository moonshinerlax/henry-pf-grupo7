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

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutProps {
  clientSecret: string;
}

const Checkout: React.FC<CheckoutProps> = ({ clientSecret }) => {

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
          <AddressForm/>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default function CheckOutWrapper() {
  const [clientSecret, setClientSecret] = useState("");
  const { payment_id, cartItems, totalPrice } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch()
  const { userid } =cartItems[0]

  useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  if(payment_id){
    setClientSecret(payment_id)
  }
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({totalPrice, clientSecret}),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.clientSecret));
    
    fetch("/api/create-payment-intent", {
      method: "PUT",
      body: JSON.stringify({clientSecret, userid })
    })

    dispatch(savePaymentId(clientSecret))
  }, [clientSecret]);

  return <Checkout clientSecret={clientSecret} />;
}
