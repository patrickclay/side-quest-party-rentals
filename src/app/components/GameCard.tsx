import { SVGProps } from "react";
import { CheckIcon } from "./ui/Icons";

interface GameCardProps {
  id: string;
  name: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  selected: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
}

export function GameCard({ id, name, icon: Icon, selected, onToggle, disabled }: GameCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center gap-2 p-5 rounded-[14px] border-2 transition-all duration-200 cursor-pointer
        ${selected
          ? "border-royal-blue bg-royal-blue/[.06] shadow-[0_2px_12px_rgba(43,94,167,.15)]"
          : "border-border-light bg-white hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1"
        }
        ${disabled ? "opacity-40 pointer-events-none" : ""}
      `}
    >
      {/* Checkmark badge */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-royal-blue flex items-center justify-center shadow-md">
          <CheckIcon className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      <Icon className={`w-8 h-8 ${selected ? "text-royal-blue" : "text-navy/60"}`} />
      <span className={`font-body text-sm font-medium text-center ${selected ? "text-royal-blue" : "text-navy"}`}>
        {name}
      </span>
    </button>
  );
}
