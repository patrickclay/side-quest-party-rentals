# Side Quest Party Rentals — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page lead-generation website for Side Quest Party Rentals with interactive game selection, reservation form, and email notifications.

**Architecture:** Next.js 15 App Router, single page with smooth-scroll sections. All components are client-side React with two API routes (reservation + newsletter). Tailwind CSS for styling with CSS custom properties for the brand palette. Resend for transactional email and newsletter signups.

**Tech Stack:** Next.js 15, Tailwind CSS, TypeScript, Resend, Google Fonts (Chakra Petch, DM Sans, Press Start 2P)

**Spec:** `docs/superpowers/specs/2026-03-12-side-quest-site-design.md`

---

## Chunk 1: Project Foundation

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `.env.local.example`, `.gitignore`

- [ ] **Step 1: Create Next.js 15 project**

```bash
cd /Users/patrickboggs/projects/sidequest
npx create-next-app@latest side-quest-party-rentals --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

When prompted, accept defaults. This creates the project in a subdirectory.

- [ ] **Step 2: Move project files to root**

```bash
# Move scaffold output to root. Existing files (docs/, images/, plans/) are preserved
# because cp -r won't overwrite directories, only merges contents.
# The scaffold creates: src/, public/, package.json, tsconfig.json, next.config.ts, etc.
shopt -s dotglob
cp -rn side-quest-party-rentals/* . 2>/dev/null
# Force-copy scaffold config files (these are new/scaffolded, safe to overwrite)
cp side-quest-party-rentals/package.json side-quest-party-rentals/tsconfig.json .
cp side-quest-party-rentals/.gitignore side-quest-party-rentals/.eslintrc.json . 2>/dev/null || true
rm -rf side-quest-party-rentals
```

- [ ] **Step 3: Install dependencies**

```bash
npm install resend
npm install -D vitest
```

- [ ] **Step 4: Create `.env.local.example`**

```bash
# File: .env.local.example
RESEND_API_KEY=
NOTIFICATION_EMAIL=owner@sidequestpartyrentals.com
RESEND_AUDIENCE_ID=
# NEXT_PUBLIC_FB_PIXEL_ID=
# NEXT_PUBLIC_GA_ID=
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: App starts at localhost:3000 with default Next.js page.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.mjs .env.local.example .gitignore src/ public/
git commit -m "chore: scaffold Next.js 15 project with Tailwind and Resend"
```

---

### Task 2: Design system — CSS variables, fonts, and global styles

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Configure Tailwind with brand colors**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1E2A4A",
        "royal-blue": "#2B5EA7",
        "quest-gold": "#F5A623",
        "quest-orange": "#E8751A",
        "hero-red": "#C0392B",
        "forest-green": "#3DA34D",
        "bg-light": "#F6F7F9",
        "text-primary": "#1A1D26",
        "text-secondary": "#5A5F72",
        "text-muted": "#8B90A0",
        "border-light": "#E2E4EA",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        pixel: ["var(--font-pixel)"],
      },
      maxWidth: {
        content: "1060px",
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        "float-bounce": "floatBounce 5s ease-in-out infinite",
        "confetti-fall": "confettiFall 7s linear infinite",
        "badge-pulse": "badgePulse 2s ease-in-out infinite",
        "gradient-slide": "gradientSlide 4s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { left: "-100%" },
          "50%, 100%": { left: "100%" },
        },
        floatBounce: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-15px) rotate(2deg)" },
        },
        confettiFall: {
          "0%": { top: "-10px", opacity: "0", transform: "rotate(0) translateX(0)" },
          "10%": { opacity: "0.5" },
          "90%": { opacity: "0.3" },
          "100%": { top: "100%", opacity: "0", transform: "rotate(720deg) translateX(30px)" },
        },
        badgePulse: {
          "0%, 100%": { boxShadow: "0 4px 12px rgba(192,57,43,.3)" },
          "50%": { boxShadow: "0 4px 20px rgba(192,57,43,.5)" },
        },
        gradientSlide: {
          "0%": { backgroundPosition: "0% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Write global CSS with custom properties and animations**

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --navy: #1E2A4A;
    --royal-blue: #2B5EA7;
    --quest-gold: #F5A623;
    --quest-orange: #E8751A;
    --hero-red: #C0392B;
    --forest-green: #3DA34D;
    --bg-white: #FFFFFF;
    --bg-light: #F6F7F9;
    --text-primary: #1A1D26;
    --text-secondary: #5A5F72;
    --text-muted: #8B90A0;
    --border-light: #E2E4EA;
    --card-shadow: 0 4px 20px rgba(26,29,38,.07);
    --card-shadow-hover: 0 12px 32px rgba(26,29,38,.12);
  }

  body {
    @apply font-body text-text-primary bg-white;
  }

  html {
    scroll-behavior: smooth;
  }
}

@layer components {
  .gradient-text-gold {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, var(--quest-gold), var(--quest-orange));
  }

  .gradient-bg-gold {
    background-image: linear-gradient(135deg, var(--quest-gold), var(--quest-orange));
  }

  .gradient-bg-gold-wide {
    background-image: linear-gradient(135deg, var(--quest-gold), var(--quest-orange), #FF6B35);
  }
}
```

- [ ] **Step 3: Configure fonts in root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Chakra_Petch, DM_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";

const heading = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Side Quest Party Rentals | DIY Party Rentals in Lilburn & Greater Atlanta",
  description:
    "Affordable DIY party rental packages in Lilburn, GA. Nerf war kits, giant lawn games & more. Pick up Friday, party all weekend, return Monday. Starting at $20.",
  keywords:
    "party rentals Lilburn GA, nerf war party, giant lawn games rental, birthday party rentals Atlanta, DIY party rental, backyard party games",
  openGraph: {
    title: "Side Quest Party Rentals — Level Up Your Party",
    description:
      "DIY party rental packages starting at $20. Nerf wars, giant lawn games & more. Full weekend rentals in greater Atlanta.",
    url: "https://sidequestpartyrentals.com",
    siteName: "Side Quest Party Rentals",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${pixel.variable}`}
    >
      <body>
        {children}

        {/* Facebook Pixel — uncomment and add ID when ready */}
        {/* <Script id="fb-pixel" strategy="afterInteractive">{`...`}</Script> */}

        {/* Google Analytics 4 — uncomment and add measurement ID when ready */}
        {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" /> */}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify fonts load on dev server**

```bash
npm run dev
```

Open localhost:3000, inspect `<html>` element — should have three `--font-*` CSS variables set.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat: configure design system — brand colors, fonts, animations"
```

---

### Task 3: UI primitives — Icons, Button, SectionLabel, SectionTitle

**Files:**
- Create: `src/app/components/ui/Icons.tsx`
- Create: `src/app/components/ui/Button.tsx`
- Create: `src/app/components/ui/SectionLabel.tsx`
- Create: `src/app/components/ui/SectionTitle.tsx`

- [ ] **Step 1: Create Icons component with all SVG icons**

```tsx
// src/app/components/ui/Icons.tsx
// All inline SVG icons used across the site.
// Lucide-style: 24x24 viewBox, stroke-based, currentColor.

import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" /><polygon points="12 15 17 21 7 21 12 15" />
    </svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function DollarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

export function GamepadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01M17 12h.01M7 12h.01" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 2L11 13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Game-specific icons for lawn games section
export function ConnectFourIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" /><circle cx="8" cy="11" r="2" /><circle cx="16" cy="11" r="2" /><circle cx="12" cy="17" r="2" /><circle cx="8" cy="17" r="2" />
    </svg>
  );
}

