import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { amount } = await req.json();
  // const { amount } = data;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: "USD",
    });

    return NextResponse.json({paymentIntent});
  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}