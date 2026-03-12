# Side Quest Party Rentals — Build Specification

## Project Overview

**What this is:** A single-page lead-generation website for Side Quest Party Rentals, a family-run DIY party equipment rental business in Lilburn, GA. Customers browse packages, pick a rental weekend, and submit a reservation request. The site is the primary landing page for Facebook/Instagram ads and Google search.

**What this is NOT:** This is not a full-service party company with delivery/setup. This is a pickup rental business. Customers drive to the owner's home, grab the equipment on Friday, and return it Monday. Price points are $20–$60. The entire value proposition is simplicity and affordability.

**Deployment:** Next.js app deployed to Vercel via GitHub commit-to-deploy. Single repo, single branch (main), automatic deployments on push.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14+ (App Router) | Vercel-native, SSR/SSG for SEO, easy deployment |
| Styling | Tailwind CSS | Fast utility styling, responsive out of box |
| Fonts | Google Fonts (see Design section) | Free, fast via `next/font` |
| Form handling | Server Action or API route → email notification | No database needed at launch |
| Email notifications | Resend (free tier: 100 emails/day) or Nodemailer with Gmail SMTP | Owner gets email on each reservation |
| Analytics | Facebook Pixel + Google Analytics 4 | Track ad conversions |
| Hosting | Vercel (free tier) | Auto-deploy from GitHub |
| Domain | Configured in Vercel dashboard | Point DNS after purchase |

### Project Structure

```
side-quest-party-rentals/
├── public/
│   ├── logo.png                    # Side Quest shield logo (provided)
│   ├── og-image.png                # Open Graph share image (1200x630)
│   └── images/
│       ├── nerf-package.jpg        # Placeholder - replace with real photo
│       └── lawn-games.jpg          # Placeholder - replace with real photo
├── src/
│   └── app/
│       ├── layout.tsx              # Root layout, fonts, meta, analytics scripts
│       ├── page.tsx                # Main landing page (all sections)
│       ├── globals.css             # Tailwind base + custom CSS variables + animations
│       ├── api/
│       │   └── reserve/
│       │       └── route.ts        # POST endpoint: receives reservation, sends email
│       └── components/
│           ├── Navbar.tsx           # Sticky nav with logo, links, CTA, mobile menu
│           ├── Hero.tsx             # Hero section with headline, CTAs, trust strip
│           ├── HowItWorks.tsx       # 4-step visual process explanation
│           ├── NerfPackage.tsx      # Nerf War package detail section
│           ├── LawnGames.tsx        # Lawn games grid with bundle pricing
│           ├── ComingSoon.tsx       # Teaser for future packages + email capture
│           ├── Reviews.tsx          # Testimonial cards (placeholder content)
│           ├── FAQ.tsx              # Accordion-style FAQ
│           ├── ReserveForm.tsx      # Reservation form with package & weekend picker
│           ├── Footer.tsx           # Contact, hours, service area, social links
│           ├── MobileStickyBar.tsx  # Fixed bottom bar on mobile (Call + Reserve)
│           └── ui/
│               ├── SectionLabel.tsx # Pixel-font section label component
│               ├── SectionTitle.tsx # Heading component
│               └── GameCard.tsx     # Individual lawn game selection card
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
├── .env.local.example              # Template for environment variables
├── .gitignore
├── vercel.json                     # Vercel config (if needed)
└── README.md
```

---

## Design System

### Visual Identity

The logo (provided as `Side_Quest_party_rentals_logo_design.png`) establishes the aesthetic direction: a **colorful RPG adventure shield crest** with a sword, Nerf blaster, treasure chest, balloons, and a wooden "Party Rentals" banner. The vibe is warm, cartoonish, family-friendly adventure — like a tabletop game box cover or a family-friendly video game logo.

**Aesthetic direction:** Playful adventure meets family fun. Think "neighborhood game shop" — warm, inviting, colorful, with subtle RPG/gaming touches. NOT dark/cyberpunk, NOT corporate, NOT minimalist.

### Color Palette

Extracted from the logo and extended for the full site:

