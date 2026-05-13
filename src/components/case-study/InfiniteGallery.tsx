import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

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

// Utility: Wrap value within a range
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface LayoutItem {
    x: number;
    y: number;
    width: number;
    height: number;
    item: GalleryItem;
    instanceId: string;
}

// ------------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------------
const BASE_COL_WIDTH = 380;
const GAP = 24;
// We'll create enough columns to cover a wide area (e.g., 3x typical viewport)
// 30 items. If we duplicate them 3 times, we have 90 items.
// 90 items into 8 columns => ~11 rows.
const COL_COUNT = 8; 

// Generate a large layout with duplicated items to ensure coverage
const generatedLayout = (() => {
    const layout: LayoutItem[] = [];
    const colHeights = new Array(COL_COUNT).fill(0);
    
    // Duplicate the dataset to ensure we have enough items for a large grid
    // 3 copies of the base items should be enough to fill a large viewport width
    const itemsToLayout = [
        ...baseItems.map(i => ({ ...i, instanceSuffix: 'a' })),
        ...baseItems.map(i => ({ ...i, instanceSuffix: 'b' })),
        ...baseItems.map(i => ({ ...i, instanceSuffix: 'c' }))
    ];

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

    itemsToLayout.forEach((item, index) => {
        const aspectRatio = item.width / item.height;
        const isWide = aspectRatio > 1.4; // Threshold for wide items
        const isUltraWide = aspectRatio > 2.2; // Threshold for ultra wide items (like banners)
        
        // Strategy for Wide Items:
        // Instead of picking the absolute shortest column and hoping the neighbor is fine,
        // we scan all adjacent column pairs to find the "best fit" (lowest combined height).
        if (isWide) {
            let bestPairIndex = -1;
            let minPairHeight = Infinity;
            
            // Scan pairs
            for (let i = 0; i < COL_COUNT - 1; i++) {
                const h1 = colHeights[i];
                const h2 = colHeights[i+1];
                const pairMaxY = Math.max(h1, h2);
                const heightDiff = Math.abs(h1 - h2);
                
                // We prefer pairs that are somewhat level, but for ultra-wide we are more lenient
                const tolerance = isUltraWide ? 600 : 300;
                
                if (heightDiff < tolerance) {
                    if (pairMaxY < minPairHeight) {
                        minPairHeight = pairMaxY;
                        bestPairIndex = i;
                    }
                }
            }
            
            // If we found a valid pair, place it there
            if (bestPairIndex !== -1) {
                 const targetCol = bestPairIndex;
                 const width = BASE_COL_WIDTH * 2 + GAP;
                 const height = width / aspectRatio;
                 
                 const y = minPairHeight;
                 const bottomY = y + height + GAP;
                 
                 layout.push({ 
                    x: targetCol * (BASE_COL_WIDTH + GAP), 
                    y: y, 
                    width, 
                    height, 
                    item: item, 
                    instanceId: `copy-${item.instanceSuffix}-${index}`
                });

                colHeights[targetCol] = bottomY;
                colHeights[targetCol + 1] = bottomY;
                return; // Done with this item
            }
        }

        // Fallback (or if not wide): Normal placement in shortest column
        const targetCol = getShortestColumn();
        const width = BASE_COL_WIDTH;
        const height = width / aspectRatio;
        const x = targetCol * (BASE_COL_WIDTH + GAP);
        const y = colHeights[targetCol];

        layout.push({ 
            x, 
            y, 
            width, 
            height, 
            item: item, 
            instanceId: `copy-${item.instanceSuffix}-${index}`
        });

        colHeights[targetCol] += height + GAP;
    });

    const gridWidth = COL_COUNT * (BASE_COL_WIDTH + GAP);
    const gridHeight = Math.max(...colHeights);

    return {
        items: layout,
        width: gridWidth,
        height: gridHeight
    };
})();

