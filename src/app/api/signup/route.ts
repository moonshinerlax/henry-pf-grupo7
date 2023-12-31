import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const { data } = await req.json()

        const existingUser = await sql`SELECT * FROM users WHERE id = ${data.userId}`;

        if (existingUser.rowCount > 0) {
            return NextResponse.json({
            message: "User ID already exists",
            result: false,
          });
        } else {
      await sql`INSERT INTO users (id, email)
      VALUES (${data.userId}, ${data.userEmail})`
      console.log('User added')
      return NextResponse.json({ message: "User Added", result: true });
      }
        } catch (error) {
        console.log('error adding user',error)
        return NextResponse.json({ message: error, result: false });
      }
    }