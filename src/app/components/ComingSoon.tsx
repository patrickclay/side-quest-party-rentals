"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { LockIcon, PackageIcon, FilmIcon, StarIcon, SendIcon } from "./ui/Icons";

const lockedQuests = [
  {
    icon: PackageIcon,
    glow: "shadow-[0_0_20px_rgba(245,166,35,.3)]",
    hint: "Snack Machines",
    color: "text-quest-orange",
  },
  {
    icon: FilmIcon,
    glow: "shadow-[0_0_20px_rgba(245,166,35,.3)]",
    hint: "Movie Night",
    color: "text-quest-gold",
  },
  {
    icon: StarIcon,
    glow: "shadow-[0_0_20px_rgba(220,38,38,.3)]",
    hint: "Red Carpet Event",
    color: "text-hero-red",
  },
];

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="coming-soon" className="relative py-24 px-5 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/coming-soon-bg.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/[.88] backdrop-blur-sm" />

      {/* Grid line pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.1) 59px, rgba(255,255,255,0.1) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.1) 59px, rgba(255,255,255,0.1) 60px)",
        }}
      />

      <div className="relative z-10 max-w-[var(--max-width-content)] mx-auto text-center">
        <SectionLabel className="justify-center text-quest-gold">// LOADING NEW QUESTS...</SectionLabel>
        <SectionTitle className="text-white mb-6">More Packages Coming Soon</SectionTitle>

        {/* Email capture */}
        <div className="max-w-md mx-auto mb-14">
          {status === "success" ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4">
              <p className="text-white font-body text-sm">
                You are on the list! We will notify you when new packages drop.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 font-body text-sm outline-none focus:border-quest-gold/60 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 gradient-bg-gold text-navy font-heading font-bold text-sm rounded-xl px-6 py-3 hover:-translate-y-[2px] transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(245,166,35,.35)]"
              >
                <SendIcon className="w-4 h-4" />
                {status === "loading" ? "..." : "Notify Me"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-hero-red text-xs mt-2 font-body">Something went wrong. Please try again.</p>
          )}
        </div>

        {/* Locked Quest cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
          {lockedQuests.map((quest) => (
            <div
              key={quest.hint}
              className={`
                bg-white/5 backdrop-blur-md border border-white/10 rounded-[16px] p-6 flex flex-col items-center gap-3
                hover:border-quest-gold/40 transition-all duration-300
                ${quest.glow}
              `}
            >
              <quest.icon className={`w-10 h-10 ${quest.color}`} />

              <div className="flex items-center gap-1.5">
                <LockIcon className="w-3.5 h-3.5 text-white/50" />
                <span className="font-pixel text-[8px] text-white/50 tracking-[1.5px]">LOCKED</span>
              </div>

              <p className="text-white/70 font-body text-sm">{quest.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