```css
:root {
  /* Primary */
  --navy: #1E2A4A;           /* Deep navy from shield background — primary text, nav, dark sections */
  --royal-blue: #2B5EA7;     /* Blue from shield quadrant — buttons, links, accents */
  
  /* Accent */
  --quest-gold: #F5A623;     /* Golden yellow from "Side Quest" text — highlights, badges, CTAs */
  --quest-orange: #E8751A;   /* Orange from Nerf blaster / details — hover states, urgency */
  --hero-red: #C0392B;       /* Red from shield quadrant — alerts, sale tags */
  
  /* Supporting */
  --forest-green: #4CAF50;   /* Green from balloons — success states, "available" indicators */
  --wood-brown: #8B6914;     /* Brown from banner — borders, rustic accents */
  
  /* Neutrals */
  --cream: #FFF8F0;          /* Warm off-white — page background */
  --light-tan: #F5EDE0;      /* Light tan — card backgrounds, alternating sections */
  --warm-gray: #6B6157;      /* Warm gray — body text */
  --dark-text: #2C2416;      /* Near-black brown — headings */
}
```

**Usage rules:**
- Page background: `--cream` with alternating `--light-tan` for section contrast
- Primary CTAs: `--quest-gold` background with `--navy` text (high contrast, matches logo energy)
- Secondary CTAs: `--royal-blue` background with white text
- Section headings: `--navy`
- Body text: `--warm-gray`
- Price callouts: `--quest-gold` or `--quest-orange`
- Cards/containers: White with subtle warm shadow (`0 2px 12px rgba(43, 36, 22, 0.08)`)

### Typography

Use `next/font/google` for optimized loading:

```typescript
import { Chakra_Petch, DM_Sans, Press_Start_2P } from 'next/font/google';

// Display / Headings — bold, techy-adventure feel
const heading = Chakra_Petch({ subsets: ['latin'], weight: ['600', '700'] });

// Body — clean, readable, friendly
const body = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600'] });

// Pixel accent — used SPARINGLY for section labels, badges, game-UI touches
const pixel = Press_Start_2P({ subsets: ['latin'], weight: ['400'] });
```

**Typography scale:**
- Hero headline: 48–64px Chakra Petch 700
- Section titles: 32–40px Chakra Petch 700
- Subsection titles: 22–26px Chakra Petch 600
- Body text: 16–17px DM Sans 400
- Small labels / pixel accents: 10–12px Press Start 2P 400
- Price callouts: 28–36px Chakra Petch 700

### Spacing & Layout

- Max content width: 1100px, centered
- Section padding: 80px vertical on desktop, 48px on mobile
- Card border radius: 12px
- Button border radius: 10px
- Standard gap: 16px (cards), 24px (sections), 8px (inline elements)

### Animations

Keep animations subtle and family-friendly. No heavy particle effects.

- **Scroll reveal:** Sections fade-in and slide up slightly (20px) on scroll via Intersection Observer. Stagger children by 80ms.
- **Hover states:** Cards lift 4px with shadow increase. Buttons translate -2px with enhanced shadow.
- **Hero:** Gentle floating animation on decorative elements (stars, confetti SVGs).
- **Price badges:** Subtle pulse animation on "BEST VALUE" or "MOST POPULAR" tags.

### Responsive Breakpoints

Follow Tailwind defaults:
- Mobile: < 640px (single column, stacked layout)
- Tablet: 640–1024px (2-column grids)
- Desktop: > 1024px (full layout)

---

## Page Sections — Detailed Specifications

### 1. Navbar (`Navbar.tsx`)

**Behavior:**
- Fixed position, transparent on load, solid `--navy` background with backdrop blur on scroll (detect scroll > 40px)
- Height: 64px
- Z-index: 50

**Desktop layout (left to right):**
- Logo image (40px height, auto width) + "Side Quest" text in Chakra Petch 600
- Nav links: "Packages" | "How It Works" | "FAQ" | "Reviews" — DM Sans 14px 500, `--warm-gray`, hover → `--navy`
- Click-to-call link: phone icon + "(770) 555-0199" in Chakra Petch 600, `--quest-gold`
- CTA button: "Reserve Now" — `--quest-gold` bg, `--navy` text, Chakra Petch 700

**Mobile layout:**
- Logo + hamburger icon
- Hamburger opens full-width dropdown with nav links, phone number, and Reserve CTA
- Dropdown has `--navy` background

**Scroll links:** Each nav link smooth-scrolls to the corresponding section ID.

---

### 2. Hero (`Hero.tsx`)

**Layout:** Full viewport height (100vh minus navbar), flex centered content, warm gradient background.