export function AxeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M14 12l-8.5 8.5a2.12 2.12 0 01-3-3L11 9" /><path d="M15 4l6 6M13 6l6 6" />
    </svg>
  );
}

export function KerplunkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export function JengaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="6" y="2" width="12" height="20" rx="1" /><line x1="6" y1="6" x2="18" y2="6" /><line x1="6" y1="10" x2="18" y2="10" /><line x1="6" y1="14" x2="18" y2="14" /><line x1="6" y1="18" x2="18" y2="18" />
    </svg>
  );
}

export function CornholeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="9" cy="12" r="6" /><circle cx="15" cy="12" r="6" />
    </svg>
  );
}

export function YardPongIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="5" r="3" /><line x1="12" y1="8" x2="12" y2="16" /><circle cx="12" cy="19" r="3" />
    </svg>
  );
}

export function LadderBallIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <line x1="12" y1="2" x2="12" y2="22" /><line x1="6" y1="6" x2="18" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><circle cx="6" cy="6" r="2" /><circle cx="16" cy="10" r="2" />
    </svg>
  );
}

export function TicTacToeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="1" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

// Coming Soon icons
export function DropletIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <path d="M12 2C8 2 5 8 5 13a7 7 0 0014 0C19 8 16 2 12 2z" />
    </svg>
  );
}

export function FilmIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" /><path d="M2 12h20" />
    </svg>
  );
}
```

- [ ] **Step 2: Create Button component**

```tsx
// src/app/components/ui/Button.tsx
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonAsLink = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-heading font-bold text-base rounded-xl transition-all duration-200 cursor-pointer";

  const variants = {
    primary:
      "gradient-bg-gold text-navy px-8 py-4 shadow-[0_4px_24px_rgba(245,166,35,.45)] hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(245,166,35,.6)] relative overflow-hidden",
    secondary:
      "border-2 border-white/50 text-white px-8 py-4 bg-white/[.08] backdrop-blur-lg hover:bg-white/[.15] hover:border-white hover:-translate-y-[2px]",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
        {variant === "primary" && (
          <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
        )}
      </a>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
      {variant === "primary" && (
        <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
      )}
    </button>
  );
}
```

- [ ] **Step 3: Create SectionLabel and SectionTitle**

```tsx
// src/app/components/ui/SectionLabel.tsx
interface SectionLabelProps {
  children: string;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div className={`font-pixel text-[10px] text-quest-gold tracking-[2px] mb-3 ${className}`}>
      {children}
    </div>
  );
}
```

```tsx
// src/app/components/ui/SectionTitle.tsx
interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2 className={`font-heading font-extrabold text-[28px] md:text-[40px] text-navy mb-2.5 ${className}`}>
      {children}
    </h2>
  );
}
```

- [ ] **Step 4: Verify components render**

Update `src/app/page.tsx` temporarily:

```tsx
import { Button } from "./components/ui/Button";
import { SectionLabel } from "./components/ui/SectionLabel";
import { SectionTitle } from "./components/ui/SectionTitle";
import { TargetIcon } from "./components/ui/Icons";

