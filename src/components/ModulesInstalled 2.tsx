import React, { useEffect, useRef, useState } from "react";

interface Module {
  title: string;
  description: string;
}

const modules: Module[] = [
  {
    title: "Interface Design",
    description: "Product UI, dashboards, systems.",
  },
  {
    title: "Web Experiences",
    description: "Framer/Next-style sites, cinematic flows.",
  },
  {
    title: "Creative Direction",
    description: "Concept, narrative, visual identity.",
  },
  {
    title: "Motion & Interactive",
    description: "Prototyping, transitions, micro-UX.",
  },
  {
    title: "Design Systems",
    description: "Tokens, components, documentation.",
  },
  {
    title: "Brand Design",
    description: "Minimal, digital-first identities.",
  },
  {
    title: "Prototyping",
    description: "Flows, user journeys, testable concepts.",
  },
  {
    title: "Technical Integration",
    description: "Framer, React, Astro hand-off.",
  },
  {
    title: "Art Direction",
    description: "Visual language, campaign feel.",
  },
];

interface ModuleTileProps {
  module: Module;
  index: number;
  isVisible: boolean;
}

function ModuleTile({ module, index, isVisible }: ModuleTileProps) {
  // Determine mechanical accent type based on index
  const accentType = index % 3;
  const delay = index * 50; // Stagger delay in milliseconds

  return (
    <div
      className={`group relative aspect-[1/1] rounded-2xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-zinc-50 p-5 transition-all duration-300 ease-out hover:translate-y-[2px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3BD58B] focus-visible:ring-offset-2 shadow-[0_4px_12px_rgba(0,0,0,0.04)] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
        transitionDuration: "600ms",
        transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      tabIndex={0}
      role="listitem"
    >
      {/* Edge glow on hover */}
      <div
        className="absolute right-0 top-0 h-full w-1 rounded-r-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background: "linear-gradient(to bottom, rgba(59, 213, 139, 0.6), rgba(59, 213, 139, 0.2))",
          filter: "blur(4px)",
        }}
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div className="relative flex h-full flex-col justify-between">
        {/* Top section: Title and Accent */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-base font-bold uppercase leading-tight tracking-tight text-neutral-900 transition-all duration-200 group-hover:translate-y-[-1px] group-hover:font-extrabold md:text-lg">
              {module.title}
            </h3>
          </div>

          {/* Mechanical Accent - top-right */}
          <div className="flex-shrink-0" aria-hidden="true">
            {accentType === 0 && (
              // Circular knob base
              <div className="h-3 w-3 rounded-full bg-neutral-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" />
            )}
            {accentType === 1 && (
              // Vertical groove
              <div className="h-4 w-1 rounded-full bg-neutral-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]" />
            )}
            {accentType === 2 && (
              // LED dot
              <div className="h-2 w-2 rounded-full bg-[#3BD58B] opacity-60 shadow-[0_0_4px_rgba(59,213,139,0.4)]" />
            )}
          </div>
        </div>

        {/* Middle section: Description */}
        <div className="mt-3 flex-1">
          <p className="max-w-[90%] text-sm leading-relaxed text-neutral-600 md:text-base">
            {module.description}
          </p>
        </div>

        {/* Bottom section: Engraved seam line */}
        <div className="mt-auto pt-4">
          <div
            className="h-px w-16 rounded-full bg-neutral-300 opacity-50"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export default function ModulesInstalled() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-100px" }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={ref}
      id="modules-installed"
      className="w-full bg-white px-6 py-12 md:py-16 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <p
            className={`mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 transition-all duration-500 ease-out ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            System Capabilities
          </p>
          <h2
            className={`text-4xl font-light uppercase leading-none tracking-tight text-neutral-900 md:text-5xl lg:text-6xl transition-all duration-500 ease-out ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{
              transitionDelay: isInView ? "100ms" : "0ms",
            }}
          >
            Modules Installed
          </h2>
        </div>

        {/* Tiles Grid */}
        <ul
          className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-600 ${
            isInView ? "opacity-100" : "opacity-0"
          }`}
          role="list"
        >
          {modules.map((module, index) => (
            <li key={module.title}>
              <ModuleTile module={module} index={index} isVisible={isInView} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