**Background:** Subtle radial gradient from `--cream` center to `--light-tan` edges. Optional: small decorative SVG elements (stars, confetti dots, a tiny sword icon) floating gently with CSS animation. Keep these VERY subtle — 10-15% opacity.

**Content (left-aligned, max-width 600px):**

1. **Pixel label** (Press Start 2P, 10px, `--quest-gold`): `// NOW SERVING GREATER ATLANTA`
2. **Headline** (Chakra Petch 700, 48-64px responsive):
   ```
   Level Up
   Your Party.
   ```
   "Level Up" in `--navy`, "Your Party." in gradient (`--quest-gold` → `--quest-orange`)
3. **Subheadline** (DM Sans 400, 17px, `--warm-gray`, max-width 500px):
   ```
   DIY party rental packages for epic birthdays, backyard bashes, and family 
   celebrations. Pick up Friday, party all weekend, return Monday. 
   Starting at just $20.
   ```
4. **CTAs** (flex row, gap 12px):
   - Primary: "🎯 Browse Packages" — `--quest-gold` bg, `--navy` text, Chakra Petch 700, 16px, padding 16px 32px, rounded-[10px], shadow
   - Secondary: "📞 Call or Text Us" — transparent bg, 2px `--royal-blue` border, `--royal-blue` text, same sizing. This is an `<a href="tel:...">` tag.
5. **Trust strip** (flex row, gap 20px, margin-top 40px):
   - "🎮 Full Weekend Rental" 
   - "💰 Starting at $20" 
   - "✨ Cleaned & Sanitized" 
   - "📍 Lilburn, GA"
   - Each: DM Sans 13px 500, `--warm-gray`, flex with icon

---

### 3. How It Works (`HowItWorks.tsx`)

**Background:** `--light-tan`

**Content:**
- Section label (pixel): `// THE QUEST LOG`
- Section title: "How It Works"
- Subtitle (DM Sans 15px, `--warm-gray`): "Four simple steps from booking to party time. No delivery fees. No setup crew needed. Just grab and go."

**4 step cards** in a horizontal flex row (stacks to 2x2 on tablet, single column on mobile):

Each card:
- Number badge: Circle with `--quest-gold` bg, `--navy` text, Chakra Petch 700, 20px
- Icon (emoji, 32px): Step 1: 🎯, Step 2: 📅, Step 3: 🚗, Step 4: 🎉
- Title (Chakra Petch 600, 18px, `--navy`)
- Description (DM Sans 400, 14px, `--warm-gray`)

| Step | Title | Description |
|------|-------|-------------|
| 1 | Pick Your Package | Browse our party rental packages below and choose your adventure. Nerf wars, giant lawn games, or bundle them together. |
| 2 | Choose Your Weekend | Select your rental weekend. Pick up Friday, return Monday. That's 3 full days of fun. |
| 3 | Pick Up & Party | Swing by our Lilburn location to grab your gear. Everything's cleaned, packed, and ready to go. |
| 4 | Return & Done | Drop everything back Monday. We handle the cleanup. You just keep the memories. |

**Connector lines:** On desktop, thin dashed lines or arrows connecting the step cards horizontally. CSS-only using `border-top: 2px dashed` on a pseudo-element. Hide on mobile.

---

### 4. Nerf War Package (`NerfPackage.tsx`)

**Background:** White / `--cream`

**Layout:** Two-column on desktop (image left, details right). Stacks on mobile.

**Left column (image):**
- Placeholder image container (aspect ratio 4:3, rounded-xl, `--light-tan` background)
- Placeholder text: "📸 Photo coming soon" centered in the container
- When real photo is added, it fills this container with `object-cover`

**Right column (details):**

- Section label (pixel): `// FEATURED QUEST`
- Package name (Chakra Petch 700, 32px, `--navy`): "Nerf War Party Package"
- Tag (inline badge): "🔥 MOST POPULAR" — `--hero-red` bg, white text, pixel font 8px, rounded, padding 4px 10px
- Description (DM Sans 16px, `--warm-gray`, line-height 1.7):
  ```
  Everything you need for an epic backyard Nerf battle. 25 blasters, 250 darts, 
  inflatable barriers, and an electric air pump — all packed and ready to go. 
  Perfect for birthday parties, family gatherings, or just a weekend of fun.
  ```
- **What's included** (grid or list with checkmark icons):
  - ✅ 25 Nerf blasters
  - ✅ 250 Nerf darts
  - ✅ 8 inflatable Nerf barriers
  - ✅ Electric air pump
  - ✅ Full weekend rental (Friday pickup – Monday return)

