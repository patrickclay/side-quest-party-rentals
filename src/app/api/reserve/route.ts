import { NextRequest, NextResponse } from "next/server";
import { validateReservation, ReservationData } from "@/app/lib/validation";
import { formatWeekend, PRICING } from "@/app/lib/pricing";
import { getSupabaseAdmin } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const data: ReservationData = await request.json();
    const { valid, errors } = validateReservation(data);

    if (!valid) {
      return NextResponse.json({ success: false, error: "Validation failed", errors }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Check if weekend is already booked
    const { data: existing, error: checkError } = await supabase
      .from("reservations")
      .select("id")
      .eq("pickup_date", data.pickupDate)
      .eq("status", "confirmed")
      .maybeSingle();

    if (checkError) {
      console.error("Availability check error:", checkError);
      return NextResponse.json({ success: false, error: "Failed to check availability" }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        { success: false, error: "That weekend is already booked", errors: { pickupDate: "That weekend is already booked" } },
        { status: 409 }
      );
    }

    // Generate confirm token and insert reservation
    const confirmToken = crypto.randomUUID();

    const { error: insertError } = await supabase.from("reservations").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      packages: data.packages,
      selected_games: data.selectedGames,
      lawn_game_count: data.lawnGameCount,
      pickup_date: data.pickupDate,
      total_price: data.totalPrice,
      estimated_guests: data.estimatedGuests || null,
      message: data.message || null,
      status: "pending",
      confirm_token: confirmToken,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ success: false, error: "Failed to save reservation" }, { status: 500 });
    }

    // Build confirm/decline URLs
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const confirmUrl = `${siteUrl}/api/reserve/confirm?token=${confirmToken}&action=confirm`;
    const declineUrl = `${siteUrl}/api/reserve/confirm?token=${confirmToken}&action=decline`;

    const weekend = formatWeekend(data.pickupDate);
    const gamesList = data.selectedGames.length > 0 ? data.selectedGames.join(", ") : "None";
    const packageNames = [
      data.packages.nerfWar && `Nerf War Package ($${PRICING.nerfWar})`,
      data.packages.lawnGames && `${data.lawnGameCount} Lawn Games ($${data.totalPrice - (data.packages.nerfWar ? PRICING.nerfWar : 0)})`,
    ].filter(Boolean).join(" + ");

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const notificationEmail = process.env.NOTIFICATION_EMAIL || "ambs0976@gmail.com";

      await resend.emails.send({
        from: "Side Quest Reservations <reservations@sidequestpr.com>",
        to: notificationEmail,
        subject: `New Reservation: ${packageNames} — ${data.pickupDate}`,
        text: `New reservation from ${data.name}!\n\nCONFIRM this reservation:\n${confirmUrl}\n\nDECLINE this reservation:\n${declineUrl}\n\n---\n\nPackage(s): ${packageNames}\nGames: ${gamesList}\nTotal: $${data.totalPrice}\n\nWeekend: ${weekend}\nGuests: ${data.estimatedGuests || "Not specified"}\n\nCustomer Info:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCity: ${data.city}\n\nNotes: ${data.message || "None"}`,
      });

      await resend.emails.send({
        from: "Side Quest Party Rentals <reservations@sidequestpr.com>",
        to: data.email,
        subject: "Your Side Quest Reservation Request",
        text: `Hey ${data.name}!\n\nThanks for your reservation request. Here's what we have:\n\nPackage(s): ${packageNames}\n${data.selectedGames.length > 0 ? `Games: ${gamesList}\n` : ""}Total: $${data.totalPrice}\nWeekend: ${weekend}\n\nWe'll confirm your reservation within 24 hours. If you have questions, call or text us at (404) 395-6339.\n\n— Side Quest Party Rentals`,
      });
    } else {
      console.log("RESERVATION (Resend not configured):", JSON.stringify(data, null, 2));
      console.log("Confirm URL:", confirmUrl);
      console.log("Decline URL:", declineUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
