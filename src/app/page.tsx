import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Reviews } from "./components/Reviews";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { MobileStickyBar } from "./components/MobileStickyBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        {/* Nerf Package and Lawn Games go here later */}
        {/* Coming Soon goes here later */}
        <Reviews />
        <FAQ />
        {/* Reserve Form goes here later */}
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
