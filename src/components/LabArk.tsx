interface ExperimentCardProps {
  title: string;
  tag: string;
}

function ExperimentCard({ title, tag }: ExperimentCardProps) {
  return (
    <div
      className="p-6 rounded-xl border border-black/10 bg-white/30 transition-all duration-200 ease-out hover:border-black/20 hover:bg-white/50 hover:scale-[1.02] hover:-translate-y-1 cursor-default"
      style={{
        borderRadius: "var(--radius-12)",
      }}
    >
      {/* Thumbnail Area - Placeholder */}
      <div className="w-full h-32 bg-black/5 rounded-lg mb-4 flex items-center justify-center">
        <div className="text-black/20 text-xs uppercase" style={{ fontFamily: "var(--font-mono)" }}>
          Thumbnail
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-black mb-2 uppercase tracking-tight">{title}</h3>

      {/* Tag */}
      <span
        className="inline-block px-2 py-1 rounded text-xs uppercase tracking-wider text-black/60 border border-black/10"
        style={{
          fontFamily: "var(--font-mono)",
        }}
      >
        {tag}
      </span>
    </div>
  );
}

export default function LabArk() {
  const experiments = [
    { title: "Motion Study 01", tag: "Prototype" },
    { title: "WebGL Experiment", tag: "WebGL" },
    { title: "Transition Test", tag: "Motion" },
    { title: "Type System", tag: "Typography" },
  ];

  return (
    <section className="w-full px-6 py-16 lg:py-24">
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light uppercase text-black leading-none tracking-tight mb-4">
          LAB.ARK
        </h2>

        {/* Subcopy */}
        <p className="text-lg text-black/70 mb-12 max-w-2xl leading-relaxed">
          Experiments, prototypes, and motion tests. A space for exploration and iteration.
        </p>

        {/* Experiment Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiments.map((experiment, index) => (
            <ExperimentCard key={index} title={experiment.title} tag={experiment.tag} />
          ))}
        </div>
      </div>
    </section>
  );
}



