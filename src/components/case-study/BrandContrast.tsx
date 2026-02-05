import React from 'react'
import RevealOnScroll from '../RevealOnScroll'

export default function BrandContrast() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 bg-[#0B0B0B]">
      <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start relative">
        
        {/* Left Column: Sticky Text */}
        <div className="w-full md:w-[40%] sticky top-[100px] z-10">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Dual Identity Strategy
            </h2>
            <div className="w-12 h-1 bg-white/20 mb-8"></div>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
              The challenge was maintaining Trauffer’s 'Heritage' (Wooden Toys) while elevating their 'Hospitality' (Bretterhotel) to a premium level. I designed a system that seamlessly shifts from high-key, airy layouts to high-contrast, moody dark modes depending on the user's journey.
            </p>
          </RevealOnScroll>
        </div>

        {/* Right Column: Scrolling Images */}
        <div className="w-full md:w-[60%] flex flex-col gap-8">
          
          {/* Light Mode Mockup */}
          <RevealOnScroll delay={0.2}>
            <div className="w-full rounded-xl overflow-hidden shadow-2xl relative group border border-white/5">
              <img 
                src="/portfolio projects/trauffer/1.png" 
                alt="Trauffer Landing Page" 
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="mt-4 text-sm font-mono text-white/40 uppercase tracking-widest">Landing Page</p>
          </RevealOnScroll>

          {/* Dark Mode Mockup */}
          <RevealOnScroll delay={0.4}>
             <div className="w-full rounded-xl overflow-hidden shadow-2xl relative group border border-white/20">
               <img 
                 src="/portfolio projects/trauffer/2.png" 
                 alt="Trauffer Dining Interface" 
                 className="w-full h-auto object-cover"
               />
            </div>
            <p className="mt-4 text-sm font-mono text-white/40 uppercase tracking-widest">Dining Interface</p>
          </RevealOnScroll>

           {/* Third Mockup */}
           <RevealOnScroll delay={0.6}>
             <div className="w-full rounded-xl overflow-hidden shadow-2xl relative group border border-white/20">
               <img 
                 src="/portfolio projects/trauffer/3.png?v=2" 
                 alt="Trauffer Experience Interface" 
                 className="w-full h-auto object-cover"
               />
            </div>
            <p className="mt-4 text-sm font-mono text-white/40 uppercase tracking-widest">Experience Interface</p>
          </RevealOnScroll>
        
        </div>

      </div>
    </section>
  )
}
