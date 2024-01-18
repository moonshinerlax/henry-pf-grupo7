import React, { useEffect, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { set } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addClientSecret, addPaymentIntent } from "@/redux/slices/cartSlice";
import { useUser } from "@clerk/nextjs";
import { compilePurchaseEmail } from "../siteEmails/PurchaseEmail";


const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user_id, cartItems, itemsPrice } = useSelector((state: RootState) => state.cart);
  const emptypayment = null
  const emptypaymentid = null
  const dispatch = useDispatch()
  const user = useUser()
  const email = user.user?.primaryEmailAddress?.emailAddress
  const name = user.user?.firstName ?? ''
  const url = '/'
  const emailmessage = compilePurchaseEmail(name, itemsPrice, cartItems)

  const emailData = {
    subject: 'CodeWave Central Purchase Confirmation',
    emailTo: email,
    message: emailmessage,
  }
 
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentId, setPaymentId] = useState<string | null>('')

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
      
    const retrievePaymentIntent = async () => {
      if (!stripe || !clientSecret) return;

      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Payment succeeded! Thank you for your Purchase!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
        setPaymentId(String(paymentIntent?.id))
      } catch (error) {
        setMessage("Error retrieving payment status.");
      }
    };

    retrievePaymentIntent();
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
      });
      
      if (error && (error.type === "card_error" || error.type === "validation_error")) {
        setMessage(error.message as string);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } catch (error) {
      setMessage("Error confirming payment.");
    }

    setIsLoading(false);
  };

  const stripePaymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs'
  };

  const handlePopupClick = () => {
    if(message === 'Payment succeeded! Thank you for your Purchase!'){
      // cartItems.map((product)=>{
      //   fetch("/api/review", {
      //     method: "POST",
      //     body: JSON.stringify({paymentId, product.})
      //   })
      // })
      fetch("/api/create-payment-intent", {
        method: "PUT",
        body: JSON.stringify({emptypayment, user_id, emptypaymentid})
      })
      fetch("/api/clear-cart", {
        method: "DELETE",
        body: JSON.stringify({user_id})
      })
      fetch("/api/mailcarrier", {
        method: "POST",
        body: JSON.stringify(emailData)
      })
      dispatch(addClientSecret(''), addPaymentIntent(''))
      setMessage(null); // Hide the message
    window.location.href = window.location.origin; // Redirect to localhost
    }
    setMessage(null)
  };

  return (
    <div>
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={stripePaymentElementOptions} />
      <button className="bg-green-400 text-black w-full h-10 rounded-lg mt-8" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}</span>
      </button>
    </form>
    {message && <div onClick={(e)=>handlePopupClick()} className="fixed inset-0 z-50 flex items-center justify-center backdrop-filter backdrop-blur-lg bg-opacity-75 bg-gray-500" id="payment-message">
      <div className="bg-gray-900 rounded-lg p-8">
        {message}
      </div>
    </div>}
    </div>
  );
};

export default CheckoutForm;