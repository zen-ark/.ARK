import React from 'react';
import RevealOnScroll from '../RevealOnScroll';

// Placeholder images - in production these would be real agency screenshots
const images = [
  "/portfolio projects/trauffer/trauffer moive.mp4", // Lottie placeholder
  "/portfolio projects/3d/optimized/65d8dfad7a21d2f2778ec647_crazy_new3.webp",
  "/portfolio projects/3d/optimized/65d8dfad8e5c8e8a29ee6362_crazy_new_2.webp",
  "/portfolio projects/3d/optimized/65d8dfb9d8dad6a34e8ef825_crazy_new.webp"
];

export default function StaggeredGallery() {
  return (
    <section className="w-full max-w-case mx-auto px-4 md:px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Column 1 */}
        <div className="flex flex-col gap-8 md:gap-12">
           <RevealOnScroll className="w-full">
              <div className="w-full aspect-[4/5] bg-[#1a1a1a] rounded-lg overflow-hidden relative group">
                 <img src={images[1]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt="Agency UI 1" />
                 <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-mono text-xs text-white/60 uppercase">UI Component</span>
                    <span className="text-white font-medium">Vertical Scroll System</span>
                 </div>
              </div>
           </RevealOnScroll>
           <RevealOnScroll className="w-full" delay={0.2}>
              <div className="w-full aspect-square bg-[#1a1a1a] rounded-lg overflow-hidden relative group">
                 <img src={images[2]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt="Agency UI 2" />
              </div>
           </RevealOnScroll>
        </div>

        {/* Column 2 - Offset */}
        <div className="flex flex-col gap-8 md:gap-12 md:mt-24">
           <RevealOnScroll className="w-full" delay={0.1}>
              <div className="w-full aspect-square bg-[#1a1a1a] rounded-lg overflow-hidden relative group">
                 <img src={images[3]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt="Agency UI 3" />
              </div>
           </RevealOnScroll>
           <RevealOnScroll className="w-full" delay={0.3}>
              <div className="w-full aspect-[4/5] bg-[#1a1a1a] rounded-lg overflow-hidden relative group">
                 {/* Using a placeholder div for the Lottie json if image fails, or just an image */}
                 <div className="w-full h-full bg-[#222] flex items-center justify-center">
                    <span className="text-white/20 font-mono text-sm">Interaction.json</span>
                 </div>
                 <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-mono text-xs text-white/60 uppercase">Micro-Interaction</span>
                    <span className="text-white font-medium">Hover State Logic</span>
                 </div>
              </div>
           </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
