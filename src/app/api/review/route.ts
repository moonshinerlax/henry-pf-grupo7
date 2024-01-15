
import path from 'path';
import { sql } from "@vercel/postgres";
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
  id: string;
  productId: string;
  rating: number;
  review: string;
}

export async function GET(req: NextRequest) {
  try {
    // Obtiene el id de la URL de la solicitud
    const id = req.nextUrl.searchParams.get('id');

    // Define la ruta del archivo
    const filePath = path.join(process.cwd(), 'data.json'); // Cambia 'data.json' por la ruta donde tienes guardado el archivo

    // Lee el archivo JSON existente
    const rawData = fs.readFileSync(filePath).toString();
    const data: Review[] = JSON.parse(rawData);

    // Filtra los objetos que coincidan con el id
    const matchingObjects = data.filter((item: Review) => item.productId === id);
    console.log(matchingObjects); // Imprime los objetos coincidentes en la consola
    return NextResponse.json({ status: "success", data: matchingObjects });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "error", message: "Ocurrió un error al procesar la solicitud" });
  }
}

