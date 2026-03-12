"use client";

import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { NerfPackage } from "./components/NerfPackage";
import { LawnGames } from "./components/LawnGames";
import { ComingSoon } from "./components/ComingSoon";
import { Reviews } from "./components/Reviews";
import { FAQ } from "./components/FAQ";
import { ReserveForm } from "./components/ReserveForm";
import { Footer } from "./components/Footer";
import { MobileStickyBar } from "./components/MobileStickyBar";
import { ScrollReveal } from "./components/ScrollReveal";

export default function Home() {
  const [reservePreselect, setReservePreselect] = useState<{
    packages: { nerfWar: boolean; lawnGames: boolean };
    games: string[];
  }>({ packages: { nerfWar: false, lawnGames: false }, games: [] });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal>
          <NerfPackage onReserve={() => {
            setReservePreselect(prev => ({ ...prev, packages: { ...prev.packages, nerfWar: true } }));
            document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' });
          }} />
        </ScrollReveal>
        <ScrollReveal>
          <LawnGames onReserve={(games) => {
            setReservePreselect(prev => ({ ...prev, packages: { ...prev.packages, lawnGames: true }, games }));
            document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' });
          }} />
        </ScrollReveal>
        <ScrollReveal>
          <ComingSoon />
        </ScrollReveal>
        <ScrollReveal>
          <Reviews />
        </ScrollReveal>
        <ScrollReveal>
          <FAQ />
        </ScrollReveal>
        <ScrollReveal>
          <ReserveForm initialPackages={reservePreselect.packages} initialGames={reservePreselect.games} />
        </ScrollReveal>
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
