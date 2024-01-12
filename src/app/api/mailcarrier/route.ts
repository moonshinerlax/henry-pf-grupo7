import { sendMail } from "../../../../scripts/mailService";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { subject, emailTo, message } = await req.json();
  
    try {
     await sendMail(
      subject,
      emailTo,
      message
    );
      return new NextResponse(JSON.stringify('done good'), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
     } catch (error: any) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 410,
        headers: {
          'Content-Type': 'application/json',
        },
      });}
    }
