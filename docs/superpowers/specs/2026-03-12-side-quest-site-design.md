# Side Quest Party Rentals — Site Design Spec

> **This spec supersedes the build spec** (`plans/SIDE-QUEST-BUILD-SPEC.md`) for all visual, layout, and interaction decisions. The build spec remains a reference for content copy and deployment instructions. Where values differ (colors, sizes, weights, navbar behavior), this spec is authoritative.

## Overview

Single-page lead-generation website for Side Quest Party Rentals, a family-run DIY party equipment rental business in Lilburn, GA. Customers browse packages, pick a rental weekend, and submit a reservation request. Primary landing page for Facebook/Instagram ads and Google search.

This is a pickup rental business — customers drive to the owner's home, grab equipment on Friday, return Monday. Price points are $20–$60. The value proposition is simplicity and affordability.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Fonts | Google Fonts via `next/font` (Chakra Petch, DM Sans, Press Start 2P) |
| Icons | Inline SVGs (Lucide-style). No emojis anywhere in the UI. |
| Form handling | Server Action → Resend email notification |
| Email (reservations) | Resend (free tier) — owner notification + customer confirmation |
| Email (newsletter) | Resend Audiences — "Notify Me" signups go to a newsletter list |
| Analytics | Facebook Pixel + GA4 (placeholder scripts, activated later) |
| Hosting | Vercel (free tier), auto-deploy from GitHub |

## Design System

### Visual Identity

Playful adventure meets family fun. "Neighborhood game shop" energy — warm, inviting, colorful, with subtle RPG/gaming touches. Not dark/cyberpunk, not corporate, not minimalist.

**No emojis.** All icons are flat inline SVGs. Emojis look AI-generated.

### Color Palette

```css
:root {
  /* Brand */
  --navy: #1E2A4A;
  --royal-blue: #2B5EA7;
  --quest-gold: #F5A623;
  --quest-orange: #E8751A;
  --hero-red: #C0392B;
  --forest-green: #3DA34D;

  /* Neutrals — clean, not warm */
  --bg-white: #FFFFFF;
  --bg-light: #F6F7F9;
  --text-primary: #1A1D26;
  --text-secondary: #5A5F72;
  --text-muted: #8B90A0;
  --border-light: #E2E4EA;
}
```

**Usage rules:**
- Page background: `--bg-white` alternating with `--bg-light` for section contrast. Neutral and clean — the colorful content stands out by contrast.
- Primary CTAs: gold-to-orange gradient with navy text, shimmer animation
- Secondary CTAs: transparent with white/blue border
- Cards: white with subtle shadow (`0 4px 20px rgba(26,29,38,.07)`)
- Price callouts: gold-to-orange gradient text

### Typography

```typescript
import { Chakra_Petch, DM_Sans, Press_Start_2P } from 'next/font/google';

const heading = Chakra_Petch({ subsets: ['latin'], weight: ['600', '700', '800'] });
const body = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600'] });
const pixel = Press_Start_2P({ subsets: ['latin'], weight: ['400'] });
```

| Usage | Font | Size | Weight |
|-------|------|------|--------|
| Hero headline | Chakra Petch | 68px (responsive) | 800 |
| Section titles | Chakra Petch | 40px | 800 |
| Package name | Chakra Petch | 34px | 800 |
| Body text | DM Sans | 15–17px | 400 |
| Pixel labels | Press Start 2P | 9–10px | 400 |
| Price callouts | Chakra Petch | 48px | 800 |

### Spacing & Layout

- Max content width: 1060px, centered
- Section padding: 80px vertical desktop, 48px mobile
- Card border radius: 14–16px
- Button border radius: 12px
- Standard gap: 16px cards, 24px sections

### Animations

- Scroll reveal: sections fade-in and slide up 20px via Intersection Observer, children stagger 80ms
- CTA shimmer: white gradient sweep across primary buttons (3s loop)
- Hero confetti: small colored particles falling (CSS animation, 8 particles)
- Hero logo badge: gentle float/bounce (5s ease-in-out)
- MOST POPULAR badge: subtle pulsing glow
- Cards: lift 4–6px on hover with shadow increase
- Rainbow gradient bar: animated color slide on Lawn Games section top border
- FAQ chevrons: rotate on open