- **Price block:**
  - Price: "$60" in Chakra Petch 700, 40px, `--quest-gold`
  - Subtext: "full weekend rental" in DM Sans 14px, `--warm-gray`
  - Per-person math: "That's less than $2.50/kid for a party of 25" in DM Sans 13px italic, `--warm-gray`

- **CTA button:** "Reserve Nerf War Package →" — `--quest-gold` bg, `--navy` text, full width on mobile, Chakra Petch 700. Clicking this scrolls to the Reserve Form and pre-selects the Nerf War package.

---

### 5. Giant Lawn Games (`LawnGames.tsx`)

**Background:** `--light-tan`

**Content:**
- Section label (pixel): `// SIDE QUESTS`
- Title: "Giant Lawn Games"
- Subtitle: "Add giant-sized fun to any party, BBQ, or backyard hangout. Mix and match your favorites."

**Game selection grid** (4 columns desktop, 2 columns tablet, 2 columns mobile):

Each game card (`GameCard.tsx`):
- Container: White bg, rounded-xl, subtle shadow, padding 20px, cursor pointer
- Emoji icon (48px centered): Game-specific
- Name (Chakra Petch 600, 15px, `--navy`, centered)
- Selectable: Click toggles a selected state (blue border, checkmark overlay, light blue background tint)
- Games list with emoji:
  1. 🔴🟡 Giant Connect 4
  2. 🪓 Axe Throwing
  3. 🟢 Kerplunk
  4. 🧱 Giant Jenga
  5. 🌽 Cornhole
  6. 🏓 Giant Yard Pong
  7. 🪜 Ladder Ball
  8. ❌⭕ Giant Tic Tac Toe

**Bundle pricing display** (below the grid):

Styled as a horizontal strip or card row showing the pricing tiers. Highlight the best-value tier.

| Games | Price | Per Game | Badge |
|-------|-------|----------|-------|
| 1 Game | $20 | $20/game | — |
| 2 Games | $35 | $17.50/game | — |
| 3 Games | $50 | $16.67/game | POPULAR |
| 4 Games | $60 | $15/game | BEST VALUE ⭐ |

The pricing tier should auto-highlight based on how many games the user has selected. If they've clicked 3 games, the "3 Games — $50" tier should be visually active.

**CTA:** "Reserve [N] Lawn Games →" (dynamic count from selection). Scrolls to Reserve Form and pre-selects lawn games with the chosen games listed.

---

### 6. Coming Soon (`ComingSoon.tsx`)

**Background:** `--navy` (dark section for contrast)

**Content:**
- Section label (pixel, `--quest-gold`): `// LOADING NEW QUESTS...`
- Title (white text): "More Packages Coming Soon"
- Subtitle (light gray text): "We're always adding new party experiences. Join the list to be the first to know when new packages drop."
- **Email capture form:** Single input (email) + submit button in a flex row. Input has dark bg with light border. Button is `--quest-gold`.
- On submit: "🎉 You're on the list!" success message.
- Optional: 2-3 teaser cards with "???" or locked-quest styling showing mystery future packages. These are purely decorative.

---

### 7. Reviews (`Reviews.tsx`)

**Background:** `--cream`

**Content:**
- Section label (pixel): `// PARTY REPORTS`
- Title: "What Families Are Saying"
- 3 testimonial cards in a flex row (stack on mobile)

Each card:
- White bg, rounded-xl, subtle shadow, padding 24px
- Star rating (5 gold stars, emoji or SVG)
- Quote text (DM Sans 15px italic, `--warm-gray`, line-height 1.65)
- Name (Chakra Petch 600, 14px, `--navy`)
- Location (DM Sans 12px, `--warm-gray`)

**Placeholder testimonials** (mark clearly with a note):

1. **Sarah M. — Lilburn, GA** ★★★★★
   "My son's Nerf war birthday party was the easiest thing I've ever planned. Picked everything up Friday, set it up in 10 minutes, and 15 kids had the time of their lives. Returning it was just as easy."

2. **David R. — Lawrenceville, GA** ★★★★★
   "We rented the giant lawn games for a family cookout and it was a huge hit. Giant Jenga and Cornhole kept everyone from ages 8 to 80 entertained. Amazing value for the price."

