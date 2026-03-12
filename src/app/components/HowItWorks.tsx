import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { TargetIcon, CalendarIcon, PackageIcon, GiftIcon } from "./ui/Icons";

const steps = [
  {
    icon: TargetIcon,
    title: "Choose Your Quest",
    desc: "Browse our packages and pick your adventure",
  },
  {
    icon: CalendarIcon,
    title: "Pick Your Weekend",
    desc: "Select a Friday for pickup, return Monday",
  },
  {
    icon: PackageIcon,
    title: "Grab & Go",
    desc: "Pick up everything from our place in Lilburn",
  },
  {
    icon: GiftIcon,
    title: "Party Time",
    desc: "Set up, play, and make memories",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-bg-light py-20 px-5">
      <div className="max-w-[var(--max-width-content)] mx-auto text-center">
        <SectionLabel className="justify-center">// THE QUEST LOG</SectionLabel>
        <SectionTitle className="mb-12">How It Works</SectionTitle>

        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-8 items-stretch justify-center">
          {steps.map((step, i) => (
            <div key={step.title} className="relative flex-1 min-w-[200px] sm:max-w-[calc(50%-1rem)] lg:max-w-none">
              {/* Dashed connector line — desktop only, between cards */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t-2 border-dashed border-quest-gold/30 z-0" />
              )}

              {/* Card */}
              <div className="relative z-10 bg-white rounded-2xl p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1 transition-all duration-200">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full gradient-bg-gold flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-navy" />
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-navy text-base mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
