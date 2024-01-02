'use client'
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
  } from '@stripe/react-stripe-js';



const stripePromise = loadStripe('pk_test_51OTYZkK6mkRrJf7CSblUztBtK0flEj4aNqJyPns1gXnkZwvCkN08v2GQmNsFgjUYXclegdI866PMa98clk2a4Rmb00PhnXPSTu');

const CheckOut: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    fetch('/create-checkout-session', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options = { clientSecret };

  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider 
        stripe={stripePromise} 
        options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
};

export default CheckOut;