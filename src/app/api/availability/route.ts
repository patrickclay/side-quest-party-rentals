import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/app/lib/supabase";

export async function GET() {
  const supabase = getSupabaseClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("reservations")
    .select("pickup_date")
    .eq("status", "confirmed")
    .gte("pickup_date", today);

  if (error) {
    console.error("Availability query error:", error);
    return NextResponse.json({ bookedDates: [] });
  }

  const bookedDates = data.map((r) => r.pickup_date);
  return NextResponse.json({ bookedDates });
}
