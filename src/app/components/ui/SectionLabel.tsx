interface SectionLabelProps {
  children: string;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div className={`font-pixel text-[10px] text-quest-gold tracking-[2px] mb-3 ${className}`}>
      {children}
    </div>
  );
}
