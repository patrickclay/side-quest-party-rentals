import Image from "next/image";
import { Button } from "./ui/Button";
import { PhoneIcon, ShieldCheckIcon, DollarIcon, MapPinIcon } from "./ui/Icons";

const trustItems = [
  { icon: ShieldCheckIcon, text: "Full Weekend Rental" },
  { icon: DollarIcon, text: "Starting at $20" },
  { icon: ShieldCheckIcon, text: "Cleaned & Sanitized" },
  { icon: MapPinIcon, text: "Lilburn GA" },
];

const confettiColors = [
  "bg-quest-gold",
  "bg-hero-red",
  "bg-royal-blue",
  "bg-forest-green",
  "bg-quest-orange",
  "bg-quest-gold",
  "bg-hero-red",
  "bg-royal-blue",
];

const confettiPositions = [
  { left: "10%", width: 8, height: 8, delay: "0s" },
  { left: "25%", width: 6, height: 10, delay: "1s" },
  { left: "40%", width: 10, height: 6, delay: "2.5s" },
  { left: "55%", width: 7, height: 7, delay: "0.8s" },
  { left: "65%", width: 9, height: 8, delay: "3.2s" },
  { left: "75%", width: 6, height: 9, delay: "1.6s" },
  { left: "85%", width: 8, height: 6, delay: "4s" },
  { left: "92%", width: 7, height: 10, delay: "2s" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/[.93] to-navy/[.15]" />

      {/* Confetti particles */}
      {confettiPositions.map((pos, i) => (
        <div
          key={i}
          className={`absolute rounded-sm ${confettiColors[i]} opacity-0 animate-confetti-fall`}
          style={{
            left: pos.left,
            width: pos.width,
            height: pos.height,
            animationDelay: pos.delay,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-[var(--max-width-content)] mx-auto px-5 w-full py-24">
        <div className="max-w-[600px]">
          {/* Pixel label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-quest-gold" />
            <span className="font-pixel text-[10px] text-quest-gold tracking-[2px]">
              // NOW SERVING GREATER ATLANTA
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-bold text-[44px] md:text-[64px] leading-[1.05] mb-5">
            <span className="text-white">Level Up</span>
            <br />
            <span className="gradient-text-gold">Your Party.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-[520px]">
            Everything you need for{" "}
            <span className="text-white font-bold">epic birthdays</span>,
            cookouts, and backyard battles — delivered for a full weekend
            starting at just{" "}
            <span className="text-white font-bold">$20</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-10">
            <Button href="#nerf-package" variant="primary">
              Browse Packages
            </Button>
            <Button href="tel:7705550199" variant="secondary">
              <PhoneIcon className="w-5 h-5" />
              Call or Text Us
            </Button>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                <item.icon className="w-4 h-4 text-quest-gold" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating logo badge — md+ only */}
      <div className="hidden md:block absolute bottom-16 right-[8%] animate-float-bounce drop-shadow-2xl">
        <Image
          src="/logo.png"
          alt="Side Quest Party Rentals"
          width={180}
          height={180}
          className="w-[180px] h-auto"
        />
      </div>
    </section>
  );
}
