
import path from 'path';
import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse , NextRequest} from "next/server";
import fs from "fs";



export async function POST(req: Request) {
  try {
    const { userId, productId, rating, review  } = await req.json();

    await sql`INSERT INTO Ratings ( user_id, product_id, rating, review)
      VALUES ( ${userId}, ${productId}, ${rating}, ${review})`;

    console.log('Reseña agregada exitosamente');
    return NextResponse.json({ message: "Reseña Agregada", result: true });
  } catch (error) {
    console.log('Error al agregar reseña', error);
    return NextResponse.json({ message: "Error al Agregar Reseña", result: false });
  }
}












interface Review {
  ratingId: string;
  productId: string;
  rating: number;
  review: string;
}

export async function GET(req: NextRequest) {
  try {
    // Obtiene el id de la URL de la solicitud
    const productId = req.nextUrl.searchParams.get('id');
    const result = await sql`SELECT rating_id, user_id, product_id, rating, review 
                              FROM Ratings 
                              WHERE product_id = ${productId}`;

    console.log('Datos obtenidos exitosamente');
   
    return NextResponse.json({ status: "success", data:result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "error", message: "Ocurrió un error al procesar la solicitud" });
  }
}