3. **Michelle T. — Snellville, GA** ★★★★★
   "So much cheaper than hiring a party company and honestly more fun because the kids could play at their own pace all weekend. We'll definitely rent again."

**Footer note** (DM Sans 12px italic, 50% opacity): "* Sample reviews — replace with real customer testimonials"

---

### 8. FAQ (`FAQ.tsx`)

**Background:** `--light-tan`

**Content:**
- Section label (pixel): `// HELP MENU`
- Title: "Frequently Asked Questions"

**Accordion component:** Each item has a question (Chakra Petch 600, 16px) and expandable answer (DM Sans 15px). Click to toggle. One open at a time. Smooth height transition (CSS `max-height` or `grid-template-rows` trick). Chevron icon rotates on open.

| Question | Answer |
|----------|--------|
| How does the rental period work? | Every rental is a full weekend. Pick up your equipment on Friday and return it by Monday. That's 3 full days of party fun for one flat price. |
| Where do I pick up and return? | Pickup and drop-off is at our location in Lilburn, GA. We'll send you the exact address and any instructions when your reservation is confirmed. |
| What if something breaks or gets damaged? | Normal wear and tear is totally fine — that's what the equipment is for! If something is significantly damaged beyond normal use, we'll work with you on a fair resolution. We don't charge damage deposits. |
| Do you deliver? | We currently operate as a pickup rental to keep prices as low as possible. That's how we can offer a full Nerf war package for just $60. Delivery may be available in the future. |
| How far in advance should I book? | We recommend booking at least 1 week in advance, especially for weekends in spring and summer. Popular dates fill up fast! |
| What's included in each package? | Each package page lists exactly what's included. Everything arrives cleaned, organized, and ready to use. We include any necessary accessories like the air pump for Nerf barriers. |
| Can I combine packages? | Absolutely! Rent the Nerf War package AND lawn games for the ultimate party weekend. Bundle pricing on lawn games means more games = better value. |
| What's your service area? | We serve families across the greater Atlanta metro area. Pickup is in Lilburn, GA. As long as you can swing by to grab and return the gear, we've got you covered. |
| What's your cancellation policy? | Cancel at least 48 hours before your pickup date for a full refund. Cancellations within 48 hours may be subject to a partial charge. |

---

### 9. Reserve Form (`ReserveForm.tsx`)

**Background:** `--cream` with a container card that has a warm gradient border or glow effect.

**This is the primary conversion point of the entire site.**

**Container styling:** Rounded-2xl, white bg, generous padding (48px desktop, 24px mobile), subtle warm shadow, optional thin `--quest-gold` left border accent (4px).

**Content:**
- Section label (pixel): `// START YOUR QUEST`
- Title: "Reserve Your Party Package"
- Subtitle: "Fill out the form below and we'll confirm your reservation within a few hours. No payment needed to reserve — just grab your gear on pickup day."

**Form fields** (2-column grid on desktop, single column on mobile):

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Your Name | text input | Yes | |
| Email | email input | Yes | |
| Phone | tel input | Yes | |
| City / Area | text input | Yes | Placeholder: "Lilburn, Lawrenceville, etc." |
| Package Selection | checkbox group | Yes | See below |
| Lawn Games Selection | multi-select | Conditional | Only visible if lawn games is checked |
| Preferred Weekend | date input | Yes | See below |
| Estimated Guests | select dropdown | No | Options: "1–10", "11–20", "21–30", "30+" |
| Anything else? | textarea | No | Placeholder: "Special requests, questions, etc." |

**Package Selection (checkbox group):**
- ☐ Nerf War Party Package — $60
- ☐ Giant Lawn Games — from $20
- Both can be checked simultaneously.

**Lawn Games Sub-Selection:**
When "Giant Lawn Games" is checked, a game picker appears (same GameCard grid from the LawnGames section but smaller). Selected games count updates the displayed price tier automatically.

**Weekend Date Picker:**
- A standard date input (type="date")
- Label: "Pickup Date (Friday)"
- Helper text below: "Select your Friday pickup date. You'll return everything Monday."
- Validate that selected date is a Friday. If user selects a non-Friday, show helper: "Pickup is on Fridays — we've adjusted to the nearest Friday." and snap to the nearest Friday.

**Calculated Total:**
Display a live total above the submit button:
```
Your Rental: Nerf War Package ($60) + 3 Lawn Games ($50) = $110
Weekend: Friday Jun 12 – Monday Jun 15, 2026
```

