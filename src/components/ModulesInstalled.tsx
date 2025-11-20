interface ModuleProps {
  title: string;
  description: string;
}

function Module({ title, description }: ModuleProps) {
  return (
    <div className="flex items-start gap-4 p-6 rounded-xl border border-black/10 bg-white/30 transition-all duration-200 ease-out hover:border-black/20 hover:bg-white/50 group">
      {/* Status Dot */}
      <div
        className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[hsl(var(--color-brand-secondary))] opacity-80 group-hover:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg md:text-xl font-medium text-black mb-2 uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-sm md:text-base text-black/70 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function ModulesInstalled() {
  const modules = [
    {
      title: "INTERFACE DESIGN",
      description: "Product UI, dashboards, systems.",
    },
    {
      title: "WEB EXPERIENCES",
      description: "Framer/Next-style sites, cinematic flows.",
    },
    {
      title: "CREATIVE DIRECTION",
      description: "Concept, narrative, visual identity.",
    },
    {
      title: "MOTION & INTERACTIVE",
      description: "Prototyping, transitions, micro-UX.",
    },
    {
      title: "DESIGN SYSTEMS",
      description: "Tokens, components, documentation.",
    },
    {
      title: "BRAND DESIGN",
      description: "Minimal, digital-first identities.",
    },
  ];

  return (
    <section className="w-full px-6 py-16 lg:py-24">
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light uppercase text-black leading-none tracking-tight mb-12">
          MODULES INSTALLED
        </h2>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {modules.map((module) => (
            <Module key={module.title} title={module.title} description={module.description} />
          ))}
        </div>
      </div>
    </section>
  );
}



