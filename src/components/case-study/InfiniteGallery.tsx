import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  video?: string;
  description: string;
  width: number;
  height: number;
}

const baseItems: GalleryItem[] = [
  {
    "id": 1,
    "title": "Abstract Motion Study",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/2_loops.mp4",
    "description": "Motion design exploration and simulation.",
    "width": 1920,
    "height": 1080
  },
  {
    "id": 2,
    "title": "Abstract Motion Study",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/0001.mp4",
    "description": "Motion design exploration and simulation.",
    "width": 1296,
    "height": 2304
  },
  {
    "id": 3,
    "title": "Abstract Chrome Geometry",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "description": "3D render and surfacing study.",
    "width": 1080,
    "height": 1350
  },
  {
    "id": 4,
    "title": "Character Study",
    "image": "/portfolio projects/3d/optimized/65d8d261b3f9a45ddcf47acb_sick.webp",
    "description": "3D render and surfacing study.",
    "width": 3840,
    "height": 1620
  },
  {
    "id": 5,
    "title": "Character Study",
    "image": "/portfolio projects/3d/optimized/65d8d261932a0a6d0ea6fccf_sick_2.webp",
    "description": "3D render and surfacing study.",
    "width": 3840,
    "height": 1620
  },
  {
    "id": 6,
    "title": "Fashion Concept",
    "image": "/portfolio projects/3d/optimized/65d8df8c0ebdc61a135985db_crazy_new_balaclava_cc.webp",
    "description": "3D render and surfacing study.",
    "width": 1080,
    "height": 1080
  },
  {
    "id": 7,
    "title": "Fashion Concept",
    "image": "/portfolio projects/3d/optimized/65d8dfad7a21d2f2778ec647_crazy_new3.webp",
    "description": "3D render and surfacing study.",
    "width": 2160,
    "height": 3840
  },
  {
    "id": 8,
    "title": "Fashion Concept",
    "image": "/portfolio projects/3d/optimized/65d8dfad8e5c8e8a29ee6362_crazy_new_2.webp",
    "description": "3D render and surfacing study.",
    "width": 2160,
    "height": 3840
  },
  {
    "id": 9,
    "title": "Fashion Concept",
    "image": "/portfolio projects/3d/optimized/65d8dfb9d8dad6a34e8ef825_crazy_new.webp",
    "description": "3D render and surfacing study.",
    "width": 2160,
    "height": 3840
  },
  {
    "id": 10,
    "title": "Product Viz",
    "image": "/portfolio projects/3d/optimized/65d8dfc3070ef7ee2bfce43b_mhhh.webp",
    "description": "3D render and surfacing study.",
    "width": 1920,
    "height": 1080
  },
  {
    "id": 11,
    "title": "Abstract Form",
    "image": "/portfolio projects/3d/optimized/65d8dfe8e78630f249315cbf_artboard_1.webp",
    "description": "3D render and surfacing study.",
    "width": 2000,
    "height": 2000
  },
  {
    "id": 12,
    "title": "Fuzzy Character",
    "image": "/portfolio projects/3d/optimized/65d8e01d78c2fa500d712245_po.webp",
    "description": "3D render and surfacing study.",
    "width": 2000,
    "height": 2000
  },
  {
    "id": 13,
    "title": "Abstract Composition",
    "image": "/portfolio projects/3d/optimized/65d8e047b569cedeff4512ec_artboard_2.webp",
    "description": "3D render and surfacing study.",
    "width": 2160,
    "height": 2700
  },
  {
    "id": 14,
    "title": "Abstract Composition",
    "image": "/portfolio projects/3d/optimized/65d8e0488ed0cdf07de992d2_artboard_1.webp",
    "description": "3D render and surfacing study.",
    "width": 2160,
    "height": 2700
  },
  {
    "id": 15,
    "title": "Material Detail",
    "image": "/portfolio projects/3d/optimized/65d9f41291b88eb036a8fed2_crazy_new_balaclava_close_up.webp",
    "description": "3D render and surfacing study.",
    "width": 2384,
    "height": 2384
  },
  {
    "id": 16,
    "title": "Process Shot",
    "image": "/portfolio projects/3d/optimized/65d9f71909af5bef09fdfb86_screenshot_2024-02-24_at_15.02.31.webp",
    "description": "3D render and surfacing study.",
    "width": 1276,
    "height": 1596
  },
  {
    "id": 17,
    "title": "Typography Experiment",
    "image": "/portfolio projects/3d/optimized/65d9f7e543097bb9bb9d789f_artboard_1.webp",
    "description": "3D render and surfacing study.",
    "width": 2000,
    "height": 2000
  },
  {
    "id": 18,
    "title": "Typography Experiment",
    "image": "/portfolio projects/3d/optimized/65d9f7e58fa6bedc0371f4bc_artboard_3.webp",
    "description": "3D render and surfacing study.",
    "width": 2000,
    "height": 2000
  },
  {
    "id": 19,
    "title": "Typography Experiment",
    "image": "/portfolio projects/3d/optimized/65d9f7e5d4131d58ce871f1b_artboard_2.webp",
    "description": "3D render and surfacing study.",
    "width": 2000,
    "height": 2000
  },
  {
    "id": 20,
    "title": "AI Experimentation",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/a_reflective_chrome_knight_sitting_cross_legged_in_a_lush_patch_of_urban_grass_holding1748878314789.mp4",
    "description": "Motion design exploration and simulation.",
    "width": 1288,
    "height": 1608
  },
  {
    "id": 21,
    "title": "Sound Design Edit",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/edit_w_sound.mp4",
    "description": "Motion design exploration and simulation.",
    "width": 1080,
    "height": 1920
  },
  {
    "id": 22,
    "title": "Motion Loop",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/instagram_export.mp4",
    "description": "Motion design exploration and simulation.",
    "width": 1080,
    "height": 1920
  },
  {
    "id": 23,
    "title": "AI Experimentation",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/metallic_sphere_rolls_with_a_gentle_clinking_sound_breeze_rustles_through_purple_flowe1748889903033.mp4",
    "description": "Motion design exploration and simulation.",
    "width": 1076,
    "height": 1920
  },
  {
    "id": 24,
    "title": "Sound Design Edit",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/post_2_editwsound.mp4",
    "description": "Motion design exploration and simulation.",
    "width": 1080,
    "height": 1920
  },
  {
    "id": 25,
    "title": "Motion Proxy",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/proxy3.mp4",
    "description": "Motion design exploration and simulation.",
    "width": 1080,
    "height": 1920
  },
  {
    "id": 26,
    "title": "What The Ark",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/sexy0001_0272.mp4",
    "description": "Brand animation loop.",
    "width": 1920,
    "height": 798
  },
  {
    "id": 27,
    "title": "Wave Loop",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/2_loops.mp4",
    "description": "Abstract wave simulation.",
    "width": 1920,
    "height": 1080
  },
  {
    "id": 28,
    "title": "Puffy Simulation",
    "image": "/portfolio projects/3d/optimized/65d34c7279fcc4fe46944a60_artboard_1.webp",
    "video": "/portfolio projects/3d/optimized/puffy_export.mp4",
    "description": "Soft body dynamics experiment.",
    "width": 1920,
    "height": 1080
  },
  {
    "id": 29,
    "title": "Abstract Character",
    "image": "/portfolio projects/3d/optimized/65d8dfb9d8dad6a34e8ef825_crazy_new.webp",
    "description": "3D render and surfacing study.",
    "width": 2160,
    "height": 3840
  },
  {
    "id": 30,
    "title": "Pink Monkey",
    "image": "/portfolio projects/3d/optimized/pink_monkey.webp",
    "description": "3D render and surfacing study.",
    "width": 1920,
    "height": 1080
  }
];

