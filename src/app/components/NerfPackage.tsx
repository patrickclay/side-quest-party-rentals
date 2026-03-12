import { SectionLabel } from "./ui/SectionLabel";
import { CheckIcon, ArrowRightIcon } from "./ui/Icons";
import { PhotoGallery } from "./PhotoGallery";

const galleryImages = [
  { src: "/images/nerf-guns.png", alt: "Nerf blasters collection", label: "25 Nerf Blasters" },
  { src: "/images/barrier-closeup.png", alt: "Inflatable Nerf barriers", label: "Barriers" },
  { src: "/images/nerf-package-promo.png", alt: "Nerf War Party Package", label: "Full Package" },
  { src: "/images/safety-glasses.png", alt: "Safety glasses included", label: "Safety Gear" },
];

const includes = [
  "25 Nerf blasters",
  "250 Nerf darts",
  "8 inflatable Nerf barriers",
  "Electric air pump",
  "Safety glasses included",
  "Full weekend rental",
];

interface NerfPackageProps {
  onReserve?: () => void;
}

export function NerfPackage({ onReserve }: NerfPackageProps) {
  const handleCTA = () => {
    if (onReserve) {
      onReserve();
    } else {
      document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="nerf-package" className="py-20 px-5">
      <div className="max-w-[var(--max-width-content)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
          {/* Left: Photo Gallery */}
          <PhotoGallery images={galleryImages} />

          {/* Right: Package Details */}
          <div className="flex flex-col">
            <SectionLabel>// FEATURED QUEST</SectionLabel>

            {/* Most Popular Badge */}
            <div className="mb-3">
              <span className="inline-block bg-gradient-to-r from-hero-red to-red-600 text-white font-pixel text-[9px] tracking-[1.5px] px-3 py-1.5 rounded-md animate-badge-pulse">
                MOST POPULAR
              </span>
            </div>

            {/* Package Name */}
            <h2 className="font-heading font-bold text-[28px] md:text-[34px] text-navy leading-tight mb-4">
              Nerf War Party Package
            </h2>

            {/* Description */}
            <p className="text-text-secondary text-base leading-relaxed mb-6">
              Everything you need for an epic backyard Nerf battle. Perfect for
              birthday parties, cookouts, and weekend fun. Just pick up on Friday
              and return on Monday -- it is that simple.
            </p>

            {/* Includes Checklist */}
            <div className="flex flex-col gap-3 mb-8">
              {includes.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3.5 h-3.5 text-forest-green" />
                  </div>
                  <span className="text-navy font-body text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="gradient-text-gold font-heading font-bold text-[48px] leading-none">
                $60
              </span>
              <p className="text-text-secondary text-sm mt-1">full weekend rental</p>
              <p className="text-text-secondary text-xs mt-0.5">$2.50/kid for a party of 24</p>
            </div>

            {/* CTA */}
            <button
              onClick={handleCTA}
              className="w-full inline-flex items-center justify-center gap-2 font-heading font-bold text-base rounded-xl gradient-bg-gold text-navy px-8 py-4 shadow-[0_4px_24px_rgba(245,166,35,.45)] hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(245,166,35,.6)] transition-all duration-200 cursor-pointer relative overflow-hidden"
            >
              Reserve Nerf War Package
              <ArrowRightIcon className="w-5 h-5" />
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
