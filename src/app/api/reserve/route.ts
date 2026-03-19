import { NextRequest, NextResponse } from "next/server";
import { validateReservation, ReservationData } from "@/app/lib/validation";
import { formatWeekend, PRICING } from "@/app/lib/pricing";

export async function POST(request: NextRequest) {
  try {
    const data: ReservationData = await request.json();
    const { valid, errors } = validateReservation(data);

    if (!valid) {
      return NextResponse.json({ success: false, error: "Validation failed", errors }, { status: 400 });
    }

    const weekend = formatWeekend(data.pickupDate);
    const gamesList = data.selectedGames.length > 0 ? data.selectedGames.join(", ") : "None";
    const packageNames = [
      data.packages.nerfWar && `Nerf War Package ($${PRICING.nerfWar})`,
      data.packages.lawnGames && `${data.lawnGameCount} Lawn Games ($${data.totalPrice - (data.packages.nerfWar ? PRICING.nerfWar : 0)})`,
    ].filter(Boolean).join(" + ");

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const notificationEmail = process.env.NOTIFICATION_EMAIL || "SideQuestPartyRentals@gmail.com";

      await resend.emails.send({
        from: "Side Quest Reservations <reservations@sidequestpr.com>",
        to: notificationEmail,
        subject: `New Reservation: ${packageNames} — ${data.pickupDate}`,
        text: `New reservation from ${data.name}!\n\nPackage(s): ${packageNames}\nGames: ${gamesList}\nTotal: $${data.totalPrice}\n\nWeekend: ${weekend}\nGuests: ${data.estimatedGuests || "Not specified"}\n\nCustomer Info:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCity: ${data.city}\n\nNotes: ${data.message || "None"}`,
      });

      await resend.emails.send({
        from: "Side Quest Party Rentals <reservations@sidequestpr.com>",
        to: data.email,
        subject: "Your Side Quest Reservation Request",
        text: `Hey ${data.name}!\n\nThanks for your reservation request. Here's what we have:\n\nPackage(s): ${packageNames}\n${data.selectedGames.length > 0 ? `Games: ${gamesList}\n` : ""}Total: $${data.totalPrice}\nWeekend: ${weekend}\n\nWe'll confirm your reservation within a few hours. If you have questions, call or text us at (770) 555-0199.\n\n— Side Quest Party Rentals`,
      });
    } else {
      console.log("RESERVATION (Resend not configured):", JSON.stringify(data, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
