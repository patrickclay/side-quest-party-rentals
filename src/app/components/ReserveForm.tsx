"use client";

import { useState, useEffect } from "react";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { SendIcon } from "./ui/Icons";
import {
  ConnectFourIcon,
  AxeIcon,
  KerplunkIcon,
  JengaIcon,
  CornholeIcon,
  YardPongIcon,
  LadderBallIcon,
  TicTacToeIcon,
} from "./ui/Icons";
import { PackagePicker } from "./PackagePicker";
import { PricingSummary } from "./PricingSummary";
import { GameCard } from "./GameCard";
import { GAMES, MAX_GAMES, getNextFriday, isFriday } from "@/app/lib/pricing";
import { validateReservation, isValidEmail, ReservationData } from "@/app/lib/validation";
import { calculateTotal } from "@/app/lib/pricing";

const GAME_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "connect-4": ConnectFourIcon,
  "axe-throwing": AxeIcon,
  kerplunk: KerplunkIcon,
  "giant-jenga": JengaIcon,
  cornhole: CornholeIcon,
  "yard-pong": YardPongIcon,
  "ladder-ball": LadderBallIcon,
  "tic-tac-toe": TicTacToeIcon,
};

interface ReserveFormProps {
  initialPackages?: { nerfWar?: boolean; lawnGames?: boolean };
  initialGames?: string[];
}

