import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";

function htmlResponse(title: string, message: string, status = 200) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5;}
.card{background:white;padding:2.5rem;border-radius:1rem;box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:400px;text-align:center;}
h1{font-size:1.25rem;margin:0 0 .75rem;color:#1a1a2e;}p{color:#666;margin:0;line-height:1.5;}</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`;
  return new NextResponse(html, { status, headers: { "Content-Type": "text/html" } });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const action = request.nextUrl.searchParams.get("action");

  if (!token || !action || !["confirm", "decline"].includes(action)) {
    return htmlResponse("Invalid Link", "This link is missing required parameters.");
  }

  const supabase = getSupabaseAdmin();

  const { data: reservation, error } = await supabase
    .from("reservations")
    .select("id, status, name, pickup_date")
    .eq("confirm_token", token)
    .single();

  if (error || !reservation) {
    return htmlResponse("Not Found", "This reservation was not found.", 404);
  }

  if (reservation.status !== "pending") {
    return htmlResponse(
      "Already Processed",
      `This reservation for ${reservation.name} has already been ${reservation.status}.`
    );
  }

  if (action === "confirm") {
    const { error: updateError } = await supabase
      .from("reservations")
      .update({ status: "confirmed" })
      .eq("id", reservation.id);

    if (updateError) {
      if (updateError.code === "23505") {
        return htmlResponse(
          "Weekend Already Booked",
          "Another reservation has already been confirmed for this weekend."
        );
      }
      console.error("Confirm error:", updateError);
      return htmlResponse("Error", "Something went wrong. Please try again.", 500);
    }

    return htmlResponse(
      "Reservation Confirmed",
      `${reservation.name}'s reservation for ${reservation.pickup_date} has been confirmed. That weekend is now blocked on the calendar.`
    );
  }

  // action === "decline"
  await supabase
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", reservation.id);

  return htmlResponse(
    "Reservation Declined",
    `${reservation.name}'s reservation for ${reservation.pickup_date} has been declined.`
  );
}
