import { QueryResultRow, sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    try {
      const { rows: purchases } = await sql`
        SELECT * FROM purchases WHERE user_id = ${id};
      `;

      return NextResponse.json({ purchases });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return NextResponse.json({ message: 'Error fetching cart items' }, { status: 500 });
    }}
  
    export async function POST(req: Request) {
      const { paymentId, cartItems, user_id } = await req.json();
      
      try {
        
        const { rowCount } = await sql<QueryResultRow>`
        INSERT INTO purchases (payment_id, user_id, cart)
        VALUES (${paymentId}, ${user_id}, ${cartItems})
        `
    
        if (rowCount > 0) {
          return NextResponse.json({ message: 'Purchase register succesfully', result: true });
        } else {
          return NextResponse.json({ message: "Failed to register purchase", result: false });
        }
      } catch (e) {
        return NextResponse.json({ message: "Failed to register purchase", cartItems, result: false });
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