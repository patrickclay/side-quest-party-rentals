import { calculateTotal, formatWeekend } from "@/app/lib/pricing";

interface PricingSummaryProps {
  packages: { nerfWar: boolean; lawnGames: boolean };
  lawnGameCount: number;
  selectedGames: string[];
  pickupDate: string;
}

export function PricingSummary({ packages, lawnGameCount, selectedGames, pickupDate }: PricingSummaryProps) {
  const total = calculateTotal(packages, lawnGameCount);
  const hasSelection = packages.nerfWar || packages.lawnGames;

  if (!hasSelection) return null;

  return (
    <div className="bg-bg-light rounded-[14px] p-5 mb-6">
      <h4 className="font-heading font-bold text-navy text-sm mb-3">Order Summary</h4>

      <div className="flex flex-col gap-2 text-sm font-body">
        {packages.nerfWar && (
          <div className="flex justify-between">
            <span className="text-text-secondary">Nerf War Package</span>
            <span className="text-navy font-medium">$60</span>
          </div>
        )}
        {packages.lawnGames && lawnGameCount > 0 && (
          <div className="flex justify-between">
            <span className="text-text-secondary">
              Lawn Games ({lawnGameCount})
              {selectedGames.length > 0 && (
                <span className="text-xs block text-text-secondary/60 mt-0.5">
                  {selectedGames.join(", ")}
                </span>
              )}
            </span>
            <span className="text-navy font-medium">
              ${calculateTotal({ nerfWar: false, lawnGames: true }, lawnGameCount)}
            </span>
          </div>
        )}

        {pickupDate && (
          <div className="text-xs text-text-secondary mt-1 pt-2 border-t border-border-light">
            {formatWeekend(pickupDate)}
          </div>
        )}

        <div className="flex justify-between items-end pt-2 border-t border-border-light mt-1">
          <span className="text-navy font-heading font-bold text-sm">Total</span>
          <span className="gradient-text-gold font-heading font-bold text-3xl">${total}</span>
        </div>
      </div>
    </div>
  );
}
