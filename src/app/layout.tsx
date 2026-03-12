import type { Metadata } from "next";
import { Chakra_Petch, DM_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";

const heading = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading-var",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-var",
  display: "swap",
});

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixel-var",
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
