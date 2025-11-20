interface ModelTileProps {
  title: string;
  description: string;
}

function ModelTile({ title, description }: ModelTileProps) {
  return (
    <div
      className="p-6 lg:p-8 rounded-xl border border-black/10 bg-white/50 transition-all duration-200 ease-out hover:border-[hsl(var(--color-brand-primary))]/30 hover:shadow-sm group"
      style={{
        borderRadius: "var(--radius-12)",
      }}
    >
      {/* Icon Area - Simple dot indicator */}
      <div className="w-3 h-3 rounded-full bg-[hsl(var(--color-brand-primary))] mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-medium text-black mb-3 uppercase tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-base text-black/70 leading-relaxed">{description}</p>
    </div>
  );
}

export default function ArkModel() {
  const tiles = [
    {
      title: "DIRECT LINK",
      description: "Work directly with the operator. No account managers, no middle layers—just clear communication and fast decisions.",
    },
    {
      title: "ULTRA-FOCUSED",
      description: "Only 1–2 projects at a time. High signal, no noise. Every project gets the full attention it deserves.",
    },
    {
      title: "CRAFT-LEVEL EXECUTION",
      description: "Every pixel, transition, and system is personally built by hand. No templates, no shortcuts—just deliberate craft.",
    },
  ];

  return (
    <section id="how-ark" className="w-full px-6 py-16 lg:py-24" style={{ scrollMarginTop: '80px' }}>
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light uppercase text-black leading-none tracking-tight mb-12">
          THE .ARK MODEL
        </h2>

        {/* Tiles Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiles.map((tile) => (
            <ModelTile key={tile.title} title={tile.title} description={tile.description} />
          ))}
        </div>
      </div>
    </section>
  );
}



