import { ElementsConsumer, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import React from 'react';

interface CheckoutFormProps {
  stripe: any;
  elements: any;
  clientSecret: string;
}

interface InjectedCheckoutFormProps {
  clientSecret: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ stripe, elements, clientSecret }) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(PaymentElement),
        billing_details: {
          name: 'Customer Name', // Replace with the customer's name
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log('Payment successful');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
    </form>
  );
};

const InjectedCheckoutForm: React.FC<InjectedCheckoutFormProps> = ({clientSecret}) => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <CheckoutForm stripe={stripe} elements={elements} clientSecret={clientSecret}/>
      )}
    </ElementsConsumer>
  );
};

export default InjectedCheckoutForm;