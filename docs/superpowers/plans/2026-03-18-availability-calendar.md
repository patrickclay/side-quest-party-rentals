# Availability Calendar Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Store reservations in Supabase, enable admin confirm/decline via email links, and block booked weekends in the date picker.

**Architecture:** Supabase Postgres table for reservations with a confirm token flow. Three API routes: modified `/api/reserve` (insert + email), new `/api/reserve/confirm` (status update), new `/api/availability` (public date query). ReserveForm fetches booked dates on mount and rejects them client-side.

**Tech Stack:** Next.js 16, Supabase JS client (`@supabase/supabase-js`), Resend (existing), Vitest (existing)

**Supabase Project:** `cefylybxqsawloviyebl` (sidequest-party-rentals, us-east-1)

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/lib/supabase.ts` | Create | Supabase client factory (anon + service role) |
| `src/app/lib/validation.ts` | Modify | Add past-date rejection to `validateReservation` |
| `src/app/lib/validation.test.ts` | Modify | Add test for past-date validation |
| `src/app/api/reserve/route.ts` | Modify | Insert to Supabase, add confirm/decline links to email |
| `src/app/api/reserve/confirm/route.ts` | Create | Handle confirm/decline GET requests from email |
| `src/app/api/availability/route.ts` | Create | Return booked Friday dates |
| `src/app/components/ReserveForm.tsx` | Modify | Fetch booked dates, reject booked weekends |

---

## Chunk 1: Database and Supabase Setup

### Task 1: Create Supabase migration for reservations table

**Files:**
- Migration applied via Supabase MCP

- [ ] **Step 1: Apply the reservations table migration**

Apply this SQL migration via the Supabase MCP `apply_migration` tool:

```sql
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  packages jsonb NOT NULL DEFAULT '{}',
  selected_games text[] NOT NULL DEFAULT '{}',
  lawn_game_count int NOT NULL DEFAULT 0,
  pickup_date date NOT NULL,
  total_price int NOT NULL DEFAULT 0,
  estimated_guests text,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  confirm_token text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX reservations_pickup_date_confirmed_unique
  ON reservations (pickup_date)
  WHERE status = 'confirmed';

CREATE INDEX reservations_status_pickup_date
  ON reservations (status, pickup_date);
```

- [ ] **Step 2: Verify table exists**

Use the Supabase MCP `list_tables` tool to confirm the `reservations` table was created.

- [ ] **Step 3: Enable Row-Level Security**

Apply this migration via Supabase MCP:

```sql
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts"
  ON reservations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to read availability"
  ON reservations FOR SELECT
  TO anon
  USING (status = 'confirmed');
```

Note: The SELECT policy only exposes confirmed reservations. The `/api/availability` route further filters to only return `pickup_date` values. Pending/cancelled reservations and all customer data are invisible to the anon key. The service role key bypasses RLS for server-side operations.

---

### Task 2: Install Supabase JS and create client helpers

**Files:**
- Create: `src/app/lib/supabase.ts`

- [ ] **Step 1: Install @supabase/supabase-js**

Run: `npm install @supabase/supabase-js`

- [ ] **Step 2: Create the Supabase client module**

Create `src/app/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}
```

- [ ] **Step 3: Add environment variables to `.env.local`**

Create `.env.local` (if it doesn't exist) with:

```
NEXT_PUBLIC_SUPABASE_URL=https://cefylybxqsawloviyebl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlZnlseWJ4cXNhd2xvdml5ZWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4Nzc5NjYsImV4cCI6MjA4OTQ1Mzk2Nn0.sj1nSMXT5A7jyK4RTfjgxCJ08uNP3kc9-8XoJp_xFaw
NEXT_PUBLIC_SITE_URL=https://sidequestpr.com
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase dashboard: Settings > API > service_role key>
```

Note: The service role key must be retrieved from the Supabase dashboard manually. It is never exposed via the MCP tools. Also add these env vars to Vercel project settings.

- [ ] **Step 4: Commit**

```bash
git add src/app/lib/supabase.ts package.json package-lock.json
git commit -m "feat: add Supabase client setup for reservations"
```

Do NOT commit `.env.local`.

---

## Chunk 2: Validation and API Routes

### Task 3: Add past-date validation

**Files:**
- Modify: `src/app/lib/validation.ts:40-44`
- Modify: `src/app/lib/validation.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `src/app/lib/validation.test.ts`:

```typescript
it("fails with a past pickup date", () => {
  const result = validateReservation({ ...validData, pickupDate: "2024-01-05" });
  expect(result.valid).toBe(false);
  expect(result.errors.pickupDate).toBeDefined();
});

it("fails with today's date as pickup date", () => {
  // Find next Friday from today (or today if Friday) to test boundary
  const today = new Date();
  const day = today.getUTCDay();
  const daysUntilFriday = day === 5 ? 0 : (5 - day + 7) % 7;
  if (daysUntilFriday === 0) {
    // Today is Friday — should be rejected (must be in the future)
    const todayStr = today.toISOString().split("T")[0];
    const result = validateReservation({ ...validData, pickupDate: todayStr, totalPrice: 60 });
    expect(result.valid).toBe(false);
    expect(result.errors.pickupDate).toContain("future");
  }
  // If today is not Friday, the Friday check catches it first — tested elsewhere
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/lib/validation.test.ts`
Expected: FAIL — past date currently passes validation.

