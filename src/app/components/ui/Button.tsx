import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonAsLink = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-heading font-bold text-base rounded-xl transition-all duration-200 cursor-pointer";

  const variants = {
    primary:
      "gradient-bg-gold text-navy px-8 py-4 shadow-[0_4px_24px_rgba(245,166,35,.45)] hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(245,166,35,.6)] relative overflow-hidden",
    secondary:
      "border-2 border-white/50 text-white px-8 py-4 bg-white/[.08] backdrop-blur-lg hover:bg-white/[.15] hover:border-white hover:-translate-y-[2px]",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
        {variant === "primary" && (
          <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
        )}
      </a>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
      {variant === "primary" && (
        <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
      )}
    </button>
  );
}
