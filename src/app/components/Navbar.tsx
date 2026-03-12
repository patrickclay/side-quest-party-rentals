"use client";

import { useState } from "react";
import Image from "next/image";
import { PhoneIcon, MenuIcon, XIcon } from "./ui/Icons";
import { Button } from "./ui/Button";

const navLinks = [
  { label: "Packages", href: "#nerf-package" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Reviews", href: "#reviews" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md h-[68px]">
      <div className="max-w-[var(--max-width-content)] mx-auto h-full px-5 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Side Quest Party Rentals"
            width={120}
            height={50}
            className="h-[50px] w-auto"
            priority
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-sm text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          <a
            href="tel:7705550199"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <PhoneIcon className="w-4 h-4" />
            (770) 555-0199
          </a>

          <Button href="#reserve" variant="primary" className="!py-2.5 !px-6 !text-sm">
            Reserve Now
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-navy border-t border-white/10">
          <div className="px-5 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-heading text-base text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}

            <a
              href="tel:7705550199"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <PhoneIcon className="w-4 h-4" />
              (770) 555-0199
            </a>

            <Button
              href="#reserve"
              variant="primary"
              className="!text-sm mt-2"
              onClick={() => setOpen(false)}
            >
              Reserve Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