export const InfiniteGallery = ({ className = "fixed inset-0", enableClick = true }: { className?: string, enableClick?: boolean }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  
  const selectedItem = useMemo(() => baseItems.find(i => i.id === selectedId), [selectedId]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring physics for drag
  const springConfig = { damping: 50, stiffness: 400, mass: 1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const isDragging = useRef(false);

  // Resize handling
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    return () => {
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();
    };
  }, []);

  // Center initial position
  useEffect(() => {
    if (containerSize.width > 0 && x.get() === 0) {
       x.set(-generatedLayout.width / 2 + containerSize.width / 2);
       y.set(-generatedLayout.height / 2 + containerSize.height / 2);
    }
  }, [containerSize.width, containerSize.height]);

  return (
    <div ref={containerRef} className={`${className} bg-[#050505] overflow-hidden text-white font-sans select-none`}>
      <motion.div 
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        onPan={(e, info) => {
             if (selectedId) return;
             x.set(x.get() + info.delta.x);
             y.set(y.get() + info.delta.y);
             isDragging.current = true;
        }}
        onPanEnd={() => {
            setTimeout(() => { isDragging.current = false }, 50);
        }}
        style={{ touchAction: "none" }}
        animate={{ opacity: selectedId ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {generatedLayout.items.map((layoutItem) => (
            <WrappedGalleryItem
                key={layoutItem.instanceId}
                layoutItem={layoutItem}
                smoothX={smoothX}
                smoothY={smoothY}
                gridWidth={generatedLayout.width}
                gridHeight={generatedLayout.height}
                enableClick={enableClick}
                isDraggingRef={isDragging}
                onSelect={(id, layoutId) => {
                    if (selectedId) return;
                    setSelectedId(id);
                    setSelectedLayoutId(layoutId);
                }}
            />
        ))}
      </motion.div>

      {/* Focus View */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <FocusView 
            item={selectedItem} 
            items={baseItems}
            layoutId={selectedLayoutId}
            onClose={() => { setSelectedId(null); setSelectedLayoutId(null); }}
            onSelect={(id) => { 
                setSelectedId(id); 
                setSelectedLayoutId(null); 
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ------------------------------------------------------------------
// COMPONENT: Wrapped Gallery Item
// ------------------------------------------------------------------
const WrappedGalleryItem = ({ 
    layoutItem, 
    smoothX, 
    smoothY, 
    gridWidth, 
    gridHeight, 
    enableClick,
    isDraggingRef,
    onSelect
}: {
    layoutItem: LayoutItem,
    smoothX: MotionValue<number>,
    smoothY: MotionValue<number>,
    gridWidth: number,
    gridHeight: number,
    enableClick: boolean,
    isDraggingRef: React.MutableRefObject<boolean>,
    onSelect: (id: number, layoutId: string) => void
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // WRAPPING LOGIC:
    // Calculates the position of the item based on the drag value.
    // If the item moves out of the bounds [ -buffer, gridWidth - buffer ], it wraps around.
    // We assume the grid is large enough (via duplication) that we don't see the wrap seam on screen.
    const x = useTransform(smoothX, v => {
        // Shift coordinate system so 0 is center-ish or just wrap
        const pos = layoutItem.x + v;
        return wrap(-gridWidth/2, gridWidth/2, pos - gridWidth/2) + gridWidth/2 - layoutItem.width/2; 
        // Simply: wrap(0, gridWidth, pos) might work, but usually we want to center the wrap range
        // Let's try simpler:
        // return wrap(-layoutItem.width, gridWidth - layoutItem.width, pos);
    });
    
    // We'll use a slightly safer wrap function that handles the full grid
    const wrappedX = useTransform(smoothX, v => {
        return wrap(-gridWidth/2, gridWidth/2, layoutItem.x + v);
    });

    const wrappedY = useTransform(smoothY, v => {
        return wrap(-gridHeight/2, gridHeight/2, layoutItem.y + v);
    });

    // Handle video playback on hover with volume fade
    useEffect(() => {
        const video = videoRef.current;
        if (!layoutItem.item.video || !video) return;

        let fadeInterval: number;

        if (isHovered) {
            // Unmute and start playing (volume 0 initially)
            video.muted = false;
            video.volume = 0;
            video.play().catch(() => {
                // If autoplay blocked, try muted
                video.muted = true;
                video.play().catch(() => {});
            });

            // Fade in
            const fadeIn = () => {
                if (video.volume < 0.6) {
                    video.volume = Math.min(0.6, video.volume + 0.05);
                    fadeInterval = window.setTimeout(fadeIn, 100);
                }
            };
            fadeIn();
        } else {
            // Fade out
            const fadeOut = () => {
                if (video.volume > 0.05) {
                    video.volume = Math.max(0, video.volume - 0.05);
                    fadeInterval = window.setTimeout(fadeOut, 50);
                } else {
                    video.pause();
                    video.currentTime = 0;
                    video.volume = 0;
                }
            };
            fadeOut();
        }

        return () => window.clearTimeout(fadeInterval);
    }, [isHovered, layoutItem.item.video]);

    return (
        <motion.div
            style={{ 
                x: wrappedX, 
                y: wrappedY, 
                width: layoutItem.width, 
                height: layoutItem.height,
                position: 'absolute',
                top: 0,
                left: 0
            }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
                if (enableClick && !isDraggingRef.current) {
                    onSelect(layoutItem.item.id, `item-${layoutItem.item.id}-${layoutItem.instanceId}`);
                }
            }}
        >
            <motion.div
                layoutId={`item-${layoutItem.item.id}-${layoutItem.instanceId}`}
                className={`w-full h-full relative overflow-hidden bg-white/5 ${enableClick ? 'cursor-pointer' : ''}`}
            >
                 {layoutItem.item.video ? (
                    <video
                        ref={videoRef}
                        src={`${layoutItem.item.video}#t=0.001`}
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={layoutItem.item.image}
                        alt={layoutItem.item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                    />
                )}
            </motion.div>
        </motion.div>
    )
}

// ------------------------------------------------------------------
// COMPONENT: Focus View (Identical to before, mostly)
// ------------------------------------------------------------------
const FocusView = ({ item, items, onClose, onSelect, layoutId }: { item: GalleryItem, items: GalleryItem[], onClose: () => void, onSelect: (id: number) => void, layoutId: string | null }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />

      {/* Left Sidebar Filmstrip */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0, pointerEvents: "none" }}
        transition={{ type: "spring", damping: 30 }}
        className="relative z-10 w-[15vw] min-w-[100px] h-full border-r border-white/10 bg-black/50 overflow-y-auto flex flex-col gap-4 p-4 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((i) => (
          <div 
            key={i.id}
            onClick={() => onSelect(i.id)}
            className={`w-full aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${item.id === i.id ? 'ring-2 ring-white scale-105' : 'opacity-50 hover:opacity-100'}`}
          >
            {i.video ? (
              <video 
                src={i.video} 
                className="w-full h-full object-cover" 
                muted 
                loop 
                playsInline 
                autoPlay 
              />
            ) : (
              <img src={i.image} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Main Stage */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 pointer-events-none">
        <motion.div
          layoutId={layoutId || undefined}
          className="relative w-full max-w-case aspect-video bg-black rounded-sm overflow-hidden shadow-2xl pointer-events-auto"
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
            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors pointer-events-auto z-50"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
            </svg>
        </button>
      </div>
    </motion.div>
  );
};
