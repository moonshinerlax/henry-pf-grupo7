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

      return NextResponse.json({ cartItems });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return NextResponse.json({ message: 'Error fetching cart items' }, { status: 500 });
    }}
  
    export async function POST(req: Request) {
      const { productId, model, image, price, qty, email } = await req.json();
      
      try {
        const { rows: users } =
          await sql`SELECT id FROM users WHERE email=${email}`;
        const user_id = users[0].id;
    
        const { rowCount } = await sql`
          INSERT INTO cart_items (user_id, product_id, name, image, price, qty)
          VALUES (${user_id}, ${productId}, ${model}, ${image}, ${price}, ${qty})  -- Assuming adding 1 as default quantity
          ON CONFLICT (user_id, product_id)
          DO UPDATE SET qty = cart_items.qty + ${qty};`;
    
        if (rowCount > 0) {
          return NextResponse.json({ message: "Added item to cart", result: true });
        } else {
          return NextResponse.json({ message: "Failed to add", result: false });
        }
      } catch (e) {
        return NextResponse.json({ message: "Failed to add", result: false });
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
    