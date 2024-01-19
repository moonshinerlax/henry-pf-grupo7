import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get("id");
    const userId = req.nextUrl.searchParams.get("userId");

    if (!productId || !userId) {
      return NextResponse.json({
        status: "error",
        message: "Product ID or User ID not provided in the URL",
      });
    }

    const { rows: existingRatings } = await sql`
      SELECT * FROM Ratings 
      WHERE product_id = ${productId} AND user_id = ${userId}
    `;

    const hasExistingRating = existingRatings.length > 0;

    return NextResponse.json({ hasExistingRating });
  } catch (error) {
    console.error('Error checking existing rating:', error);
    return NextResponse.json({
      status: "error",
      message: "Ocurrió un error al verificar la calificación existente",
    }, { status: 500 });
  }
}