**Submit Button:**
- Full width
- `--quest-gold` bg, `--navy` text
- Chakra Petch 700, 16px
- Text: "🚀 Submit Reservation Request"
- Padding: 18px
- Hover: lift + shadow

**On Submit:**
1. Basic client-side validation (required fields, valid email, date is a Friday)
2. POST to `/api/reserve` with form data as JSON
3. Show loading state on button ("Submitting...")
4. On success: Replace form with success message:
   ```
   🎉 Reservation Submitted!
   
   We'll confirm your reservation within a few hours. Keep an eye on your 
   email and phone for our confirmation with pickup details.
   
   Questions? Call or text us at (770) 555-0199
   ```
5. On error: Show inline error message, keep form data intact

---

### 10. Footer (`Footer.tsx`)

**Background:** `--navy`

**4-column grid** (stacks to 2x2 on tablet, single column on mobile):

**Column 1 — Brand:**
- Logo (32px height) + "Side Quest Party Rentals" text
- One-liner: "DIY party rentals for epic celebrations across greater Atlanta."

**Column 2 — Contact:**
- 📞 (770) 555-0199 — click-to-call `<a href="tel:...">`
- ✉️ info@sidequestpartyrentals.com — mailto link
- 📍 Lilburn, GA
- 🕐 Mon–Fri 9AM–6PM • Sat 8AM–4PM • Sun By Appointment

**Column 3 — Quick Links:**
- Packages → scroll to packages
- How It Works → scroll to how-it-works
- FAQ → scroll to faq
- Reserve Now → scroll to reserve form

**Column 4 — Follow Us:**
- Social media icon links (Facebook, Instagram, TikTok) — placeholder hrefs
- "Follow us for deals, new packages, and party inspo!"

**Bottom bar:**
- © 2026 Side Quest Party Rentals. All rights reserved.
- Privacy Policy | Terms (placeholder links)

---

### 11. Mobile Sticky Bar (`MobileStickyBar.tsx`)

**Visible only on screens < 768px.** Fixed to bottom, z-index 50.

**Layout:** Two buttons side by side:
- Left (40% width): "📞 Call" — `--royal-blue` bg, white text, links to `tel:`
- Right (60% width): "Reserve Now" — `--quest-gold` bg, `--navy` text, scrolls to form

**Styling:** Backdrop blur, subtle top border, padding 10px 16px. Same height as mobile browser chrome (~56px) so it feels native.

**IMPORTANT:** Add `pb-20` (80px padding-bottom) to the footer to prevent the sticky bar from covering footer content on mobile.

---

## API Route: `/api/reserve/route.ts`

### Request

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
  pickupDate: string;          // ISO date string (a Friday)
  estimatedGuests: string;
  message: string;
  totalPrice: number;          // Calculated client-side, verified server-side
}
```

### Logic

1. Validate required fields server-side
2. Verify pickup date is a Friday
3. Recalculate total price server-side to prevent manipulation
4. Send notification email to business owner with all reservation details
5. Send confirmation email to customer
6. Return success/error JSON response

### Email Template (to owner)

```
Subject: 🎮 New Reservation: [Package Name(s)] — [Pickup Date]

New reservation from [Name]!

Package(s): Nerf War Package ($60), 3 Lawn Games ($50)
Games: Giant Connect 4, Cornhole, Giant Jenga
Total: $110

Pickup: Friday, June 12, 2026
Return: Monday, June 15, 2026
Guests: 11–20

Customer Info:
Name: [Name]
Email: [Email]  
Phone: [Phone]
City: [City]

