"use client";

import { useState, useEffect, useCallback } from "react";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { ArrowRightIcon } from "./ui/Icons";
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
import { GameCard } from "./GameCard";
import { GAMES, MAX_GAMES, PRICING } from "@/app/lib/pricing";

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

const tiers = [
  { count: 1, label: "1 Game", price: 20, perGame: "$20/game", badge: null },
  { count: 2, label: "2 Games", price: 35, perGame: "$17.50/game", badge: null },
  { count: 3, label: "3 Games", price: 50, perGame: "$16.67/game", badge: "POPULAR" },
  { count: 4, label: "4 Games", price: 60, perGame: "$15/game", badge: "BEST VALUE" },
];

interface LawnGamesProps {
  onReserve?: (selectedGameIds: string[]) => void;
}

export function LawnGames({ onReserve }: LawnGamesProps) {
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [maxMessage, setMaxMessage] = useState<string | null>(null);

  const handleToggle = useCallback(
    (id: string) => {
      setSelectedGames((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (next.size >= MAX_GAMES) {
            setMaxMessage(`Max ${MAX_GAMES} games per rental weekend`);
            return prev;
          }
          next.add(id);
        }
        return next;
      });
    },
    []
  );

  useEffect(() => {
    if (!maxMessage) return;
    const t = setTimeout(() => setMaxMessage(null), 2000);
    return () => clearTimeout(t);
  }, [maxMessage]);

  const count = selectedGames.size;
  const activeTier = count > 0 ? Math.min(count, MAX_GAMES) : 0;

  const handleCTA = () => {
    const ids = Array.from(selectedGames);
    if (onReserve) {
      onReserve(ids);
    } else {
      document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="lawn-games"
      className="relative bg-bg-light py-20 px-5"
    >
      {/* Animated rainbow gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-1 animate-gradient-slide"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #F5A623, #E74C3C, #2B5EA7, #2ECC71, #F39C12, #F5A623)",
          backgroundSize: "200% 100%",
        }}
      />

      <div className="max-w-[var(--max-width-content)] mx-auto">
        <div className="text-center mb-12">
          <SectionLabel className="justify-center">// CHOOSE YOUR GAMES</SectionLabel>
          <SectionTitle>Giant Lawn Games</SectionTitle>
        </div>

        {/* Max games message */}
        {maxMessage && (
          <div className="text-center mb-4">
            <span className="inline-block bg-quest-orange/10 text-quest-orange font-body text-sm px-4 py-2 rounded-lg">
              {maxMessage}
            </span>
          </div>
        )}

        {/* Game Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {GAMES.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              name={game.name}
              icon={GAME_ICONS[game.id]}
              selected={selectedGames.has(game.id)}
              onToggle={handleToggle}
              disabled={false}
            />
          ))}
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {tiers.map((tier) => {
            const isActive = activeTier === tier.count;
            const isBestValue = tier.badge === "BEST VALUE";
            return (
              <div
                key={tier.count}
                className={`
                  relative rounded-[14px] p-4 text-center border-2 transition-all duration-200
                  ${isActive
                    ? "border-royal-blue bg-royal-blue/[.06] shadow-[0_2px_16px_rgba(43,94,167,.15)]"
                    : "border-border-light bg-white"
                  }
                  ${isBestValue ? "scale-105" : ""}
                `}
              >
                {tier.badge && (
                  <span
                    className={`
                      absolute -top-2.5 left-1/2 -translate-x-1/2 font-pixel text-[8px] tracking-[1px] px-2 py-0.5 rounded
                      ${tier.badge === "BEST VALUE"
                        ? "bg-gradient-to-r from-quest-gold to-quest-orange text-navy"
                        : "bg-royal-blue text-white"
                      }
                    `}
                  >
                    {tier.badge}
                  </span>
                )}
                <div className={`font-heading font-bold text-lg ${isActive ? "text-royal-blue" : "text-navy"}`}>
                  {tier.label}
                </div>
                <div className={`font-heading font-bold text-2xl ${isActive ? "gradient-text-gold" : "text-navy/80"}`}>
                  ${tier.price}
                </div>
                <div className="text-text-secondary text-xs mt-1">{tier.perGame}</div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleCTA}
            disabled={count === 0}
            className={`
              inline-flex items-center justify-center gap-2 font-heading font-bold text-base rounded-xl px-8 py-4 transition-all duration-200 cursor-pointer relative overflow-hidden
              ${count > 0
                ? "gradient-bg-gold text-navy shadow-[0_4px_24px_rgba(245,166,35,.45)] hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(245,166,35,.6)]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {count > 0 ? `Reserve ${count} Lawn Game${count > 1 ? "s" : ""}` : "Select Games to Continue"}
            <ArrowRightIcon className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