### Responsive Breakpoints

Tailwind defaults: mobile < 640px, tablet 640–1024px, desktop > 1024px.

## Page Sections

### 1. Navbar

Fixed position, navy background with backdrop blur, 68px height, z-50.

**Desktop:** Logo image (transparent background, 50px height) | nav links (Packages, How It Works, FAQ, Reviews) | phone number with phone icon | "Reserve Now" CTA button.

**Mobile:** Logo + hamburger. Dropdown with nav links, phone, and Reserve CTA on navy background.

All nav links smooth-scroll to section IDs.

### 2. Hero

Full viewport height. Full-bleed background image (kids-with-barriers photo) with dark gradient overlay sweeping left-to-right (93% opacity left, 15% right) for text legibility.

**Content (left-aligned, max 600px, white text on dark overlay):**
1. Pixel label: `// NOW SERVING GREATER ATLANTA` with gold line accent
2. Headline: "Level Up" (white) / "Your Party." (gold-to-orange gradient text)
3. Subheadline with bold highlights for "epic birthdays" and "$20"
4. Two CTAs: "Browse Packages" (primary gradient) + "Call or Text Us" (secondary glass)
5. Trust strip with flat SVG icons: Full Weekend Rental, Starting at $20, Cleaned & Sanitized, Lilburn GA

**Floating logo badge:** transparent logo, bottom-right, float animation, drop shadow.

**Confetti particles:** 8 small colored dots/squares falling with CSS animation. Subtle.

### 3. How It Works

Background: `--bg-light`. Centered header with pixel label `// THE QUEST LOG`.

4 step cards in horizontal flex (2x2 tablet, single column mobile). Each card: numbered gold circle, flat SVG icon (target, calendar, package, gift), title, description. Dashed gold connector line between cards on desktop. Cards lift on hover.

### 4. Nerf War Package

Background: `--bg-white`. Two-column layout (photo gallery left, details right).

**Photo gallery (grid layout):**
- Hero image spanning full width (blasters fanned out) with label overlay
- Row of 3 thumbnails below: barriers, package promo, safety glasses — each with label overlay and hover lift
- "More Photos" placeholder card (dashed border, image icon) — visual indicator for future expansion, not clickable. When real photos are added, replace this card with another thumbnail.
- Gallery is a CSS grid, easy to add more images later

**Details column:**
- Pixel label: `// FEATURED QUEST`
- "MOST POPULAR" badge (red gradient, pulsing glow)
- Package name: "Nerf War Party Package"
- Description paragraph
- Includes checklist (green check badges):
  - 25 Nerf blasters
  - 250 Nerf darts
  - 8 inflatable Nerf barriers
  - Electric air pump
  - Safety glasses included
  - Full weekend rental
- Price: $60 gradient text, "full weekend rental" subtitle, "$2.50/kid" math
- Full-width "Reserve Nerf War Package →" CTA (scrolls to form, pre-selects Nerf)

### 5. Giant Lawn Games

Background: `--bg-light` with animated rainbow gradient top border (4px).

**Game card grid** (4 columns desktop, 2 mobile). Each card: flat SVG icon, game name. Click toggles selected state (blue border, checkmark badge, tinted background). Max 4 selectable.

Games: Giant Connect 4, Axe Throwing, Kerplunk, Giant Jenga, Cornhole, Giant Yard Pong, Ladder Ball, Giant Tic Tac Toe.

**Bundle pricing strip** below grid. 4 tiers with per-game breakdown:
- 1 Game: $20 ($20/game)
- 2 Games: $35 ($17.50/game)
- 3 Games: $50 ($16.67/game) — POPULAR, gold border
- 4 Games: $60 ($15/game) — BEST VALUE, gold gradient bg, scaled up 5%

Pricing tier auto-highlights based on selected game count.

**CTA:** "Reserve [N] Lawn Games →" (dynamic count). Scrolls to form, pre-selects lawn games.

### 6. Coming Soon

Full-bleed background image (Nerf darts photo) with dark navy overlay (88% opacity) + backdrop blur + grid line pattern.