Notes: [Message or "None"]
```

### Email Setup

Use Resend (https://resend.com) for email delivery:
- Free tier: 100 emails/day (more than enough at launch)
- npm package: `resend`
- Requires API key in `.env.local`

```
RESEND_API_KEY=re_xxxxxxxxxxxx
NOTIFICATION_EMAIL=owner@sidequestpartyrentals.com
```

If Resend is not set up yet, the API route should still work but log the reservation to console and return success. This allows testing the form flow without email configured.

---

## SEO & Meta

### Root Layout Meta

```typescript
export const metadata: Metadata = {
  title: 'Side Quest Party Rentals | DIY Party Rentals in Lilburn & Greater Atlanta',
  description: 'Affordable DIY party rental packages in Lilburn, GA. Nerf war kits, giant lawn games & more. Pick up Friday, party all weekend, return Monday. Starting at $20.',
  keywords: 'party rentals Lilburn GA, nerf war party, giant lawn games rental, birthday party rentals Atlanta, DIY party rental, backyard party games',
  openGraph: {
    title: 'Side Quest Party Rentals — Level Up Your Party',
    description: 'DIY party rental packages starting at $20. Nerf wars, giant lawn games & more. Full weekend rentals in greater Atlanta.',
    url: 'https://sidequestpartyrentals.com',
    siteName: 'Side Quest Party Rentals',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
};
```

---

## Analytics & Tracking Placeholders

In `layout.tsx`, include placeholder script tags for:

```tsx
{/* Facebook Pixel — uncomment and add ID when ready */}
{/* <Script id="fb-pixel" strategy="afterInteractive">{`...`}</Script> */}

{/* Google Analytics 4 — uncomment and add measurement ID when ready */}
{/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" /> */}

{/* Google Ads Conversion Tag — uncomment and add when running ads */}
{/* <Script id="gtag-config" strategy="afterInteractive">{`...`}</Script> */}
```

Include comments with instructions for how to activate each one.

---

## Environment Variables

`.env.local.example`:
```
# Email notifications (Resend)
RESEND_API_KEY=
NOTIFICATION_EMAIL=owner@sidequestpartyrentals.com

# Optional: Facebook Pixel
# NEXT_PUBLIC_FB_PIXEL_ID=

# Optional: Google Analytics
# NEXT_PUBLIC_GA_ID=
```

---

## Deployment Instructions

### GitHub Setup
```bash
# Initialize repo
git init
git remote add origin https://github.com/[username]/side-quest-party-rentals.git
git add .
git commit -m "Initial commit: Side Quest Party Rentals landing page"
git push -u origin main
```

### Vercel Setup
1. Go to vercel.com, import the GitHub repo
2. Framework preset: Next.js (auto-detected)
3. Add environment variables from `.env.local`
4. Deploy — auto-deploys on every push to `main`
5. Add custom domain in Vercel dashboard once purchased

### Domain Configuration
1. Purchase domain (recommended: `sidequestpartyrentals.com` or `sidequestparty.com`)
2. In Vercel dashboard: Settings → Domains → Add domain
3. Update DNS records per Vercel's instructions (usually CNAME to `cname.vercel-dns.com`)
4. SSL is automatic

---

## Launch Checklist

- [ ] Replace placeholder phone number with real number
- [ ] Replace placeholder email with real email
- [ ] Add real photos of Nerf package and lawn games
- [ ] Replace placeholder testimonials with real reviews
- [ ] Set up Resend account and add API key to Vercel env vars
- [ ] Create Facebook Business page and install Pixel
- [ ] Set up Google Analytics 4 property
- [ ] Purchase domain and configure in Vercel
- [ ] Test reservation form end-to-end (submit → email received)
- [ ] Test all click-to-call links on mobile
- [ ] Test on iPhone Safari, Android Chrome, desktop Chrome/Firefox
- [ ] Run Lighthouse audit — target 90+ on Performance and 100 on Accessibility
- [ ] Add logo as `public/logo.png` (provided file)
- [ ] Create and add OG image (`public/og-image.png`, 1200x630)
- [ ] Set up Google Business Profile for local SEO
- [ ] Create social media accounts and update footer links

---

## Pricing Reference (for validation logic)

```typescript
const PRICING = {
  nerfWar: 60,
  lawnGames: {
    1: 20,
    2: 35,
    3: 50,
    4: 60,
  },
} as const;
```

Max lawn games selectable: 4. If user selects more than 4, disable additional selections and show message: "Max 4 games per rental weekend."

---

## Content Tone Guidelines

All copy on the site should feel:
- **Casual and warm** — like a friend telling you about this cool thing they found
- **Fun but not cheesy** — gaming references should feel natural, not forced
- **Confidence-building** — address the "is this legit?" question implicitly through professionalism
- **Price-proud** — never apologize for low prices, celebrate them as the whole point
- **Action-oriented** — every section should nudge toward reservation

Avoid:
- Corporate language ("solutions", "leverage", "optimize")
- Overpromising ("the BEST party EVER")
- Pressure tactics ("limited time", "book NOW before it's gone")
- Walls of text — keep paragraphs to 2-3 sentences max
