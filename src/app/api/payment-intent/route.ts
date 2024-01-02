import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { RootState, store } from '@/redux/store';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'default_secret_key', {
  apiVersion: '2023-10-16', // Adjust API version based on your Stripe version
});

const calculateOrderAmount = (cartItems: any[]) => {
  const subtotal = cartItems.reduce((a, c) => a + c.qty, 0);
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return subtotal;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { items }: { items: any[] } = req.body;

      const cartItems = store.getState().cart.cartItems; // Get this data from Redux store or wherever it is available

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(cartItems),
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}