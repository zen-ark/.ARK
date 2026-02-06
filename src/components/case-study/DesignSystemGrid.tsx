import React from 'react';

export default function DesignSystemGrid() {
  return (
    <div className="w-full bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12 my-12">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-6">
          <div>
            <h3 className="text-white text-lg font-medium mb-1">Design System</h3>
            <p className="text-white/40 text-sm font-mono">v2.0 • FIGMA EXPORT</p>
          </div>
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-white/20"></div>
             <div className="w-3 h-3 rounded-full bg-white/20"></div>
          </div>
        </div>

        {/* Typography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4 block">Typography</span>
            <div className="space-y-6">
              <div>
                <p className="text-6xl text-white font-light tracking-tight mb-2">Aa</p>
                <p className="text-sm text-white/60 font-mono">Inter Tight • Light • -2% Letter Spacing</p>
              </div>
              <div>
                <p className="text-4xl text-white font-medium tracking-tight mb-2">Headline</p>
                <p className="text-sm text-white/60 font-mono">Inter Tight • Medium • -1%</p>
              </div>
              <div>
                <p className="text-base text-white/80 leading-relaxed max-w-xs">
                  The quick brown fox jumps over the lazy dog. A clear, legible body font optimized for reading at small sizes.
                </p>
                <p className="text-sm text-white/60 font-mono mt-2">Inter • Regular • 16px</p>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4 block">Color Palette</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="w-full h-24 bg-[#050505] rounded-lg border border-white/10 shadow-lg"></div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white">Background</span>
                  <span className="text-white/40">#050505</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-24 bg-white rounded-lg border border-white/10 shadow-lg"></div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white">Foreground</span>
                  <span className="text-white/40">#FFFFFF</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-24 bg-[#1a1a1a] rounded-lg border border-white/10 shadow-lg"></div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white">Surface</span>
                  <span className="text-white/40">#1A1A1A</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-24 bg-[#C7FF55] rounded-lg border border-white/10 shadow-lg"></div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white">Accent</span>
                  <span className="text-white/40">#C7FF55</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