**Content:**
- Pixel label: `// LOADING NEW QUESTS...`
- Title: "More Packages Coming Soon"
- Email capture (input + "Notify Me" button) — subscribes to Resend Audiences newsletter
- Three "Locked Quest" cards:
  - Each has a themed silhouette icon behind frosted glass (water droplet, film reel, globe)
  - Color-coded subtle glow (blue, gold, green)
  - Padlock icon + "LOCKED" label
  - Teaser hint text: "Splash Zone?", "Movie Night?", "Field Day?"
  - Hover brightens border with gold
  - Gaming "locked level" metaphor ties into RPG brand

### 7. Reviews

Background: `--bg-white`. 3 testimonial cards in flex row.

Each card: 5 gold SVG stars, italic quote text, author name, location. Large decorative opening-quote watermark (10% opacity gold). Cards lift on hover.

Placeholder testimonials (marked clearly). Footer note about replacing with real reviews.

### 8. FAQ

Background: `--bg-light`. Accordion with all 9 FAQ items from the build spec.

Questions: How does the rental period work? | Where do I pick up and return? | What if something breaks or gets damaged? | Do you deliver? | How far in advance should I book? | What's included in each package? | Can I combine packages? | What's your service area? | What's your cancellation policy?

Each item: Chakra Petch question, chevron that rotates on open, DM Sans answer. One open at a time. Smooth height transition. First item open by default.

### 9. Reserve Form

Background: `--bg-white`. Container card with gold left accent stripe (5px gradient), subtle shadow.

**Fields (2-column grid desktop, single column mobile):**
- Name, Email, Phone, City (text inputs)
- Package selection (visual card picker — Nerf War / Lawn Games, both selectable)
- Lawn game sub-selection (mini game card grid, appears when lawn games selected)
- Pickup date (date input, validates Friday, snaps to nearest Friday)
- Estimated guests (dropdown: 1–10, 11–20, 21–30, 30+)
- Notes textarea

**Live total display** above submit button showing selected packages, calculated price, and weekend dates.

**Submit button:** full-width, gold gradient, shimmer animation, send icon.

**On submit:** POST to `/api/reserve`, loading state, success message with confirmation details, or inline error.

### 10. Footer

Navy-to-darker gradient background with rainbow gradient top border (3px).

4-column grid: Brand (transparent logo + tagline), Contact (phone, email, address, hours), Quick Links (scroll anchors), Follow Us (social links).

Bottom bar: copyright, privacy/terms links.

### 11. Mobile Sticky Bar

Fixed bottom, visible < 768px. Two buttons: "Call" (blue, 40%) + "Reserve Now" (gold gradient, 60%). Backdrop blur, z-50. Footer gets extra bottom padding to compensate.

## Project Structure

```
side-quest-party-rentals/
├── public/
│   ├── images/              # Optimized product photos (WebP)
│   ├── logo.png             # Transparent logo
│   └── og-image.png         # Open Graph share image (1200x630)
├── src/
│   └── app/
│       ├── layout.tsx        # Root layout, fonts, meta, analytics scripts
│       ├── page.tsx          # Main landing page (all sections)
│       ├── globals.css       # Tailwind base + CSS variables + animations
│       ├── api/
│       │   ├── reserve/
│       │   │   └── route.ts  # POST: reservation → email notification
│       │   └── subscribe/
│       │       └── route.ts  # POST: email → Resend Audiences
│       └── components/
│           ├── Navbar.tsx
│           ├── Hero.tsx
│           ├── HowItWorks.tsx
│           ├── NerfPackage.tsx
│           ├── PhotoGallery.tsx    # Reusable photo grid for packages
│           ├── LawnGames.tsx
│           ├── GameCard.tsx        # Interactive selectable game card
│           ├── ComingSoon.tsx
│           ├── Reviews.tsx
│           ├── FAQ.tsx
│           ├── ReserveForm.tsx
│           ├── Footer.tsx
│           ├── MobileStickyBar.tsx
│           └── ui/
│               ├── SectionLabel.tsx  # Pixel-font section label
│               ├── SectionTitle.tsx
│               ├── Button.tsx        # Primary/secondary button variants
│               └── Icons.tsx         # All inline SVG icon components
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── .env.local.example
└── .gitignore
```

