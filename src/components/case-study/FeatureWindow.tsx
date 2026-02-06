import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { InfiniteGallery } from './InfiniteGallery';

export const FeatureWindow = () => {
  return (
    <div className="w-full relative rounded-xl overflow-hidden bg-[#1a1a1a] shadow-2xl border border-white/10 group">
      {/* Window Chrome */}
      <div className="bg-[#2a2a2a] px-4 py-3 flex items-center justify-between border-b border-white/5 relative z-20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-white/40 font-mono bg-black/20 px-3 py-1 rounded-md">
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 00-9-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 009 9 9.75 9.75 0 006.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
           <span>localhost:3000/gallery</span>
        </div>
        <div className="w-12"></div>
      </div>
      
      {/* Window Content */}
      <div className="relative aspect-video bg-[#050505] overflow-hidden group/content">
        <InfiniteGallery className="absolute inset-0 w-full h-full" enableClick={false} />
        
        {/* Full View Button */}
        <a 
          href="/portfolio/projects/3d-explorations" 
          className="absolute bottom-6 right-6 z-50 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-full shadow-lg opacity-0 group-hover/content:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/content:translate-y-0 hover:bg-gray-100 flex items-center gap-2"
        >
          <span>Full Experience</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FeatureWindow;
