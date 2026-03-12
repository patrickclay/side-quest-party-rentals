interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2 className={`font-heading font-bold text-[28px] md:text-[40px] text-navy mb-2.5 ${className}`}>
      {children}
    </h2>
  );
}
