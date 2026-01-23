import React from 'react'
import RevealOnScroll from '../RevealOnScroll'

export default function LeanSystem() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
        
        {/* Text Content */}
        <div className="w-full md:w-1/3 sticky top-32">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              The Lean System
            </h2>
            <div className="w-12 h-1 bg-white/20 mb-8"></div>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
              Efficiency through Systems. I developed a lean, component-based UI library in parallel with the page designs. This ensured that the 25-hour delivery wasn't just "screens" but a scalable kit ready for immediate handoff to the Astro/WebGL development team.
            </p>
          </RevealOnScroll>
        </div>

        {/* UI Kit Preview Grid */}
        <div className="w-full md:w-2/3">
          <RevealOnScroll delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {/* Typography Scale */}
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-8">
                <span className="text-xs font-mono uppercase text-white/40 mb-4 block">Typography Scale</span>
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-white">Heading XL</div>
                  <div className="text-2xl font-bold text-white">Heading L</div>
                  <div className="text-xl font-medium text-white">Body Large</div>
                  <div className="text-base text-white/80">Body Regular - The quick brown fox jumps over the lazy dog.</div>
                </div>
              </div>

              {/* Colors */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                <span className="text-xs font-mono uppercase text-white/40 mb-4 block">Color Palette</span>
                <div className="flex gap-2 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white border border-white/20"></div>
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="w-12 h-12 rounded-full bg-gray-400"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-full bg-black border border-white/20"></div>
                  <div className="w-12 h-12 rounded-full bg-gray-900 border border-white/20"></div>
                  <div className="w-12 h-12 rounded-full bg-gray-800 border border-white/20"></div>
                </div>
              </div>

              {/* Buttons & Elements */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col justify-center gap-4">
                <span className="text-xs font-mono uppercase text-white/40 mb-2 block">Components</span>
                <button className="px-6 py-3 bg-white text-black font-bold rounded-lg w-full">Primary Action</button>
                <button className="px-6 py-3 bg-transparent border border-white/20 text-white font-medium rounded-lg w-full">Secondary</button>
              </div>

              {/* Grid System */}
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-8 overflow-hidden relative h-32">
                <span className="text-xs font-mono uppercase text-white/40 mb-4 block relative z-10">Grid System (12 Col)</span>
                <div className="absolute inset-0 flex px-8 gap-4 opacity-10">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-1 bg-red-500 h-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  )
}
