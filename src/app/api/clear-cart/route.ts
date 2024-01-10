import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: Request) {
    const { user_id } = await req.json();
    
    try {  
      const { rowCount } = await sql`DELETE FROM cart_items WHERE user_id = ${user_id}`;
  
      if (rowCount > 0) {
        return NextResponse.json({ message: "Item Deleted", result: true });
      } else {
        return NextResponse.json({ message: "Failed to delete", result: false });
      }
    } catch (e) {
      return NextResponse.json({ message: "Failed to delete", result: false });
    }
  }