// Layout Configuration
const COL_WIDTH = 380;
const GAP = 24;
const COL_COUNT = 4;

// Pre-calculate layout
const calculatedLayout = (() => {
  const layout: { x: number; y: number; width: number; height: number; item: GalleryItem }[] = [];
  const colHeights = new Array(COL_COUNT).fill(0);

  const getShortestColumn = () => {
    let min = Infinity;
    let idx = 0;
    for (let i = 0; i < COL_COUNT; i++) {
      if (colHeights[i] < min) {
        min = colHeights[i];
        idx = i;
      }
    }
    return idx;
  };

  baseItems.forEach(item => {
    const targetCol = getShortestColumn();
    const width = COL_WIDTH;
    const height = width / (item.width / item.height);
    const x = targetCol * (COL_WIDTH + GAP);
    const y = colHeights[targetCol];

    layout.push({ x, y, width, height, item });
    colHeights[targetCol] += height + GAP;
  });

  return {
    items: layout,
    width: COL_COUNT * (COL_WIDTH + GAP),
    height: Math.max(...colHeights)
  };
})();

export const InfiniteGallery = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedItem = useMemo(() => baseItems.find(i => i.id === selectedId), [selectedId]);
  
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Motion values for grid drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 400, mass: 1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const isDragging = useRef(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const timer = setTimeout(() => setIsInitialLoad(false), 1000);
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
      if (windowSize.width > 0 && x.get() === 0) {
           x.set(-calculatedLayout.width / 2 + windowSize.width / 2);
           y.set(-calculatedLayout.height / 2 + windowSize.height / 2);
      }
  }, [windowSize.width]);

  // Force render on motion change
  const [_, setRenderTick] = useState(0);
  useEffect(() => {
    const unsubscribeX = smoothX.on("change", () => setRenderTick(prev => prev + 1));
    const unsubscribeY = smoothY.on("change", () => setRenderTick(prev => prev + 1));
    return () => { unsubscribeX(); unsubscribeY(); };
  }, [smoothX, smoothY]);

  if (!isMounted) return <div className="fixed inset-0 bg-[#050505]" />;

  const currentX = smoothX.get();
  const currentY = smoothY.get();

  // Tiling Logic
  const blockW = calculatedLayout.width;
  const blockH = calculatedLayout.height;

  const minBlockX = Math.floor((-currentX) / blockW) - 1;
  const maxBlockX = Math.floor((-currentX + windowSize.width) / blockW) + 1;
  const minBlockY = Math.floor((-currentY) / blockH) - 1;
  const maxBlockY = Math.floor((-currentY + windowSize.height) / blockH) + 1;

  const visibleInstances: {
    key: string;
    item: GalleryItem;
    x: number;
    y: number;
    w: number;
    h: number;
  }[] = [];

  for (let bx = minBlockX; bx <= maxBlockX; bx++) {
    for (let by = minBlockY; by <= maxBlockY; by++) {
      calculatedLayout.items.forEach((layoutItem, index) => {
         const itemX = bx * blockW + layoutItem.x + currentX;
         const itemY = by * blockH + layoutItem.y + currentY;
         
         if (
           itemX + layoutItem.width > -100 &&
           itemX < windowSize.width + 100 &&
           itemY + layoutItem.height > -100 &&
           itemY < windowSize.height + 100
         ) {
           visibleInstances.push({
             key: `${bx}-${by}-${index}`,
             item: layoutItem.item,
             x: itemX,
             y: itemY,
             w: layoutItem.width,
             h: layoutItem.height
           });
         }
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden text-white font-sans">
      {/* Grid Container */}
      <motion.div 
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPan={(e, info) => {
             if (selectedId) return; // Disable drag when focused
             x.set(x.get() + info.delta.x);
             y.set(y.get() + info.delta.y);
             isDragging.current = true;
        }}
        onPanEnd={() => {
            setTimeout(() => { isDragging.current = false }, 50);
        }}
        style={{ touchAction: "none", pointerEvents: selectedId ? "none" : "auto" }}
        animate={{ opacity: selectedId ? 0.3 : 1, scale: selectedId ? 0.9 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {visibleInstances.map((instance) => (
            <GalleryItemCard
              key={instance.key}
              item={instance.item}
              x={instance.x}
              y={instance.y}
              width={instance.w}
              height={instance.h}
              isInitialLoad={isInitialLoad}
              isSelected={selectedId === instance.item.id}
              onClick={() => {
                  if (!isDragging.current && !selectedId) {
                      setSelectedId(instance.item.id);
                  }
              }}
            />
        ))}
      </motion.div>

      {/* Focus View Overlay */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <FocusView 
            item={selectedItem} 
            items={baseItems}
            onClose={() => setSelectedId(null)}
            onSelect={(id) => setSelectedId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const GalleryItemCard = ({ item, x, y, width, height, isInitialLoad, isSelected, onClick }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (item.video && videoRef.current && !isSelected) {
      if (isHovered) {
        const video = videoRef.current;
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, item.video, isSelected]);

  const shouldAnimate = isInitialLoad && !hasAnimated.current;
  if (shouldAnimate) hasAnimated.current = true;
  
  if (isSelected) return null; // Hide from grid when selected (FocusView handles it)

  return (
    <motion.div
      layoutId={`item-${item.id}`}
      initial={shouldAnimate ? { y: y + 100, opacity: 0 } : false}
      animate={{ x, y, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.8 }}
      className="absolute bg-white/5 overflow-hidden group pointer-events-auto"
      style={{ width, height }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.video && (
        <video
          ref={videoRef}
          src={item.video}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      )}
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        draggable={false}
      />
    </motion.div>
  );
};

const FocusView = ({ item, items, onClose, onSelect }: { item: GalleryItem, items: GalleryItem[], onClose: () => void, onSelect: (id: number) => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />

      {/* Left Sidebar Filmstrip */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 30 }}
        className="relative z-10 w-24 md:w-32 h-full border-r border-white/10 bg-black/50 overflow-y-auto flex flex-col gap-4 p-4 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((i) => (
          <div 
            key={i.id}
            onClick={() => onSelect(i.id)}
            className={`w-full aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${item.id === i.id ? 'ring-2 ring-white scale-105' : 'opacity-50 hover:opacity-100'}`}
          >
            <img src={i.image} className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>

      {/* Main Stage */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 pointer-events-none">
        <motion.div
          layoutId={`item-${item.id}`}
          className="relative w-full max-w-5xl aspect-video bg-black rounded-sm overflow-hidden shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
             {item.video ? (
                 <video
                 src={item.video}
                 autoPlay
                 loop
                 playsInline
                 controls
                 className="w-full h-full object-contain bg-black"
                 />
             ) : (
                 <img
                 src={item.image}
                 alt={item.title}
                 className="w-full h-full object-contain bg-black"
                 />
             )}
        </motion.div>

        {/* Metadata */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-8 left-8 md:left-16 text-white pointer-events-auto"
        >
            <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-2">{item.title}</h1>
            <p className="text-white/60 font-mono text-sm uppercase tracking-widest">{item.description}</p>
        </motion.div>

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors pointer-events-auto z-50"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
            </svg>
        </button>
      </div>
    </motion.div>
  );
};
