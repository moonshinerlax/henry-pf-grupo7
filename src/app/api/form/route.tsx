import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const {form}= await req.json();
      
      await sql`INSERT INTO products (model, category, image, price, website)
      VALUES (${form.model}, ${form.category}, ${form.image}, ${form.price}, ${form.website})`
      console.log('Producto agregado exitosamente')
      return NextResponse.json({ message: "Producto Agregado", result: true });
      } catch (error) {
        console.log('error al agregar producto',error)
        return NextResponse.json({ message: "Error al Agregar Producto", result: false });
      }
    }