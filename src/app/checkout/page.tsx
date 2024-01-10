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

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutProps {
  clientSecret: string;
  amount: string;
}

const Checkout: React.FC<CheckoutProps> = ({ clientSecret, amount }) => {

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
          <p>{amount}</p>
          <p>{clientSecret}</p>
        </Elements>
      )}
    </div>
  );
};

export default function CheckOutWrapper() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentid, setPaymentid] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const { payment_id, user_id, itemsPrice, payment_intent } = useSelector((state: RootState) => state.cart);
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
  

  return <Checkout clientSecret={clientSecret} amount={amount} />;
}
