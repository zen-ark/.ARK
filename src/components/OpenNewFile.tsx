export default function OpenNewFile() {
  return (
    <section className="w-full px-6 py-16 lg:py-24">
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light uppercase text-black leading-none tracking-tight mb-6">
          OPEN A NEW FILE
        </h2>

        {/* Explanation */}
        <p className="text-lg md:text-xl text-black/80 max-w-2xl mb-10 leading-relaxed">
          Describe what you're building. .ARK will structure and design it.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Primary CTA Button */}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-black text-white font-medium uppercase tracking-wider text-sm transition-all duration-200 ease-out hover:bg-[hsl(var(--color-brand-secondary))] hover:text-black focus-ring"
            style={{
              borderRadius: "var(--radius-12)",
              fontFamily: "var(--font-mono)",
            }}
          >
            START A PROJECT
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>

          {/* Secondary CTA Link */}
          <a
            href="/contact"
            className="inline-block px-4 py-4 text-black/60 hover:text-black transition-colors duration-200 ease-out text-sm uppercase tracking-wider focus-ring"
            style={{
              fontFamily: "var(--font-mono)",
            }}
          >
            Just say hi
          </a>
        </div>
      </div>
    </section>
  );
}



