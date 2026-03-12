import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/app/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 });
    }

    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.contacts.create({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    } else {
      console.log("NEWSLETTER SIGNUP (Resend not configured):", email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
