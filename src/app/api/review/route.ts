import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, productId, rating, review } = await req.json();

    await sql`
    INSERT INTO ratings (user_id, product_id, rating, review)
    VALUES (${userId}, ${productId}, ${rating}, ${review})
    `;

    console.log("Reseña agregada exitosamente");
    return NextResponse.json({ message: "Reseña Agregada", result: true });
  } catch (error) {
    console.log("Error al agregar reseña", error);
    return NextResponse.json({
      message: "Error al Agregar Reseña",
      result: false,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const { ratingId, rating, review } = await req.json();

    
    await sql`
    UPDATE ratings
    SET rating = ${rating}, review = ${review}
    WHERE rating_id = ${ratingId}
    `;

    console.log("Reseña agregada exitosamente");
    return NextResponse.json({ message: "Reseña Agregada", result: true });
  } catch (error) {
    console.log("Error al agregar reseña", error);
    return NextResponse.json({
      message: "Error al Agregar Reseña",
      result: false,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Obtiene el id de la URL de la solicitud
    const productId = req.nextUrl.searchParams.get("id");
    const userid = req.nextUrl.searchParams.get("userid");
    if (!productId) {
      return NextResponse.json({
        status: "error",
        message: "Product ID not provided in the URL",
      });
    }
    if(!userid){
    const { rows: ratings } =
      await sql`SELECT * FROM Ratings WHERE product_id = ${productId}`;

    return NextResponse.json({ ratings });}

    const { rows: ratings } =
      await sql`SELECT * FROM Ratings WHERE product_id = ${productId} AND user_id = ${userid}`;
      
    return NextResponse.json({ ratings });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: "error",
      message: "Ocurrió un error al procesar la solicitud",
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url);
    const ratingId = searchParams.get("ratingId");

    if (!ratingId) {
      return NextResponse.json({message: "Rating ID not provided", result: false,});
    }
    await sql`DELETE FROM Ratings WHERE rating_id = ${ratingId}`;

    console.log(`Reseña con ratingId ${ratingId} eliminada exitosamente`);
    return NextResponse.json({ message: "Reseña Eliminada", result: true });
  } catch (error) {
    return NextResponse.json({
      message: "Error al Eliminar Reseña",
      result: false,
    });
  }
}