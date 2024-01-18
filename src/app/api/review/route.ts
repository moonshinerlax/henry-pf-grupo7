import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";


interface Rating{
  ratingId : number;
  buyId: string;
  userId: string;
  productId: string;
  rating: number;
  review: string;
}
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");
  try {
    // Obtén la ruta completa del archivo data.json
    const filePath = path.join(process.cwd(), "data.json");

    // Lee el contenido del archivo
    const dataContent = await fs.readFile(filePath, "utf-8");

    // Parsea el contenido como JSON
    const jsonData = JSON.parse(dataContent);

    // Obtiene el id de la URL de la solicitud
    
    if (!userId) {
      return NextResponse.json({
        status: "error",
        message: "User ID not provided in the URL",
      });
    }

    
    return NextResponse.json({ purchases: jsonData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: "error",
      message: "Ocurrió un error al procesar la solicitud",
    });
  }
}

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

// export async function GET(req: NextRequest) {
//   try {
//     function isValidUUID(uuid: string): boolean {
//       const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
//       return uuidRegex.test(uuid);}
//     // Obtiene el id de la URL de la solicitud
//     const userId = req.nextUrl.searchParams.get("id");
//     if (!userId) {
//       return NextResponse.json({
//         status: "error",
//         message: "User ID not provided in the URL",
//       });
//     }
//     if (!isValidUUID(userId)) {
//       return NextResponse.json({
//         status: "error",
//         message: "Invalid User ID format",
//       });
//     }
//     const { rows: ratings } =
//       await sql`SELECT * FROM Ratings WHERE user_id = ${userId}`;

//     return NextResponse.json({ ratings });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({
//       status: "error",
//       message: "Ocurrió un error al procesar la solicitud",
//     });
//   }
// }

export async function PUT(req: Request) {
  try {
    const { buyId, rating, review } = await req.json();

    // Verificar si existe una entrada en Ratings con la buyId dada
    const existingRating =
      await sql`SELECT * FROM Ratings WHERE buy_id = ${buyId}`;

    // Actualizar rating y review para la buyId específica
    await sql`UPDATE Ratings SET rating = ${rating}, review = ${review}
      WHERE buy_id = ${buyId}`;

    console.log(`Rating y review actualizados para buyId ${buyId}`);
    return NextResponse.json({
      message: "Rating y Review Actualizados",
      result: true,
    });
  } catch (error) {
    console.log("Error al actualizar rating y review", error);
    return NextResponse.json({
      message: "Error al Actualizar Rating y Review",
      result: false,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ratingId = searchParams.get("ratingId");

    if (!ratingId) {
      return NextResponse.json({
        message: "Rating ID not provided",
        result: false,
      });
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