export default function Home() {
  return (
    <main className="p-12">
      <SectionLabel>// TEST LABEL</SectionLabel>
      <SectionTitle>Test Title</SectionTitle>
      <Button variant="primary">
        <TargetIcon className="w-5 h-5" />
        Primary Button
      </Button>
    </main>
  );
}
```

Check localhost:3000 — should show pixel-font label, Chakra Petch heading, and gold gradient button with shimmer.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/ui/ src/app/page.tsx
git commit -m "feat: add UI primitives — Icons, Button, SectionLabel, SectionTitle"
```

Note: page.tsx contains temporary test content that will be replaced in subsequent tasks.

---

## Chunk 2: Pricing Logic and API Routes

### Task 4: Pricing utility with tests

**Files:**
- Create: `src/app/lib/pricing.ts`
- Create: `src/app/lib/pricing.test.ts`

- [ ] **Step 1: Write pricing tests**

```typescript
// src/app/lib/pricing.test.ts
import { describe, it, expect } from "vitest";
import { calculateTotal, PRICING, getNextFriday } from "./pricing";

describe("calculateTotal", () => {
  it("returns $60 for nerf war only", () => {
    expect(calculateTotal({ nerfWar: true, lawnGames: false }, 0)).toBe(60);
  });

  it("returns $20 for 1 lawn game", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 1)).toBe(20);
  });

  it("returns $35 for 2 lawn games", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 2)).toBe(35);
  });

  it("returns $50 for 3 lawn games", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 3)).toBe(50);
  });

  it("returns $60 for 4 lawn games", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 4)).toBe(60);
  });

  it("returns $110 for nerf war + 3 lawn games", () => {
    expect(calculateTotal({ nerfWar: true, lawnGames: true }, 3)).toBe(110);
  });

  it("returns 0 when no packages selected", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: false }, 0)).toBe(0);
  });

  it("ignores lawn game count when lawn games not selected", () => {
    expect(calculateTotal({ nerfWar: true, lawnGames: false }, 3)).toBe(60);
  });

  it("clamps lawn game count to max 4", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 6)).toBe(60);
  });
});

describe("getNextFriday", () => {
  it("returns same date if already Friday", () => {
    const friday = new Date("2026-06-12"); // a Friday
    expect(getNextFriday(friday).toISOString().slice(0, 10)).toBe("2026-06-12");
  });

  it("snaps Saturday forward to next Friday (6 days)", () => {
    const saturday = new Date("2026-06-13");
    // Always snaps forward — you can't pick up in the past
    expect(getNextFriday(saturday).toISOString().slice(0, 10)).toBe("2026-06-19");
  });

  it("snaps Wednesday forward to next Friday (2 days)", () => {
    const wednesday = new Date("2026-06-10");
    expect(getNextFriday(wednesday).toISOString().slice(0, 10)).toBe("2026-06-12");
  });

  it("snaps Monday forward to next Friday (4 days)", () => {
    const monday = new Date("2026-06-08");
    expect(getNextFriday(monday).toISOString().slice(0, 10)).toBe("2026-06-12");
  });
});
```

- [ ] **Step 2: Run failing tests**

```bash
npx vitest run src/app/lib/pricing.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement pricing utility**

```typescript
// src/app/lib/pricing.ts
export const PRICING = {
  nerfWar: 60,
  lawnGames: { 1: 20, 2: 35, 3: 50, 4: 60 } as const,
};

export const GAMES = [
  { id: "connect-4", name: "Giant Connect 4" },
  { id: "axe-throwing", name: "Axe Throwing" },
  { id: "kerplunk", name: "Kerplunk" },
  { id: "giant-jenga", name: "Giant Jenga" },
  { id: "cornhole", name: "Cornhole" },
  { id: "yard-pong", name: "Giant Yard Pong" },
  { id: "ladder-ball", name: "Ladder Ball" },
  { id: "tic-tac-toe", name: "Giant Tic Tac Toe" },
] as const;

export const MAX_GAMES = 4;

export function calculateTotal(
  packages: { nerfWar: boolean; lawnGames: boolean },
  lawnGameCount: number
): number {
  let total = 0;
  if (packages.nerfWar) total += PRICING.nerfWar;
  if (packages.lawnGames && lawnGameCount > 0) {
    const clamped = Math.min(lawnGameCount, MAX_GAMES) as keyof typeof PRICING.lawnGames;
    total += PRICING.lawnGames[clamped];
  }
  return total;
}

export function getNextFriday(date: Date): Date {
  const day = date.getUTCDay(); // 0=Sun, 5=Fri
  if (day === 5) return date;
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + daysUntilFriday);
  return result;
}

export function isFriday(dateStr: string): boolean {
  return new Date(dateStr).getUTCDay() === 5;
}

