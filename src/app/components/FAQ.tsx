"use client";

import { useState } from "react";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { ChevronDownIcon } from "./ui/Icons";

const faqs = [
  {
    q: "How does the rental period work?",
    a: "Pick up your rental package on Friday and return it on Monday \u2014 you get the full weekend! This gives you plenty of time for setup, your event, and cleanup.",
  },
  {
    q: "Where do I pick up and return?",
    a: "You'll pick up and return everything at our home in Lilburn, GA. We'll share the exact address after your reservation is confirmed.",
  },
  {
    q: "What if something breaks or gets damaged?",
    a: "Normal wear and tear is totally fine \u2014 that's what the equipment is for! If anything gets significantly damaged, we'll work with you on a case-by-case basis. No surprise fees.",
  },
  {
    q: "Do you deliver?",
    a: "We're pickup-only for now to keep prices low. We may add delivery in the future \u2014 sign up for our newsletter to stay in the loop!",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 1 month ahead. Popular weekends (holidays, end of school year) book up fast, so the earlier the better.",
  },
  {
    q: "What's included in each package?",
    a: "Everything listed on the package card is included \u2014 no hidden fees, no extra charges. What you see is what you get.",
  },
  {
    q: "Can I combine packages?",
    a: "Absolutely! Nerf War + Lawn Games makes for the ultimate party. Select both when you reserve and we'll have everything ready for you.",
  },
  {
    q: "What's your service area?",
    a: "We serve the greater Atlanta area \u2014 Lilburn, Snellville, Lawrenceville, Duluth, Norcross, Stone Mountain, Tucker, and surrounding communities.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Cancel 7+ days before your pickup date for a full refund. Within 7 days, we'll offer credit toward a future rental.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-bg-light py-20 px-5">
      <div className="max-w-[700px] mx-auto">
        <div className="text-center">
          <SectionLabel className="justify-center">// SIDE QUESTS ANSWERED</SectionLabel>
          <SectionTitle className="mb-12">Frequently Asked Questions</SectionTitle>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-xl shadow-[var(--card-shadow)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                >
                  <span className="font-heading font-bold text-navy text-[15px]">
                    {faq.q}
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-quest-gold flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[300px]" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-5 text-text-secondary text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