## API Routes

### POST /api/reserve

**Request body:**

```typescript
interface ReservationRequest {
  name: string;
  email: string;
  phone: string;
  city: string;
  packages: {
    nerfWar: boolean;
    lawnGames: boolean;
  };
  selectedGames: string[];     // IDs of selected lawn games
  lawnGameCount: number;       // 1-4, determines pricing tier
  pickupDate: string;          // ISO date string (must be a Friday)
  estimatedGuests: string;     // "1-10" | "11-20" | "21-30" | "30+"
  message: string;
  totalPrice: number;          // Calculated client-side, verified server-side
}
```

**Response:** `{ success: boolean; error?: string }`

**Logic:**
1. Validate required fields (name, email, phone, city, at least one package, pickupDate)
2. Validate email format
3. Verify pickup date is a Friday
4. Recalculate total price server-side (prevent manipulation)
5. Send owner notification email via Resend with full reservation details
6. Send customer confirmation email via Resend
7. Falls back to console.log if Resend not configured

**Form UX states:**
- **Validation errors:** Inline red text below each invalid field. Fields: required check, email format, Friday date check.
- **Non-Friday date:** Helper text: "Pickup is on Fridays — we've adjusted to the nearest Friday." Auto-snap to nearest Friday.
- **Loading:** Button text changes to "Submitting..." with disabled state.
- **Success:** Form replaced with: "Reservation Submitted! We'll confirm your reservation within a few hours. Keep an eye on your email and phone for our confirmation with pickup details. Questions? Call or text us at (770) 555-0199"
- **Error:** Inline error message above submit button. Form data preserved.
- **Max games:** If user tries to select a 5th game, card does not toggle and a brief message appears: "Max 4 games per rental weekend."

### POST /api/subscribe

**Request body:** `{ email: string }`

**Response:** `{ success: boolean; error?: string }`

Adds contact to Resend Audiences (newsletter list via `RESEND_AUDIENCE_ID`). On success, replace form with: "You're on the list! We'll notify you when new packages drop."

## Pricing Logic

```typescript
const PRICING = {
  nerfWar: 60,
  lawnGames: { 1: 20, 2: 35, 3: 50, 4: 60 },
} as const;
```

Max 4 lawn games selectable.

## Assets

- Logo: `Side Quest party rentals logo design.png` — needs white background removed (transparent PNG)
- Product photos in `images/` directory: Nerf blasters, barriers, safety glasses, electric pump, packed bins, promotional graphics
- All photos should be optimized (WebP conversion, responsive srcset) during build

## SEO & Meta

Title: "Side Quest Party Rentals | DIY Party Rentals in Lilburn & Greater Atlanta"
Description focused on Lilburn GA, affordable, Nerf, lawn games, weekend rental.
Open Graph image: 1200x630.

## Environment Variables

```
RESEND_API_KEY=
NOTIFICATION_EMAIL=owner@sidequestpartyrentals.com
RESEND_AUDIENCE_ID=          # For newsletter signups
# NEXT_PUBLIC_FB_PIXEL_ID=
# NEXT_PUBLIC_GA_ID=
```

## Key Design Decisions

1. **No emojis** — flat SVG icons throughout. Emojis look AI-generated.
2. **Clean neutral backgrounds** — white and light gray, not warm cream/tan. Brand colors pop by contrast.
3. **Interactive game selection** (Option A) — users click game cards with live pricing updates that carry into the reserve form.
4. **Photo gallery grid** for Nerf package — scalable for adding more images later, with a "More Photos" placeholder.
5. **Locked Quest cards** for Coming Soon — RPG-themed mystery cards instead of plain placeholders.
6. **Resend Audiences** for newsletter — Coming Soon signups go to a managed newsletter list, not just a log.
7. **Next.js 15** — latest stable, not 14 as in original spec.
8. **Safety glasses added** to Nerf package includes list — confirmed from product photos.
9. **Transparent logo** — white background removed so it works on any surface.
