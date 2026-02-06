/* DesignSystemShowcase.tsx - Updated with correct tokens */
import React from 'react';

export default function DesignSystemShowcase() {
  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-10 my-12 relative overflow-hidden group">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col gap-10">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h3 className="text-white text-2xl font-light tracking-tight mb-1">.ARK System</h3>
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Digital Design Language v2.0</p>
          </div>
          <div className="hidden md:flex gap-4 text-xs font-mono text-white/30">
            <span>FIGMA</span>
            <span>REACT</span>
            <span>THREE.JS</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Typography Column */}
          <div className="space-y-6">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest block border-b border-white/5 pb-2">Typography</span>
            
            <div className="space-y-6">
              <div className="group/type">
                <p className="text-6xl text-white font-light tracking-tighter mb-2 transition-transform group-hover/type:translate-x-2 duration-500" style={{ fontFamily: 'Geist, sans-serif' }}>Aa</p>
                <div className="flex justify-between items-baseline">
                  <p className="text-white font-medium text-sm">Geist Sans</p>
                  <p className="text-xs text-white/40 font-mono">Display / Body</p>
                </div>
              </div>
              
              <div className="group/type">
                <p className="text-3xl text-white font-normal tracking-tight mb-2 transition-transform group-hover/type:translate-x-2 duration-500 delay-75" style={{ fontFamily: 'Geist Mono, monospace' }}>Ag</p>
                <div className="flex justify-between items-baseline">
                  <p className="text-white font-medium text-sm">Geist Mono</p>
                  <p className="text-xs text-white/40 font-mono">Code / UI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Color & Surface Column */}
          <div className="space-y-6">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest block border-b border-white/5 pb-2">Palette & Surface</span>
            
            <div className="grid grid-cols-4 gap-3">
              {/* Brand Primary */}
              <div className="aspect-square rounded-xl border border-white/10 flex flex-col justify-end p-3 hover:scale-[1.02] transition-transform" style={{ backgroundColor: 'hsl(258, 55%, 63%)' }}>
                <span className="text-white/90 text-xs font-mono">Primary</span>
                <span className="text-white/60 text-[10px] font-mono">HSL(258, 55%, 63%)</span>
              </div>
              
              {/* Brand Accent */}
              <div className="aspect-square rounded-xl border border-white/10 flex flex-col justify-end p-3 hover:scale-[1.02] transition-transform" style={{ backgroundColor: 'hsl(71, 100%, 61%)' }}>
                <span className="text-black/60 text-xs font-mono">Accent</span>
                <span className="text-black/40 text-[10px] font-mono">HSL(71, 100%, 61%)</span>
              </div>

              {/* Surface */}
              <div className="aspect-square bg-[#050505] rounded-xl border border-white/10 flex flex-col justify-end p-3 hover:border-white/30 transition-colors">
                <span className="text-white/60 text-xs font-mono">Canvas</span>
                <span className="text-white/40 text-[10px] font-mono">#050505</span>
              </div>

              {/* Surface Elevated */}
              <div className="aspect-square bg-[#1a1a1a] rounded-xl border border-white/10 flex flex-col justify-end p-3 hover:border-white/30 transition-colors">
                <span className="text-white/60 text-xs font-mono">Surface</span>
                <span className="text-white/40 text-[10px] font-mono">#1A1A1A</span>
              </div>
            </div>
          </div>

          {/* Components Column */}
          <div className="space-y-6">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest block border-b border-white/5 pb-2">Interface</span>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between group/item hover:bg-white/10 transition-colors cursor-default">
                <div className="flex gap-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono">01</div>
                  <span className="text-sm text-white/80">Navigation Module</span>
                </div>
                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(199,255,85,0.5)]" style={{ backgroundColor: 'hsl(71, 100%, 61%)' }}></div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between group/item hover:bg-white/10 transition-colors cursor-default">
                <div className="flex gap-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono">02</div>
                  <span className="text-sm text-white/80">Data Grid</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between group/item hover:bg-white/10 transition-colors cursor-default">
                <div className="flex gap-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono">03</div>
                  <span className="text-sm text-white/80">Media Player</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
