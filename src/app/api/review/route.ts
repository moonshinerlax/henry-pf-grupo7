import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, productId, rating, review } = await req.json();

    await sql`INSERT INTO Ratings ( user_id, product_id, rating, review)
      VALUES ( ${userId}, ${productId}, ${rating}, ${review})`;

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
    // function isValidUUID(uuid: string): boolean {
    //   const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    //   return uuidRegex.test(uuid);}
    // // Obtiene el id de la URL de la solicitud
    // const productId = req.nextUrl.searchParams.get("id");
    // if (!productId) {
    //   return NextResponse.json({
    //     status: "error",
    //     message: "Product ID not provided in the URL",
    //   });
    // }
    // if (!isValidUUID(productId)) {
    //   return NextResponse.json({
    //     status: "error",
    //     message: "Invalid Product ID format",
    //   });
    // }
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const { rows: ratings } = await sql`SELECT * FROM ratings WHERE user_id = ${id}`

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