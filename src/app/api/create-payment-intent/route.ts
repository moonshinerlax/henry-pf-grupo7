import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { amount, clientSecret } = await req.json();
  if(clientSecret){
    try {
     const paymentIntent = await stripe.paymentIntents.retreive(clientSecret)
     const updatePaymentIntent = await stripe.paymentIntents.update(
      paymentIntent.id,
      {
        amount: Number(amount) * 100,
      });
      return NextResponse.json({paymentIntent});
     } catch (error: any) {
      return new NextResponse(error, {
        status: 400,
      });
    } 
    }else{
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "USD",
    });

    return NextResponse.json({paymentIntent});
  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}}

export async function PUT(req: NextRequest) {
  const { clientSecret, user_id } = await req.json();
  try {
    const { rowCount } = await sql`
          UPDATE users
          SET clientsecret = ${clientSecret}
          WHERE id = ${user_id}
        `;

        if (rowCount > 0) {
          return NextResponse.json({ message: "clientSecret updated", result: true });
        } else {
          return NextResponse.json({ message: "Failed to update clientSecret", result: false });
        }
      } catch (e) {
        return NextResponse.json({ message: "Failed to update clientSecret", result: false });
      }
}