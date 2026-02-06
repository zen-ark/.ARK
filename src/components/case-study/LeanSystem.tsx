import React from 'react'
import RevealOnScroll from '../RevealOnScroll'

export default function LeanSystem() {
  const colors = {
    main: [
      { name: 'Red', hex: '#C03D3C' },
      { name: 'Dark', hex: '#191919' },
      { name: 'Sand', hex: '#CCA674' },
    ],
    neutrals: [
      { name: '0', hex: '#FFFFFF' },
      { name: '50', hex: '#FAF9F6' },
      { name: '100', hex: '#F3F1EC' },
      { name: '200', hex: '#E6E1D9' },
      { name: '500', hex: '#B8B8B8' },
      { name: '700', hex: '#404040' },
      { name: '900', hex: '#141311' },
    ],
    brand: [
      { name: '50', hex: '#FFFFED' },
      { name: '100', hex: '#EADECF' },
      { name: '300', hex: '#E4D0B6' },
      { name: '500', hex: '#E3A565' },
      { name: '700', hex: '#9D8875' },
    ],
    semantic: [
      { name: 'Success', hex: '#1BBA5A' },
      { name: 'Warning', hex: '#FFA621' },
      { name: 'Error', hex: '#C0392B' },
    ]
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start relative">
        
        {/* Left Column: Sticky Text */}
        <div className="w-full md:w-[40%] sticky top-[100px] z-10">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Design for Velocity
            </h2>
            <div className="w-12 h-1 bg-white/20 mb-8"></div>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
              With 25 hours on the clock, efficiency was the primary constraint. I built a lean, component-driven UI Kit in parallel with the designs. This allowed for rapid iteration across all 42 pages while ensuring the final handoff was dev-ready for Astro and WebGL implementation.
            </p>
          </RevealOnScroll>
        </div>

        {/* Right Column: Scrolling UI Kit Assets */}
        <div className="w-full md:w-[60%] flex flex-col gap-8">
          <RevealOnScroll delay={0.2}>
            <div className="flex flex-col gap-8 bg-[#111] border border-white/10 rounded-xl p-8 shadow-2xl">
              
              {/* Typography Section */}
              <div className="border-b border-white/10 pb-8">
                <span className="text-xs font-mono uppercase text-white/40 mb-6 block tracking-widest">Typography</span>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                    <div className="w-32 text-xs text-white/40 font-mono">Display</div>
                    <div className="text-white font-serif italic text-4xl md:text-5xl">Lorem ipsum</div>
                    <div className="text-xs text-white/40 font-mono ml-auto">Caslon Pro • Bold Italic</div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                    <div className="w-32 text-xs text-white/40 font-mono">h1</div>
                    <div className="text-white font-serif italic text-3xl md:text-4xl">Lorem ipsum</div>
                    <div className="text-xs text-white/40 font-mono ml-auto">Caslon Pro • Bold Italic</div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                    <div className="w-32 text-xs text-white/40 font-mono">h2</div>
                    <div className="text-white font-sans font-semibold text-2xl md:text-3xl">Lorem ipsum</div>
                    <div className="text-xs text-white/40 font-mono ml-auto">Inter • Semi Bold</div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                    <div className="w-32 text-xs text-white/40 font-mono">body XL</div>
                    <div className="text-white font-sans font-light text-xl md:text-2xl">Lorem ipsum</div>
                    <div className="text-xs text-white/40 font-mono ml-auto">Inter • Light</div>
                  </div>
                </div>
              </div>

              {/* Colors Section */}
              <div className="border-b border-white/10 pb-8">
                <span className="text-xs font-mono uppercase text-white/40 mb-6 block tracking-widest">Colors</span>
                
                {/* Main Colors */}
                <div className="mb-6">
                  <span className="text-[10px] text-white/30 font-mono mb-3 block">Primary</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {colors.main.map((color) => (
                      <div key={color.name} className="space-y-2">
                        <div className="w-full aspect-square rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: color.hex }}></div>
                        <div className="px-1">
                            <div className="text-xs text-white font-medium">{color.name}</div>
                            <div className="text-[10px] text-white/40 font-mono">{color.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutral Colors */}
                <div className="mb-6">
                  <span className="text-[10px] text-white/30 font-mono mb-3 block">Neutral</span>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                    {colors.neutrals.map((color) => (
                      <div key={color.name} className="space-y-2">
                        <div className="w-full aspect-square rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: color.hex }}></div>
                        <div className="px-1">
                            <div className="text-[10px] text-white font-medium">{color.name}</div>
                            <div className="text-[9px] text-white/40 font-mono">{color.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                 {/* Brand Colors */}
                 <div className="mb-6">
                  <span className="text-[10px] text-white/30 font-mono mb-3 block">Brand</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {colors.brand.map((color) => (
                      <div key={color.name} className="space-y-2">
                        <div className="w-full aspect-square rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: color.hex }}></div>
                        <div className="px-1">
                            <div className="text-[10px] text-white font-medium">{color.name}</div>
                            <div className="text-[9px] text-white/40 font-mono">{color.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Components Section */}
              <div>
                <span className="text-xs font-mono uppercase text-white/40 mb-6 block tracking-widest">Core Components</span>
                <div className="flex flex-col gap-4">
                    <button className="px-6 py-3 bg-white text-black font-bold rounded-lg w-full md:w-auto self-start">Primary Action</button>
                    <button className="px-6 py-3 bg-transparent border border-white/20 text-white font-medium rounded-lg w-full md:w-auto self-start">Secondary Action</button>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <span className="text-sm text-white/60">Input Field</span>
                    </div>
                </div>
              </div>

            </div>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  )
}
