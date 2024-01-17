import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    function isValidUUID(uuid: string): boolean {
      const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      return uuidRegex.test(uuid);
    }
    // Obtiene el id de la URL de la solicitud
    const productId = req.nextUrl.searchParams.get("id");
    if (!productId) {
      return NextResponse.json({
        status: "error",
        message: "Product ID not provided in the URL",
      });
    }
    if (!isValidUUID(productId)) {
      return NextResponse.json({
        status: "error",
        message: "Invalid Product ID format",
      });
    }
    const { rows: ratings } =
      await sql`SELECT * FROM Ratings WHERE product_id = ${productId}`;

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: "error",
      message: "Ocurrió un error al procesar la solicitud",
    });
  }
}
