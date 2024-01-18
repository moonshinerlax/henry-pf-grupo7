import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    
    try {

      const {rows: users} = await sql`SELECT * FROM users WHERE email = ${email}`
      const user_id = users[0].id

      const { rows: cartItems } = await sql`
        SELECT * FROM cart_items WHERE user_id = ${user_id};
      `;

      return NextResponse.json({ cartItems, users });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return NextResponse.json({ message: 'Error fetching cart items' }, { status: 500 });
    }}
  
    export async function POST(req: Request) {
      const { paymentId, cart_items, user_id } = await req.json();
      
      try {
        
        const { rowCount } = await sql`
          INSERT INTO purchases (payment_id, user_id, cart)
          VALUES (${paymentId}, ${user_id}, ${cart_items}
          ON CONFLICT (paymentId)
          DO UPDATE SET cart = ${cart_items}`;
    
        if (rowCount > 0) {
          return NextResponse.json({ message: "Purchase registed", result: true });
        } else {
          return NextResponse.json({ message: "Failed to register purchase", result: false });
        }
      } catch (e) {
        return NextResponse.json({ message: "Failed to register purchase", result: false });
      }
    }


    export async function DELETE(req: Request) {
      const { cart_item_id } = await req.json();
      
      try {  
        const { rowCount } = await sql`DELETE FROM cart_items WHERE cart_item_id = ${cart_item_id}`;
    
        if (rowCount > 0) {
          return NextResponse.json({ message: "Item Deleted", result: true });
        } else {
          return NextResponse.json({ message: "Failed to delete", result: false });
        }
      } catch (e) {
        return NextResponse.json({ message: "Failed to delete", result: false });
      }
    }

    export async function PUT(req: Request) {
      const { cart_item_id, qty } = await req.json();
    
      try {
        const { rowCount } = await sql`
          UPDATE cart_items
          SET qty = ${qty}
          WHERE cart_item_id = ${cart_item_id}
        `;
    
        if (rowCount > 0) {
          return NextResponse.json({ message: "Quantity Updated", result: true });
        } else {
          return NextResponse.json({ message: "Failed to update quantity", result: false });
        }
      } catch (e) {
        return NextResponse.json({ message: "Failed to update quantity", result: false });
      }
    }