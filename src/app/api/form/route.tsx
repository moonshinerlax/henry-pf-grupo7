import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
    try {
      const { rows: products } = await sql`
        SELECT * FROM products ORDER BY model
      `;
      const { rows: users } = await sql`
        SELECT * FROM users
      `;
      return NextResponse.json({ products, users });
    } catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
    }}

export async function POST(req: Request) {
    try {
        const {form}= await req.json();
      
      await sql`INSERT INTO products (model, category, image, price, specs)
      VALUES (${form.model}, ${form.category}, ${form.image}, ${form.price}, ${form.specs})`
      console.log('Producto agregado exitosamente')
      return NextResponse.json({ message: "Producto Agregado", result: true });
      } catch (error) {
        console.log('error al agregar producto',error)
        return NextResponse.json({ message: "Error al Agregar Producto", result: false });
      }
    }



    export async function PUT(req: Request) {
      const { id, disable } = await req.json();
    
      try {
        const { rowCount } = await sql`
          UPDATE products
          SET disable = ${disable}
          WHERE id = ${id}
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