- [ ] **Step 3: Add past-date check to validateReservation**

In `src/app/lib/validation.ts`, modify the pickupDate validation block (lines 40-44) to:

```typescript
if (!data.pickupDate) {
  errors.pickupDate = "Pickup date is required";
} else if (!isFriday(data.pickupDate)) {
  errors.pickupDate = "Pickup date must be a Friday";
} else {
  const pickup = new Date(data.pickupDate + "T00:00:00Z");
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (pickup <= today) {
    errors.pickupDate = "Pickup date must be in the future";
  }
}
```

- [ ] **Step 4: Run tests to verify all pass**

Run: `npx vitest run src/app/lib/validation.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/lib/validation.ts src/app/lib/validation.test.ts
git commit -m "feat: reject past pickup dates in validation"
```

---

### Task 4: Modify `/api/reserve` to use Supabase

**Files:**
- Modify: `src/app/api/reserve/route.ts`

- [ ] **Step 1: Rewrite the reserve route**

Replace `src/app/api/reserve/route.ts` with:

```typescript
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
      const notificationEmail = process.env.NOTIFICATION_EMAIL || "SideQuestPartyRentals@gmail.com";

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
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build`
Expected: Build succeeds (may warn about missing env vars locally, that's OK).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/reserve/route.ts
git commit -m "feat: save reservations to Supabase with confirm/decline tokens"
```

---

### Task 5: Create `/api/reserve/confirm` route

**Files:**
- Create: `src/app/api/reserve/confirm/route.ts`

- [ ] **Step 1: Create the confirm route**

Create `src/app/api/reserve/confirm/route.ts`:

```typescript
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
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/reserve/confirm/route.ts
git commit -m "feat: add confirm/decline endpoint for admin email links"
```

---

### Task 6: Create `/api/availability` route

**Files:**
- Create: `src/app/api/availability/route.ts`

- [ ] **Step 1: Create the availability route**

Create `src/app/api/availability/route.ts`:

```typescript
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
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/availability/route.ts
git commit -m "feat: add availability endpoint returning booked weekends"
```

---

## Chunk 3: Frontend Integration

### Task 7: Update ReserveForm to check availability

**Files:**
- Modify: `src/app/components/ReserveForm.tsx`

- [ ] **Step 1: Add booked dates state and fetch**

At the top of the `ReserveForm` component function (after existing state declarations around line 52), add:

```typescript
const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

useEffect(() => {
  fetch("/api/availability")
    .then((res) => res.json())
    .then((data) => setBookedDates(new Set(data.bookedDates)))
    .catch(() => {});
}, []);
```

- [ ] **Step 2: Update handleDateChange to check booked dates**

Modify the `handleDateChange` function to add a booked-date check. After the date is resolved to a Friday (either directly or via `getNextFriday`), add the check. Replace the entire `handleDateChange` function with:

```typescript
const handleDateChange = (value: string) => {
  if (!value) {
    setPickupDate("");
    setDateHelper("");
    return;
  }

  let resolvedDate = value;
  if (isFriday(value)) {
    setDateHelper("");
  } else {
    const nextFri = getNextFriday(new Date(value));
    resolvedDate = nextFri.toISOString().split("T")[0];
    setDateHelper(`Pickup adjusted to Friday: ${resolvedDate}`);
  }

  if (bookedDates.has(resolvedDate)) {
    setPickupDate("");
    setDateHelper("");
    setErrors((prev) => ({ ...prev, pickupDate: "That weekend is already booked" }));
    return;
  }

  setPickupDate(resolvedDate);
  setErrors((prev) => {
    const next = { ...prev };
    delete next.pickupDate;
    return next;
  });
};
```

- [ ] **Step 3: Verify build passes**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ReserveForm.tsx
git commit -m "feat: check availability and block booked weekends in date picker"
```

---

## Chunk 4: Environment and Deployment

### Task 8: Configure environment variables and deploy

- [ ] **Step 1: Add env vars to Vercel**

Add the following environment variables to the Vercel project (via dashboard or CLI):

- `NEXT_PUBLIC_SUPABASE_URL` = `https://cefylybxqsawloviyebl.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlZnlseWJ4cXNhd2xvdml5ZWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4Nzc5NjYsImV4cCI6MjA4OTQ1Mzk2Nn0.sj1nSMXT5A7jyK4RTfjgxCJ08uNP3kc9-8XoJp_xFaw`
- `NEXT_PUBLIC_SITE_URL` = `https://sidequestpr.com`
- `SUPABASE_SERVICE_ROLE_KEY` = (get from Supabase dashboard: Settings > API > service_role key)

- [ ] **Step 2: Run final build locally**

Run: `npx next build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Push to deploy**

```bash
git push
```

- [ ] **Step 4: Test the full flow**

1. Submit a reservation on the deployed site
2. Check email for confirm/decline links
3. Click Confirm — verify the HTML response shows success
4. Submit another reservation for the same weekend — verify it's rejected
5. Check the date picker on a fresh page load — verify the confirmed weekend shows an error when selected
