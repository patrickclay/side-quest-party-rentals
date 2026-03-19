# Availability Calendar Design

## Problem

Side Quest Party Rentals has one set of each package (Nerf War, Lawn Games). When a weekend is booked, it should show as unavailable to other customers. Currently reservations only send emails with no persistence or availability tracking. The admin (Patrick) wants minimal manual intervention.

## Solution

Store reservations in Supabase. Admin confirms or declines via one-click links in notification emails. Confirmed reservations block that weekend's Friday from the date picker in the reserve form.

## Business Rules

- **Any confirmed reservation blocks the entire weekend**, regardless of which packages were booked. One customer per weekend.
- **Pending reservations do not block availability.** Multiple customers can submit requests for the same weekend; the admin confirms only one.
- **Pickup date must be a future Friday**, at least 1 day from today. Past dates are rejected.
- **Price is stored as whole US dollars** (e.g., 60 = $60.00).

## Data Layer

### Supabase `reservations` table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK, default gen_random_uuid()) | |
| name | text | Customer name |
| email | text | Customer email |
| phone | text | Customer phone |
| city | text | Customer city |
| packages | jsonb | `{ "nerfWar": bool, "lawnGames": bool }` |
| selected_games | text[] | Array of game IDs |
| lawn_game_count | int | Number of lawn games selected |
| pickup_date | date | Friday pickup date |
| total_price | int | Whole US dollars (e.g., 60 = $60.00) |
| estimated_guests | text | Guest count range |
| message | text | Optional notes |
| status | text | `pending`, `confirmed`, or `cancelled` |
| confirm_token | text (unique) | Random token for email confirm/decline links |
| created_at | timestamptz (default now()) | |

### Indexes

Partial unique index to prevent double-booking at the database level:

```sql
CREATE UNIQUE INDEX reservations_pickup_date_confirmed_unique
  ON reservations (pickup_date)
  WHERE status = 'confirmed';
```

This ensures only one confirmed reservation can exist per pickup date. The `/api/reserve/confirm` route catches the unique constraint violation and returns "that weekend is already booked."

### Row-Level Security

- Public (anon key): INSERT (for form submissions via `/api/reserve`)
- Public (anon key): SELECT on `pickup_date` and `status` only (for `/api/availability`)
- Service role key: full access (for `/api/reserve/confirm` updates)

### Supabase Client Usage

| Route | Client | Why |
|-------|--------|-----|
| `/api/reserve` (insert) | Service role | Needs to insert and query without RLS restrictions |
| `/api/reserve/confirm` | Service role | Needs to update status |
| `/api/availability` | Anon (client-side fetch) | Public read of dates only |

## State Transitions

Allowed status transitions for reservations:

| From | To | Trigger |
|------|------|---------|
| `pending` | `confirmed` | Admin clicks Confirm link |
| `pending` | `cancelled` | Admin clicks Decline link |
| `confirmed` | `cancelled` | Admin changes status in Supabase dashboard |
| `cancelled` | (none) | Terminal state, cannot be re-confirmed |

If admin clicks a link for an already-processed reservation (not `pending`), show a message: "This reservation has already been processed."

## API Routes

### POST `/api/reserve` (modified)

Current behavior: validates and sends emails via Resend.

New behavior:
1. Validate the reservation data (unchanged, plus reject past dates)
2. Check Supabase for existing confirmed reservation on the same `pickup_date` — reject if booked
3. Generate a random `confirm_token` (crypto.randomUUID)
4. Insert reservation into Supabase with status `pending`
5. Send notification email to admin with **Confirm** and **Decline** links:
   - `{SITE_URL}/api/reserve/confirm?token={token}&action=confirm`
   - `{SITE_URL}/api/reserve/confirm?token={token}&action=decline`
6. Send confirmation email to customer (unchanged, still says "we'll confirm within 24 hours")

Uses **service role** Supabase client.

### GET `/api/reserve/confirm`

New route. Handles the admin clicking Confirm or Decline from the email.

Query params: `token`, `action` (confirm or decline)

1. Look up reservation by `confirm_token`
2. If not found: show "Reservation not found"
3. If status is not `pending`: show "This reservation has already been processed"
4. If `action=confirm`: set `status` to `confirmed`. If unique constraint violation (another reservation already confirmed for that date), show "That weekend is already booked by another reservation"
5. If `action=decline`: set `status` to `cancelled`
6. Response is a simple HTML page (not JSON) since it opens in a browser from the email

Uses **service role** Supabase client.

### GET `/api/availability`

New route. Returns booked Fridays for the date picker.

1. Query Supabase for all `confirmed` reservations where `pickup_date >= today`
2. Return JSON array of date strings: `{ "bookedDates": ["2026-03-20", "2026-04-03"] }`
3. No auth required — this is public but only exposes dates, no customer data

Can be called from the **client side** (browser fetch) with no Supabase client needed — it's a simple Next.js API route.

## Frontend Changes

### ReserveForm component

1. On mount, fetch `/api/availability` to get booked dates
2. In the date input's `onChange` handler, check if the selected/adjusted Friday is in the booked list
3. If booked: show an error message ("That weekend is already booked"), clear the date
4. Server-side validation in `/api/reserve` also rejects booked dates (defense in depth)

### Date picker UX

The HTML date input can't natively disable specific dates. Decision: let the user pick any date, then show an error if it's booked. This is simpler, matches the existing form style, and the error feedback is immediate. A custom calendar component can replace this later.

## Email Changes

### Admin notification email

Add two links at the top of the email body:

```
CONFIRM this reservation: {confirmUrl}
DECLINE this reservation: {declineUrl}
```

Rest of the email stays the same.

### Customer email

No changes. Still says "we'll confirm within 24 hours."

## Environment Variables

New:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — For server-side operations (confirm/decline, insert)
- `NEXT_PUBLIC_SITE_URL` — Base URL for building confirm/decline links (e.g., `https://sidequestpr.com`)

## Future Considerations (not in scope)

- Admin dashboard page for managing reservations
- Multiple inventory per package (quantity tracking)
- Per-package availability (Nerf and Lawn Games booked independently)
- Automated customer confirmation email when admin confirms
- Payment integration
