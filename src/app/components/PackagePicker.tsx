import { GamepadIcon, TargetIcon, CheckIcon } from "./ui/Icons";

interface PackagePickerProps {
  packages: { nerfWar: boolean; lawnGames: boolean };
  onToggle: (pkg: "nerfWar" | "lawnGames") => void;
}

const pkgOptions = [
  { key: "nerfWar" as const, icon: GamepadIcon, label: "Nerf War Package", price: "$60" },
  { key: "lawnGames" as const, icon: TargetIcon, label: "Giant Lawn Games", price: "From $20" },
];

export function PackagePicker({ packages, onToggle }: PackagePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {pkgOptions.map((pkg) => {
        const selected = packages[pkg.key];
        return (
          <button
            key={pkg.key}
            type="button"
            onClick={() => onToggle(pkg.key)}
            className={`
              relative flex flex-col items-center gap-2 p-5 rounded-[14px] border-2 transition-all duration-200 cursor-pointer
              ${selected
                ? "border-royal-blue bg-royal-blue/[.06] shadow-[0_2px_12px_rgba(43,94,167,.15)]"
                : "border-border-light bg-white hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1"
              }
            `}
          >
            {selected && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-royal-blue flex items-center justify-center shadow-md">
                <CheckIcon className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <pkg.icon className={`w-8 h-8 ${selected ? "text-royal-blue" : "text-navy/60"}`} />
            <span className={`font-heading font-bold text-sm ${selected ? "text-royal-blue" : "text-navy"}`}>
              {pkg.label}
            </span>
            <span className="text-text-secondary text-xs">{pkg.price}</span>
          </button>
        );
      })}
    </div>
  );
}
