import React from 'react';
import { motion } from 'framer-motion';

export const InfiniteGalleryPreview = () => {
  // Using some placeholder images from the gallery
  const previewImages = [
    "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "/portfolio projects/3d/optimized/65d8d261b3f9a45ddcf47acb_sick.webp",
    "/portfolio projects/3d/optimized/65d8dfc3070ef7ee2bfce43b_mhhh.webp",
    "/portfolio projects/3d/optimized/65d8dfe8e78630f249315cbf_artboard_1.webp"
  ];

  return (
    <div className="w-full relative rounded-2xl overflow-hidden bg-[#111] aspect-video border border-white/10 group cursor-pointer">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-1 p-1 opacity-50 group-hover:opacity-30 transition-opacity duration-500">
         {previewImages.map((src, i) => (
             <div key={i} className="relative w-full h-full overflow-hidden bg-white/5">
                 <img src={src} className="w-full h-full object-cover" alt="" />
             </div>
         ))}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
          <h3 className="text-2xl md:text-3xl font-light text-white mb-2">Infinite Gallery</h3>
          <p className="text-white/60 mb-8 max-w-md font-mono text-sm">
              WebGL-powered infinite scroll experience managed by React & Framer Motion.
          </p>
          <a href="/portfolio/projects/3d-explorations" className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
              <span>View Interactive Gallery</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
          </a>
      </div>
      
      {/* Decorative UI elements to mimic a "window" */}
      <div className="absolute top-4 left-4 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
      </div>
    </div>
  );
};

export default InfiniteGalleryPreview;
