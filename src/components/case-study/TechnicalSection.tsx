import React from 'react';

interface TechnicalSectionProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function TechnicalSection({ title, subtitle, children }: TechnicalSectionProps) {
  return (
    <section className="w-full relative bg-[#111] overflow-hidden border-y border-white/10">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Radial Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Header */}
          <div className="md:col-span-4">
            <div className="sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-500/80">System Architecture</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">{title}</h2>
              <p className="text-white/60 text-lg leading-relaxed font-light">{subtitle}</p>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-8">
            <div className="prose prose-lg prose-invert max-w-none prose-headings:font-normal prose-p:font-light prose-p:text-white/80 prose-li:text-white/80">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
