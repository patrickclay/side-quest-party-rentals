import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        {/* Nerf Package and Lawn Games go here later */}
        {/* Coming Soon goes here later */}
        {/* Reviews goes here */}
        {/* FAQ goes here */}
        {/* Reserve Form goes here later */}
      </main>
    </>
  );
}