export function formatWeekend(pickupDate: string): string {
  const pickup = new Date(pickupDate);
  const returnDate = new Date(pickup);
  returnDate.setUTCDate(returnDate.getUTCDate() + 3);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

  return `${fmt(pickup)} – ${fmt(returnDate)}`;
}
```

- [ ] **Step 4: Run tests — verify pass**

```bash
npx vitest run src/app/lib/pricing.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/lib/
git commit -m "feat: add pricing calculation and date utilities with tests"
```

---

### Task 5: Reservation API route with validation

**Files:**
- Create: `src/app/api/reserve/route.ts`
- Create: `src/app/lib/validation.ts`
- Create: `src/app/lib/validation.test.ts`

- [ ] **Step 1: Write validation tests**

```typescript
// src/app/lib/validation.test.ts
import { describe, it, expect } from "vitest";
import { validateReservation } from "./validation";

describe("validateReservation", () => {
  const validData = {
    name: "John Smith",
    email: "john@example.com",
    phone: "7705550199",
    city: "Lilburn",
    packages: { nerfWar: true, lawnGames: false },
    selectedGames: [],
    lawnGameCount: 0,
    pickupDate: "2026-06-12", // a Friday
    estimatedGuests: "11-20",
    message: "",
    totalPrice: 60,
  };

  it("passes with valid data", () => {
    expect(validateReservation(validData)).toEqual({ valid: true, errors: {} });
  });

  it("fails with missing name", () => {
    const result = validateReservation({ ...validData, name: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("fails with invalid email", () => {
    const result = validateReservation({ ...validData, email: "notanemail" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("fails with non-Friday pickup date", () => {
    const result = validateReservation({ ...validData, pickupDate: "2026-06-10" }); // Wednesday
    expect(result.valid).toBe(false);
    expect(result.errors.pickupDate).toBeDefined();
  });

  it("fails with no packages selected", () => {
    const result = validateReservation({
      ...validData,
      packages: { nerfWar: false, lawnGames: false },
      totalPrice: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.packages).toBeDefined();
  });

  it("fails with mismatched total price", () => {
    const result = validateReservation({ ...validData, totalPrice: 999 });
    expect(result.valid).toBe(false);
    expect(result.errors.totalPrice).toBeDefined();
  });
});
```

- [ ] **Step 2: Run tests — verify fail**

```bash
npx vitest run src/app/lib/validation.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement validation**

```typescript
// src/app/lib/validation.ts
import { calculateTotal, isFriday } from "./pricing";

export interface ReservationData {
  name: string;
  email: string;
  phone: string;
  city: string;
  packages: { nerfWar: boolean; lawnGames: boolean };
  selectedGames: string[];
  lawnGameCount: number;
  pickupDate: string;
  estimatedGuests: string;
  message: string;
  totalPrice: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function validateReservation(data: ReservationData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) errors.name = "Name is required";
  if (!EMAIL_RE.test(data.email)) errors.email = "Valid email is required";
  if (!data.phone.trim()) errors.phone = "Phone is required";
  if (!data.city.trim()) errors.city = "City is required";

  if (!data.packages.nerfWar && !data.packages.lawnGames) {
    errors.packages = "Select at least one package";
  }

  if (!data.pickupDate) {
    errors.pickupDate = "Pickup date is required";
  } else if (!isFriday(data.pickupDate)) {
    errors.pickupDate = "Pickup date must be a Friday";
  }

  const expectedTotal = calculateTotal(data.packages, data.lawnGameCount);
  if (data.totalPrice !== expectedTotal) {
    errors.totalPrice = "Price mismatch — please refresh and try again";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
```

- [ ] **Step 4: Run tests — verify pass**

```bash
npx vitest run src/app/lib/validation.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Create reservation API route**

```typescript
// src/app/api/reserve/route.ts
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

    // Try sending via Resend if configured
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const notificationEmail = process.env.NOTIFICATION_EMAIL || "owner@sidequestpartyrentals.com";

      // Owner notification
      await resend.emails.send({
        from: "Side Quest Reservations <reservations@sidequestpartyrentals.com>",
        to: notificationEmail,
        subject: `New Reservation: ${packageNames} — ${data.pickupDate}`,
        text: `New reservation from ${data.name}!\n\nPackage(s): ${packageNames}\nGames: ${gamesList}\nTotal: $${data.totalPrice}\n\nWeekend: ${weekend}\nGuests: ${data.estimatedGuests || "Not specified"}\n\nCustomer Info:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCity: ${data.city}\n\nNotes: ${data.message || "None"}`,
      });

      // Customer confirmation
      await resend.emails.send({
        from: "Side Quest Party Rentals <reservations@sidequestpartyrentals.com>",
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
```

- [ ] **Step 6: Commit**

```bash
git add src/app/lib/validation.ts src/app/lib/validation.test.ts src/app/api/reserve/
git commit -m "feat: add reservation API route with server-side validation"
```

---

### Task 6: Newsletter subscribe API route

**Files:**
- Create: `src/app/api/subscribe/route.ts`
- Create: `src/app/lib/subscribe.test.ts`

- [ ] **Step 1: Write subscribe validation test**

```typescript
// src/app/lib/subscribe.test.ts
import { describe, it, expect } from "vitest";
import { isValidEmail } from "./validation";

describe("isValidEmail (subscribe context)", () => {
  it("accepts valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects missing @", () => {
    expect(isValidEmail("testexample.com")).toBe(false);
  });

  it("rejects missing domain", () => {
    expect(isValidEmail("test@")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test — verify pass (isValidEmail already implemented)**

```bash
npx vitest run src/app/lib/subscribe.test.ts
```

Expected: All tests PASS.

- [ ] **Step 3: Create subscribe route**

```typescript
// src/app/api/subscribe/route.ts
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
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/subscribe/ src/app/lib/subscribe.test.ts
git commit -m "feat: add newsletter subscribe API route for Resend Audiences"
```

---

## Chunk 3: Static Sections (Navbar, Hero, How It Works, Reviews, FAQ, Footer)

### Task 7: Navbar

**Files:**
- Create: `src/app/components/Navbar.tsx`

- [ ] **Step 1: Build Navbar component**

Build the fixed navbar with: transparent logo (50px height), four nav links that smooth-scroll (Packages → `#nerf-package`, How It Works → `#how-it-works`, FAQ → `#faq`, Reviews → `#reviews`), phone number with PhoneIcon `(770) 555-0199` (placeholder — replace before launch), Reserve Now CTA → `#reserve`, and mobile hamburger menu. Use `useState` for mobile menu toggle. Navy background with backdrop blur, 68px height, z-50. Ref the design spec section 1.

- [ ] **Step 2: Add Navbar to page.tsx**

Import and render `<Navbar />` at the top of page.tsx.

- [ ] **Step 3: Verify on dev server**

Check desktop and mobile (resize browser) — nav links, phone, CTA visible. Mobile shows hamburger.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Navbar.tsx src/app/page.tsx
git commit -m "feat: add responsive Navbar with mobile hamburger menu"
```

---

### Task 8: Hero section

**Files:**
- Create: `src/app/components/Hero.tsx`
- Modify: `src/app/globals.css` (if confetti/float-bounce keyframes not already present)

- [ ] **Step 1: Prepare hero image asset**

Copy and optimize the barriers image for the hero background:

```bash
mkdir -p public/images
cp "images/Nerf Barriers.png" public/images/hero-bg.png
```

Also copy the transparent logo (generated during brainstorming with background removed):

```bash
# If /tmp/sq-resized/logo-transparent.png exists from brainstorming, use it.
# Otherwise, use the original logo and remove the white background with Python:
# python3 -c "from PIL import Image; img=Image.open('images/Side Quest party rentals logo design.png').convert('RGBA'); data=img.getdata(); img.putdata([(r,g,b,0) if r>240 and g>240 and b>240 else (r,g,b,a) for r,g,b,a in data]); img.save('public/logo.png')"
cp /tmp/sq-resized/logo-transparent.png public/logo.png 2>/dev/null || python3 -c "
from PIL import Image
img = Image.open('images/Side Quest party rentals logo design.png').convert('RGBA')
data = img.getdata()
img.putdata([(r,g,b,0) if r>240 and g>240 and b>240 else (r,g,b,a) for r,g,b,a in data])
img.thumbnail((400,400))
img.save('public/logo.png')
"
```

- [ ] **Step 2: Build Hero component**

Full viewport height. Background image with left-to-right dark gradient overlay (93% opacity left → 15% right). Content (left-aligned, max-w-[600px], white text): pixel label `// NOW SERVING GREATER ATLANTA` with gold line accent, headline "Level Up" (white) / "Your Party." (gradient-text-gold), subheadline with bold "epic birthdays" and "$20", two CTA buttons (Browse Packages primary → `#nerf-package`, Call or Text Us secondary with PhoneIcon). Trust strip: 4 items with SVG icons (ShieldCheckIcon "Full Weekend Rental", DollarIcon "Starting at $20", ShieldCheckIcon "Cleaned & Sanitized", MapPinIcon "Lilburn GA"). Floating logo badge bottom-right with animate-float-bounce and drop shadow. 8 confetti particles: small colored divs (6-10px) using animate-confetti-fall with staggered delays and varied colors (quest-gold, quest-orange, hero-red, forest-green, royal-blue). Ref spec section 2.

- [ ] **Step 3: Add Hero to page.tsx, verify**

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Hero.tsx public/images/ public/logo.png src/app/page.tsx
git commit -m "feat: add Hero section with background image, confetti, and floating logo"
```

---

### Task 9: How It Works section

**Files:**
- Create: `src/app/components/HowItWorks.tsx`

- [ ] **Step 1: Build HowItWorks component**

Background bg-light. Section header (SectionLabel + SectionTitle). 4 step cards in flex row with dashed gold connector line. Each card: numbered gold circle, SVG icon (TargetIcon, CalendarIcon, PackageIcon, GiftIcon), title, description. Cards lift on hover. Responsive: 2x2 on tablet, single column mobile. Ref spec section 3.

- [ ] **Step 2: Add to page.tsx, verify**

- [ ] **Step 3: Commit**

```bash
git add src/app/components/HowItWorks.tsx src/app/page.tsx
git commit -m "feat: add How It Works section with step cards"
```

---

### Task 10: Reviews section

**Files:**
- Create: `src/app/components/Reviews.tsx`

- [ ] **Step 1: Build Reviews component**

3 testimonial cards with 5 gold StarIcon SVGs, italic quote, author name/location. Decorative opening-quote watermark (10% opacity gold, positioned absolute). Cards lift on hover.

Placeholder testimonials (mark with `{/* PLACEHOLDER — replace with real reviews */}`):
1. "Side Quest made our son's birthday unforgettable! The Nerf war package was a huge hit with all 15 kids. Setup was easy and everything was clean and ready to go." — Sarah M., Lilburn
2. "We rented the lawn games for our family reunion and everyone had a blast. Giant Jenga and Cornhole were the favorites. Great value for a full weekend!" — Marcus T., Snellville
3. "So easy! Picked everything up on Friday, had an amazing party Saturday, and returned Monday. The kids are already asking when we can do it again." — Jennifer K., Lawrenceville

Ref spec section 7.

- [ ] **Step 2: Add to page.tsx, verify**

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Reviews.tsx src/app/page.tsx
git commit -m "feat: add Reviews section with testimonial cards"
```

---

### Task 11: FAQ section

**Files:**
- Create: `src/app/components/FAQ.tsx`

- [ ] **Step 1: Build FAQ accordion**

All 9 FAQ items. Each item: clickable question (font-heading font-bold) with ChevronDownIcon that rotates 180deg on open, animated answer panel (font-body, max-height transition). One open at a time. First item open by default. `useState<number | null>` to track open index.

FAQ questions and answers — inline the full content from the build spec so the implementer doesn't need to cross-reference:
1. How does the rental period work? → Pick up Friday, return Monday. Full weekend.
2. Where do I pick up and return? → Our home in Lilburn, GA. Address provided after booking.
3. What if something breaks or gets damaged? → Normal wear is fine. We'll discuss significant damage case by case.
4. Do you deliver? → Pickup only for now. We may add delivery in the future.
5. How far in advance should I book? → At least 1 week. Popular weekends book fast.
6. What's included in each package? → Everything listed on the package card. No hidden fees.
7. Can I combine packages? → Yes! Nerf War + Lawn Games for the ultimate party.
8. What's your service area? → Greater Atlanta — Lilburn, Snellville, Lawrenceville, Duluth, Norcross, etc.
9. What's your cancellation policy? → Full refund if canceled 7+ days before pickup. Within 7 days, credit toward future rental.

Ref spec section 8 and `plans/SIDE-QUEST-BUILD-SPEC.md` for full answer text.

- [ ] **Step 2: Add to page.tsx, verify**

Verify accordion opens/closes, only one open at a time, chevron rotates.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/FAQ.tsx src/app/page.tsx
git commit -m "feat: add FAQ accordion with 9 items"
```

---

### Task 12: Footer and Mobile Sticky Bar

**Files:**
- Create: `src/app/components/Footer.tsx`
- Create: `src/app/components/MobileStickyBar.tsx`

- [ ] **Step 1: Build Footer**

Navy-to-darker gradient background (`bg-gradient-to-b from-navy to-[#141B30]`). Rainbow gradient top border (3px, `bg-gradient-to-r from-quest-gold via-hero-red to-royal-blue`). 4-column grid (responsive: 1 col mobile, 2 tablet, 4 desktop).

Columns:
1. **Brand:** transparent logo (120px height) + tagline "Level up your party with affordable DIY rental packages"
2. **Contact:** PhoneIcon (770) 555-0199 (placeholder), email icon info@sidequestpartyrentals.com, MapPinIcon Lilburn, GA, hours "Pickup: Fridays | Return: Mondays"
3. **Quick Links:** Packages → `#nerf-package`, How It Works → `#how-it-works`, FAQ → `#faq`, Reviews → `#reviews`, Reserve → `#reserve`
4. **Follow Us:** Facebook, Instagram links (placeholder `href="#"`)

Bottom bar: `© 2026 Side Quest Party Rentals. All rights reserved.` + Privacy/Terms links (placeholder). Add `pb-20 md:pb-0` to main footer for mobile sticky bar clearance. Ref spec section 10.

- [ ] **Step 2: Build MobileStickyBar**

Fixed bottom, hidden on md+. Two buttons: Call (royal-blue, 40%) + Reserve Now (gold gradient, 60%). Backdrop blur, z-50. PhoneIcon in call button. Ref spec section 11.

- [ ] **Step 3: Add both to page.tsx, verify**

Check footer renders. Resize to mobile — sticky bar appears at bottom.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Footer.tsx src/app/components/MobileStickyBar.tsx src/app/page.tsx
git commit -m "feat: add Footer and MobileStickyBar"
```

---

## Chunk 4: Interactive Sections (Nerf Package, Lawn Games, Coming Soon, Reserve Form)

### Task 13: Photo Gallery and Nerf Package

**Files:**
- Create: `src/app/components/PhotoGallery.tsx`
- Create: `src/app/components/NerfPackage.tsx`

- [ ] **Step 1: Copy and optimize product images**

```bash
cp "images/Nerf Guns.png" public/images/nerf-guns.png
cp "images/Something Fun is coming (1).png" public/images/barrier-closeup.png
cp "images/Nerf War Package.png" public/images/nerf-package-promo.png
cp "images/Safety Glasses.png" public/images/safety-glasses.png
cp "images/Electric Pump.png" public/images/electric-pump.png
cp "images/Something Fun is coming (2).png" public/images/packed-bin.png
```

- [ ] **Step 2: Build PhotoGallery component**

Reusable grid: hero image spanning full width, row of thumbnails below, each with label overlay and hover lift, plus a "More Photos" placeholder card. Uses Next.js `<Image>` with responsive sizing. Ref spec section 4 photo gallery.

- [ ] **Step 3: Build NerfPackage component**

Two-column layout. Left: PhotoGallery with product images. Right: section label, MOST POPULAR badge (pulsing), package name, description, includes checklist with green CheckIcon badges, price block with gradient text, full-width CTA that scrolls to reserve form. Ref spec section 4.

- [ ] **Step 4: Add to page.tsx, verify**

Check two-column layout, images display, badge pulses, CTA scrolls to `#reserve`.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/PhotoGallery.tsx src/app/components/NerfPackage.tsx public/images/ src/app/page.tsx
git commit -m "feat: add Nerf Package section with photo gallery"
```

---

### Task 14: Lawn Games with interactive GameCard selection

**Files:**
- Create: `src/app/components/GameCard.tsx`
- Create: `src/app/components/LawnGames.tsx`

- [ ] **Step 1: Build GameCard component**

Props: `id`, `name`, `icon` (React component), `selected`, `onToggle`. White card, border transitions to blue when selected, checkmark badge appears. Hover lift. Ref spec section 5 game cards.

- [ ] **Step 2: Build LawnGames component**

`"use client"` — needs state. `useState` for `selectedGames: Set<string>`. Renders section header, 8 GameCards in 4-column grid (2 on mobile), pricing strip with 4 tiers. Active tier highlights based on `selectedGames.size`. CTA with dynamic count: "Reserve [N] Lawn Games". Max 4 enforcement: if size >= 4 and user clicks unselected card, show brief message "Max 4 games per rental weekend." Ref spec section 5.

- [ ] **Step 3: Add to page.tsx, verify**

Click cards — should toggle, pricing tier should highlight, CTA count should update. Try selecting 5 — should show max message.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/GameCard.tsx src/app/components/LawnGames.tsx src/app/page.tsx
git commit -m "feat: add interactive Lawn Games section with game card selection"
```

---

### Task 15: Coming Soon section

**Files:**
- Create: `src/app/components/ComingSoon.tsx`

- [ ] **Step 1: Copy background image**

```bash
cp "images/Something Fun is coming.png" public/images/coming-soon-bg.png
```

- [ ] **Step 2: Build ComingSoon component**

`"use client"` — needs form state. Full-bleed background image with dark navy overlay (88% opacity) + `backdrop-blur-sm` + CSS grid line pattern overlay (1px white lines at 10% opacity, 60px spacing). Section header: pixel label `// LOADING NEW QUESTS...`, title "More Packages Coming Soon". Email input + "Notify Me" button → POST `/api/subscribe`. On success: replace form with "You're on the list! We'll notify you when new packages drop." Three Locked Quest cards with silhouette icons (DropletIcon blue glow, FilmIcon gold glow, GlobeIcon green glow), frosted glass (`bg-white/5 backdrop-blur-md border border-white/10`), LockIcon + "LOCKED" pixel label, teaser hints ("Splash Zone?", "Movie Night?", "Field Day?"). Hover brightens border with gold. Ref spec section 6.

- [ ] **Step 3: Add to page.tsx, verify**

Email form submits (check console for log). Locked quest cards render with hover effects.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ComingSoon.tsx public/images/coming-soon-bg.png src/app/page.tsx
git commit -m "feat: add Coming Soon section with locked quest cards and email signup"
```

---

### Task 16: Reserve Form

**Files:**
- Create: `src/app/components/ReserveForm.tsx` (main form container + submission logic)
- Create: `src/app/components/PackagePicker.tsx` (visual package selection cards)
- Create: `src/app/components/PricingSummary.tsx` (live total display)

This is the most complex section — split into sub-components for manageability.

- [ ] **Step 1: Build PackagePicker component**

Props: `packages: { nerfWar: boolean, lawnGames: boolean }`, `onToggle: (pkg: "nerfWar" | "lawnGames") => void`. Two clickable cards side by side. Each card shows package name, brief description, and price. Selected state: blue border, checkmark badge, tinted background. Similar interaction pattern to GameCard.

- [ ] **Step 2: Build PricingSummary component**

Props: `packages`, `lawnGameCount`, `selectedGames: string[]`, `pickupDate: string`. Displays: selected packages list, calculated total from `calculateTotal()`, weekend dates from `formatWeekend()` if pickupDate is set. Uses gradient-text-gold for the total.

- [ ] **Step 3: Build ReserveForm component**

`"use client"` directive. Form state with `useState`:
- `name`, `email`, `phone`, `city`, `message`, `estimatedGuests`, `pickupDate`
- `packages: { nerfWar: boolean, lawnGames: boolean }`
- `selectedGames: Set<string>`
- `errors: Record<string, string>`
- `status: "idle" | "loading" | "success" | "error"`

Accepts optional props for pre-selection from cross-section CTAs:
- `initialPackages?: { nerfWar?: boolean, lawnGames?: boolean }`
- `initialGames?: string[]`

Uses `useEffect` to apply initial values when props change.

Key behaviors:
- Package selection via PackagePicker
- When lawn games selected: mini GameCard grid appears for game sub-selection (max 4)
- Date input: on change, if not Friday, auto-snap to nearest Friday via `getNextFriday()` and show helper text "Pickup is on Fridays — we've adjusted to the nearest Friday."
- Live total via PricingSummary above submit button
- Submit: client-side validation first (using `validateReservation` from lib), then POST to `/api/reserve`
- Success: replace form with confirmation message per spec
- Error: inline error above submit, form data preserved

Gold left accent stripe (5px gradient) on the container card. Ref spec section 9, API Routes section.

- [ ] **Step 4: Add to page.tsx with `id="reserve"`, verify**

Test full flow: select packages, pick games, enter date (try non-Friday), fill fields, submit. Check console for reservation log.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/ReserveForm.tsx src/app/components/PackagePicker.tsx src/app/components/PricingSummary.tsx src/app/page.tsx
git commit -m "feat: add ReserveForm with validation, live pricing, and API submission"
```

---

## Chunk 5: Polish and Launch Prep

### Task 17: Scroll reveal animations

**Files:**
- Create: `src/app/components/ScrollReveal.tsx`
- Modify: `src/app/page.tsx` (wrap sections)
- Modify: `src/app/globals.css` (add reveal keyframes)

- [ ] **Step 1: Add reveal animation to globals.css**

Add to `@layer components`:
```css
.reveal-hidden {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Build ScrollReveal wrapper**

`"use client"` component. Uses `useRef` + `useEffect` with IntersectionObserver (threshold 0.1). Adds `reveal-hidden` class initially, swaps to `reveal-visible` when intersecting. Stagger children by 80ms using `transitionDelay` on each child element.

- [ ] **Step 3: Wrap each section in page.tsx with ScrollReveal**

- [ ] **Step 4: Verify smooth scroll-reveal on page scroll**

- [ ] **Step 5: Commit**

```bash
git add src/app/components/ScrollReveal.tsx src/app/globals.css src/app/page.tsx
git commit -m "feat: add scroll reveal animations to all sections"
```

---

### Task 18: Assemble final page.tsx and cross-link sections

**Files:**
- Modify: `src/app/page.tsx` (add state + section IDs)
- Modify: `src/app/components/NerfPackage.tsx` (accept onReserve callback)
- Modify: `src/app/components/LawnGames.tsx` (accept onReserve callback, expose selected games)
- Modify: `src/app/components/ReserveForm.tsx` (accept initialPackages/initialGames props)

- [ ] **Step 1: Lift pre-selection state to page.tsx**

Make page.tsx a `"use client"` component. Add state:
```tsx
const [reservePreselect, setReservePreselect] = useState<{
  packages: { nerfWar: boolean; lawnGames: boolean };
  games: string[];
}>({ packages: { nerfWar: false, lawnGames: false }, games: [] });
```

Pass callbacks to NerfPackage and LawnGames:
- `NerfPackage onReserve={() => { setReservePreselect(prev => ({ ...prev, packages: { ...prev.packages, nerfWar: true } })); }}` — then scroll to `#reserve`
- `LawnGames onReserve={(games) => { setReservePreselect(prev => ({ ...prev, packages: { ...prev.packages, lawnGames: true }, games })); }}` — then scroll to `#reserve`

Pass to ReserveForm: `initialPackages={reservePreselect.packages} initialGames={reservePreselect.games}`

- [ ] **Step 2: Add section IDs to all sections**

`id="nerf-package"`, `id="lawn-games"`, `id="how-it-works"`, `id="faq"`, `id="reviews"`, `id="reserve"`, `id="coming-soon"`

- [ ] **Step 3: Verify all cross-links work**

Click every CTA and nav link — should smooth-scroll to correct section. Nerf CTA should pre-select Nerf War in the form. Lawn Games CTA should pre-select lawn games with chosen games.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/components/NerfPackage.tsx src/app/components/LawnGames.tsx src/app/components/ReserveForm.tsx
git commit -m "feat: wire up cross-section navigation and package pre-selection"
```

---

### Task 19: Image optimization and final asset prep

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Configure Next.js image optimization**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Ensure all images use Next.js `<Image>` component**

Verify all `<img>` tags in components are replaced with `next/image` `<Image>` with proper `width`, `height`, and `alt` attributes.

- [ ] **Step 3: Run build to check for errors**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Run Lighthouse audit**

Open the production build (`npm run start`), run Lighthouse in Chrome DevTools. Target: 90+ Performance, 100 Accessibility.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts src/
git commit -m "chore: optimize images and verify production build"
```

---

### Task 20: Final review and cleanup

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 2: Test on mobile viewport (375px)**

Verify: single-column layouts, hamburger menu, sticky bar, form usability.

- [ ] **Step 3: Test reservation form end-to-end**

Submit a test reservation, verify console log (or email if Resend configured).

- [ ] **Step 4: Test email subscribe end-to-end**

Submit a test email in Coming Soon, verify console log.

- [ ] **Step 5: Final commit (if any changes were made)**

```bash
git add src/ public/ next.config.ts tailwind.config.ts
git commit -m "chore: final cleanup and polish"
```
