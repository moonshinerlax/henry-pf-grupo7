import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { productId, email } = await req.json();
  
  try {
    const { rows: users } =
      await sql`SELECT id FROM users WHERE email=${email}`;
    const user_id = users[0].id;
    const { rows } =
      await sql`INSERT INTO cart_items(user_id, product_id) VALUES(${user_id}, ${productId})`;
    return NextResponse.json({ message: "Added item to cart", result: true });
  } catch (e) {
    return NextResponse.json({ message: "Failed to add", result: false });
  }
}