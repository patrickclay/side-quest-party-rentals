import { PhoneIcon } from "./ui/Icons";

export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-navy/95 backdrop-blur-md border-t border-white/10">
      <div className="flex gap-2 p-3">
        <a
          href="tel:7705550199"
          className="flex items-center justify-center gap-2 bg-royal-blue text-white font-heading font-bold text-sm rounded-xl py-3 w-[40%] hover:brightness-110 transition-all"
        >
          <PhoneIcon className="w-4 h-4" />
          Call
        </a>
        <a
          href="#reserve"
          className="flex items-center justify-center gap-2 gradient-bg-gold text-navy font-heading font-bold text-sm rounded-xl py-3 w-[60%] hover:brightness-110 transition-all"
        >
          Reserve Now
        </a>
      </div>
    </div>
  );
}
