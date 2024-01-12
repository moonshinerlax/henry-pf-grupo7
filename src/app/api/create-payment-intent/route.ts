import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { itemsPrice, payment_intent } = await req.json();
  if(payment_intent){
    try {
     const PaymentIntent = await stripe.paymentIntents.update(
      payment_intent,
      {
        amount: Number(itemsPrice) * 100,
      });
      return new NextResponse(JSON.stringify({ PaymentIntent }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
     } catch (error: any) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 410,
        headers: {
          'Content-Type': 'application/json',
        },
      });}
    }else{
  try {
    const PaymentIntent = await stripe.paymentIntents.create({
      amount: Number(itemsPrice) * 100,
      currency: "USD",
    });

    return NextResponse.json({PaymentIntent});
  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}}

export async function PUT(req: Request) {
  const { clientSecret, user_id, paymentid } = await req.json();

  try {
    const { rowCount } = await sql`
    UPDATE users
    SET clientsecret = ${clientSecret}, paymentid = ${paymentid}
    WHERE id = ${user_id}
        `;

        if (rowCount > 0) {
          return NextResponse.json({ message: `clientSecret updated ${clientSecret}, ${user_id}, ${paymentid}`, result: true });
        } else {
          return NextResponse.json({ message: `Failed to update clientSecret ${clientSecret}, ${user_id}`, result: false });
        }
      } catch (error: any) {
        return new NextResponse(error, {
          status: 400,
        });
      }
      }
