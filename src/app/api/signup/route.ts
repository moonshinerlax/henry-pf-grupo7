import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest} from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    try {

      const {rows: users} = await sql`SELECT * FROM users WHERE id = ${id}`
      
      return NextResponse.json({ users });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return NextResponse.json({ message: 'Error fetching cart items' }, { status: 500 });
    }}


export async function POST(req: Request) {
    try {
        const { id, email } = await req.json()

        const existingUser = await sql`SELECT * FROM users WHERE id = ${id}`;

        if (existingUser.rowCount > 0) {
            return NextResponse.json({
            message: "User ID already exists",
            result: false,
          });
        } else {
      await sql`INSERT INTO users (id, email)
      VALUES (${id}, ${email})
      ON CONFLICT (email)
      DO UPDATE SET id = ${id}`
      console.log('User added')
      return NextResponse.json({ message: "User Added", result: true });
      }
        } catch (error) {
        console.log('error adding user',error)
        return NextResponse.json({ message: error, result: false });
      }
    }

    export async function PUT(req: Request) {
      const { id, disable } = await req.json();
    
      try {
        const { rowCount } = await sql`
          UPDATE users
          SET disable = ${disable}
          WHERE id = ${id}
        `;
    
        if (rowCount > 0) {
          return NextResponse.json({ message: "User Disable", result: true });
        } else {
          return NextResponse.json({ message: "Failed to disable user", result: false });
        }
      } catch (e) {
        return NextResponse.json({ message: "Failed to disable user", result: false });
      }
    }