export function ReserveForm({ initialPackages, initialGames }: ReserveFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [estimatedGuests, setEstimatedGuests] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dateHelper, setDateHelper] = useState("");
  const [packages, setPackages] = useState({ nerfWar: false, lawnGames: false });
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/availability")
      .then((res) => res.json())
      .then((data) => setBookedDates(new Set(data.bookedDates)))
      .catch(() => {});
  }, []);

  // Apply initial values when props change
  useEffect(() => {
    if (initialPackages) {
      setPackages({
        nerfWar: initialPackages.nerfWar ?? false,
        lawnGames: initialPackages.lawnGames ?? false,
      });
    }
  }, [initialPackages]);

  useEffect(() => {
    if (initialGames && initialGames.length > 0) {
      setSelectedGames(new Set(initialGames));
    }
  }, [initialGames]);

  const handlePackageToggle = (pkg: "nerfWar" | "lawnGames") => {
    setPackages((prev) => ({ ...prev, [pkg]: !prev[pkg] }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.packages;
      return next;
    });
  };

  const handleGameToggle = (id: string) => {
    setSelectedGames((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_GAMES) {
        next.add(id);
      }
      return next;
    });
  };

  const handleDateChange = (value: string) => {
    if (!value) {
      setPickupDate("");
      setDateHelper("");
      return;
    }

    let resolvedDate = value;
    if (isFriday(value)) {
      setDateHelper("");
    } else {
      const nextFri = getNextFriday(new Date(value));
      resolvedDate = nextFri.toISOString().split("T")[0];
      setDateHelper(`Pickup adjusted to Friday: ${resolvedDate}`);
    }

    if (bookedDates.has(resolvedDate)) {
      setPickupDate("");
      setDateHelper("");
      setErrors((prev) => ({ ...prev, pickupDate: "That weekend is already booked" }));
      return;
    }

    setPickupDate(resolvedDate);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.pickupDate;
      return next;
    });
  };

  const lawnGameCount = selectedGames.size;
  const totalPrice = calculateTotal(packages, lawnGameCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const data: ReservationData = {
      name,
      email,
      phone,
      city,
      packages,
      selectedGames: Array.from(selectedGames),
      lawnGameCount,
      pickupDate,
      estimatedGuests,
      message,
      totalPrice,
    };

    const result = validateReservation(data);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Submission failed");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <section id="reserve" className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-[var(--card-shadow)] p-10">
            <div className="w-16 h-16 rounded-full gradient-bg-gold flex items-center justify-center mx-auto mb-5">
              <SendIcon className="w-7 h-7 text-navy" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-navy mb-3">Reservation Submitted!</h3>
            <p className="text-text-secondary font-body leading-relaxed">
              We received your reservation request and will be in touch within 24 hours to confirm
              your weekend. Check your email at <strong className="text-navy">{email}</strong> for updates.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reserve" className="py-20 px-5">
      <div className="max-w-2xl mx-auto">
        {/* Card with gold left accent */}
        <div className="relative bg-white rounded-2xl shadow-[var(--card-shadow)] overflow-hidden">
          {/* Gold accent stripe */}
          <div className="absolute top-0 left-0 bottom-0 w-[5px] gradient-bg-gold" />

          <div className="p-8 md:p-10 pl-8 md:pl-10">
            <SectionLabel>// READY TO PLAY?</SectionLabel>
            <SectionTitle className="mb-8">Reserve Your Package</SectionTitle>

            <form onSubmit={handleSubmit} noValidate>
              {/* Contact fields - 2 column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((p) => { const n = {...p}; delete n.name; return n; }); }}
                    className={`w-full border-2 rounded-xl px-4 py-3 font-body text-sm text-navy outline-none transition-colors ${errors.name ? "border-hero-red" : "border-border-light focus:border-royal-blue"}`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-hero-red text-xs mt-1 font-body">{errors.name}</p>}
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => { const n = {...p}; delete n.email; return n; }); }}
                    className={`w-full border-2 rounded-xl px-4 py-3 font-body text-sm text-navy outline-none transition-colors ${errors.email ? "border-hero-red" : "border-border-light focus:border-royal-blue"}`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-hero-red text-xs mt-1 font-body">{errors.email}</p>}
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErrors((p) => { const n = {...p}; delete n.phone; return n; }); }}
                    className={`w-full border-2 rounded-xl px-4 py-3 font-body text-sm text-navy outline-none transition-colors ${errors.phone ? "border-hero-red" : "border-border-light focus:border-royal-blue"}`}
                    placeholder="(404) 395-6339"
                  />
                  {errors.phone && <p className="text-hero-red text-xs mt-1 font-body">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1.5">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setErrors((p) => { const n = {...p}; delete n.city; return n; }); }}
                    className={`w-full border-2 rounded-xl px-4 py-3 font-body text-sm text-navy outline-none transition-colors ${errors.city ? "border-hero-red" : "border-border-light focus:border-royal-blue"}`}
                    placeholder="Lilburn, GA"
                  />
                  {errors.city && <p className="text-hero-red text-xs mt-1 font-body">{errors.city}</p>}
                </div>
              </div>

              {/* Package Selection */}
              <div className="mb-6">
                <label className="block font-body text-sm font-medium text-navy mb-2">Select Packages</label>
                <PackagePicker packages={packages} onToggle={handlePackageToggle} />
                {errors.packages && <p className="text-hero-red text-xs mt-2 font-body">{errors.packages}</p>}
              </div>

              {/* Lawn game sub-selection */}
              {packages.lawnGames && (
                <div className="mb-6">
                  <label className="block font-body text-sm font-medium text-navy mb-2">
                    Choose Your Games (max {MAX_GAMES})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {GAMES.map((game) => (
                      <GameCard
                        key={game.id}
                        id={game.id}
                        name={game.name}
                        icon={GAME_ICONS[game.id]}
                        selected={selectedGames.has(game.id)}
                        onToggle={handleGameToggle}
                        disabled={!selectedGames.has(game.id) && selectedGames.size >= MAX_GAMES}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Date + Guests row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1.5">Pickup Date (Friday)</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className={`w-full border-2 rounded-xl px-4 py-3 font-body text-sm text-navy outline-none transition-colors ${errors.pickupDate ? "border-hero-red" : "border-border-light focus:border-royal-blue"}`}
                  />
                  {dateHelper && <p className="text-royal-blue text-xs mt-1 font-body">{dateHelper}</p>}
                  {errors.pickupDate && <p className="text-hero-red text-xs mt-1 font-body">{errors.pickupDate}</p>}
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1.5">Estimated Guests</label>
                  <select
                    value={estimatedGuests}
                    onChange={(e) => setEstimatedGuests(e.target.value)}
                    className="w-full border-2 border-border-light rounded-xl px-4 py-3 font-body text-sm text-navy outline-none focus:border-royal-blue transition-colors bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select range</option>
                    <option value="1-10">1-10</option>
                    <option value="11-20">11-20</option>
                    <option value="21-30">21-30</option>
                    <option value="30+">30+</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block font-body text-sm font-medium text-navy mb-1.5">Notes (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full border-2 border-border-light rounded-xl px-4 py-3 font-body text-sm text-navy outline-none focus:border-royal-blue transition-colors resize-none"
                  placeholder="Anything else we should know?"
                />
              </div>

              {/* Pricing Summary */}
              <PricingSummary
                packages={packages}
                lawnGameCount={lawnGameCount}
                selectedGames={Array.from(selectedGames)}
                pickupDate={pickupDate}
              />

              {/* Submit error */}
              {submitError && (
                <div className="bg-hero-red/10 border border-hero-red/20 rounded-xl px-4 py-3 mb-4">
                  <p className="text-hero-red text-sm font-body">{submitError}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className={`
                  w-full inline-flex items-center justify-center gap-2 font-heading font-bold text-base rounded-xl px-8 py-4 transition-all duration-200 relative overflow-hidden
                  ${status === "loading"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "gradient-bg-gold text-navy shadow-[0_4px_24px_rgba(245,166,35,.45)] hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(245,166,35,.6)] cursor-pointer"
                  }
                `}
              >
                <SendIcon className="w-5 h-5" />
                {status === "loading" ? "Submitting..." : "Submit Reservation"}
                {status !== "loading" && (
                  <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
