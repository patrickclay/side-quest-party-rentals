import Image from "next/image";
import { PhoneIcon, MapPinIcon } from "./ui/Icons";

const quickLinks = [
  { label: "Packages", href: "#nerf-package" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Reviews", href: "#reviews" },
  { label: "Reserve", href: "#reserve" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-navy to-[#141B30] pb-20 md:pb-0">
      {/* Rainbow gradient top border */}
      <div className="h-[3px] bg-gradient-to-r from-hero-red via-quest-gold to-royal-blue" />

      <div className="max-w-[var(--max-width-content)] mx-auto px-5 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="Side Quest Party Rentals"
              width={120}
              height={120}
              className="h-[120px] w-auto mb-4"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              Weekend party rental gear for epic backyard adventures in the
              greater Atlanta area.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>
                <a
                  href="tel:4043956339"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <PhoneIcon className="w-4 h-4 text-quest-gold" />
                  (404) 395-6339
                </a>
              </li>
              <li>
                <a
                  href="mailto:SideQuestPartyRentals@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  SideQuestPartyRentals@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-quest-gold" />
                Lilburn, GA
              </li>
              <li>Pickup: Fridays | Return: Mondays</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-white/60 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-4">
              Follow Us
            </h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>
                <a href="https://www.facebook.com/SideQuestPartyRentals/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/side.quest.party.rentals" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[var(--max-width-content)] mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
          <p>2026 Side Quest Party Rentals. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
