import React from 'react';

interface BrowserWindowProps {
  children: React.ReactNode;
  url?: string;
  className?: string;
}

export default function BrowserWindow({ children, url = "localhost:3000", className = "" }: BrowserWindowProps) {
  return (
    <div className={`w-full relative rounded-xl overflow-hidden bg-[#1a1a1a] shadow-2xl border border-white/10 group ${className}`}>
      {/* Window Chrome */}
      <div className="bg-[#2a2a2a] px-4 py-3 flex items-center justify-between border-b border-white/5 relative z-20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-white/40 font-mono bg-black/20 px-3 py-1 rounded-md">
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 009 9 9.75 9.75 0 006.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
           <span>{url}</span>
        </div>
        <div className="w-12"></div>
      </div>
      
      {/* Window Content */}
      <div className="relative aspect-video bg-[#050505] overflow-hidden group/content">
        {children}
      </div>
    </div>
  );
}
