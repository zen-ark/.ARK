export default function OperatorArk() {
  return (
    <section id="behind-ark" className="w-full px-6 py-16 lg:py-24" style={{ scrollMarginTop: '80px' }}>
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Text */}
          <div>
            {/* Section Label */}
            <p
              className="text-xs uppercase tracking-wider mb-4 text-black/60"
              style={{
                fontFamily: "var(--font-mono)",
              }}
            >
              THE OPERATOR.ARK
            </p>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black leading-tight mb-6">
              A studio front powered by a single operator responsible for design, direction, and execution.
            </h2>

            {/* Body Copy */}
            <p className="text-lg text-black/80 leading-relaxed">
              Direct collaboration with no handoffs. Every decision, every pixel, every interaction 
              flows through one person—ensuring consistency, clarity, and craft-level execution.
            </p>
          </div>

          {/* Right Column - Portrait */}
          <div className="flex flex-col">
            {/* Portrait Image */}
            <div
              className="relative rounded-2xl overflow-hidden border border-black/10 shadow-sm mb-3"
              style={{
                borderRadius: "var(--radius-12)",
                boxShadow: "var(--elevation-2)",
              }}
            >
              <img
                src="/shain.jpg"
                alt="Operator portrait"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* File Metadata Easter Egg */}
            <div
              className="text-xs text-black/40 space-y-0.5"
              style={{
                fontFamily: "var(--font-mono)",
              }}
            >
              <div>Last Modified: Today</div>
              <div>File Size: 1 human</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



