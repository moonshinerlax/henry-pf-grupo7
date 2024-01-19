import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest} from "next/server";

export async function PUT(req: Request) {
    const { id, email } = await req.json();
  
    try {
      const { rowCount } = await sql`
        UPDATE users
        SET id = ${id}
        WHERE email = ${email}
      `;
  
      if (rowCount > 0) {
        return NextResponse.json({ message: "User Updated", result: true });
      } else {
        return NextResponse.json({ message: "Failed to update user", result: false });
      }
    } catch (e) {
      return NextResponse.json({ message: "Failed to update user", result: false });
    }
  }