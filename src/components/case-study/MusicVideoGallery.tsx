import React from 'react';

const videos = [
  {
    title: "Lunaria Festival",
    artist: "Aftermovie",
    views: "Vimeo",
    id: "1005526761",
    type: "vimeo"
  },
  {
    title: "i hou",
    artist: "yung glas",
    views: "1.064 Aufrufe",
    id: "qeYUZN4Vop4",
    type: "youtube"
  },
  {
    title: "ude",
    artist: "yung glas",
    views: "279 Aufrufe",
    id: "_TkC_buPCCU",
    type: "youtube"
  },
  {
    title: "möli",
    artist: "yung glas & Bugel H",
    views: "294 Aufrufe",
    id: "YY1__UFatMg",
    type: "youtube"
  }
];

const images = [
  "/portfolio projects/ai-workflow/visuals/glas_1.png",
  "/portfolio projects/ai-workflow/visuals/glas_2.png",
  "/portfolio projects/ai-workflow/visuals/glas_3.png",
  "/portfolio projects/ai-workflow/visuals/glas_4.png",
  "/portfolio projects/ai-workflow/visuals/glas_5.png",
  "/portfolio projects/ai-workflow/visuals/glas_6.png",
];

export default function MusicVideoGallery() {
  return (
    <div className="flex flex-col gap-24">
      {/* Video Grid - Simple 2x2 Grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
              <div key={index} className="w-full group relative">
                <div className="aspect-video rounded-xl bg-[#050505] border border-white/10 overflow-hidden relative shadow-2xl">
                   {video.type === 'vimeo' ? (
                     <iframe 
                        src={`https://player.vimeo.com/video/${video.id}?badge=0&autopause=0&player_id=0&app_id=58479`} 
                        title={video.title}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0" 
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                     ></iframe>
                   ) : (
                     <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${video.id}`} 
                        title={video.title} 
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                     ></iframe>
                   )}
                </div>
                
                <div className="mt-4 flex justify-between items-start px-1">
                  <div>
                    <h4 className="text-white font-medium text-xl mb-1">{video.title}</h4>
                    <p className="text-white/40 text-sm font-mono uppercase tracking-wider">{video.artist}</p>
                  </div>
                  <span className="text-xs font-mono text-white/30 border border-white/10 px-3 py-1.5 rounded-full">
                    {video.views}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Visuals Grid */}
      <div className="w-full">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-1 border-b border-white/10 pb-8 gap-8">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-light text-white mb-2">Visual Gallery</h3>
              <p className="text-white/40 text-sm font-mono uppercase tracking-wider mb-6">Art Direction • Photography • 2023</p>
              <p className="text-white/70 text-lg font-light leading-relaxed">
                These frames from the yung glas shoots represent the moment my style shifted toward the "quietly powerful" and "cinematic" aesthetic that defines my work today. It was here I realized that even the most experimental visual needs a rock-solid technical foundation to truly land.
              </p>
            </div>
         </div>
         
         <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.map((src, i) => (
               <div key={i} className="break-inside-avoid relative group rounded-lg overflow-hidden border border-white/10 bg-[#050505]">
                  <img 
                    src={src} 
                    alt={`Visual ${i + 1}`} 
                    className="w-full h-auto object-cover opacity-100 transition-opacity duration-700"
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
