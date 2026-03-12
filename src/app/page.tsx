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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <NerfPackage />
        <LawnGames />
        <ComingSoon />
        <Reviews />
        <FAQ />
        <ReserveForm />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
