"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
}

export function ScrollReveal({ children, className, stagger = true }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal-hidden");

    if (stagger) {
      const directChildren = el.children;
      for (let i = 0; i < directChildren.length; i++) {
        (directChildren[i] as HTMLElement).style.transitionDelay = `${i * 80}ms`;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-hidden");
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
