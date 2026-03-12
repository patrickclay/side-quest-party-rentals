import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { StarIcon } from "./ui/Icons";

/* PLACEHOLDER -- replace with real reviews */
const testimonials = [
  {
    quote:
      "Side Quest made our son's birthday unforgettable! The Nerf war package was a huge hit with all 15 kids. Setup was easy and everything was clean and ready to go.",
    author: "Sarah M.",
    location: "Lilburn",
  },
  {
    quote:
      "We rented the lawn games for our family reunion and everyone had a blast. Giant Jenga and Cornhole were the favorites. Great value for a full weekend!",
    author: "Marcus T.",
    location: "Snellville",
  },
  {
    quote:
      "So easy! Picked everything up on Friday, had an amazing party Saturday, and returned Monday. The kids are already asking when we can do it again.",
    author: "Jennifer K.",
    location: "Lawrenceville",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="bg-white py-20 px-5">
      <div className="max-w-[var(--max-width-content)] mx-auto text-center">
        <SectionLabel className="justify-center">// QUEST REVIEWS</SectionLabel>
        <SectionTitle className="mb-12">What Parents Are Saying</SectionTitle>

        <div className="flex flex-col md:flex-row gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative flex-1 bg-white rounded-2xl p-8 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1 transition-all duration-200 text-left"
            >
              {/* Decorative opening quote */}
              <span className="absolute top-4 left-6 text-quest-gold/10 text-[60px] font-heading font-bold leading-none select-none">
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <StarIcon key={j} className="w-5 h-5 text-quest-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-text-secondary italic leading-relaxed mb-6 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <p className="font-heading font-bold text-navy text-sm">
                {t.author}
              </p>
              <p className="text-text-muted text-xs">{t.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
