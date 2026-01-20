"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Keep FRAME_COUNT to map the existing metadata frame numbers to percentages
const FRAME_COUNT = 272;

interface CardData {
  label: string;
  mode: string;
  status: string;
  imageSrc: string;
}

const cards: CardData[] = [
  {
    label: "SYSTEMATIC",
    mode: "MODE: STRUCTURE",
    status: "STATUS: STABLE",
    imageSrc: "/OBJ 1.png",
  },
  {
    label: "CREATIVE",
    mode: "MODE: EXPLORATION",
    status: "STATUS: ACTIVE",
    imageSrc: "/OBJ 2.png",
  },
  {
    label: "INTERACTIVE",
    mode: "MODE: INPUT / OUTPUT",
    status: "STATUS: RESPONSIVE",
    imageSrc: "/OBJ 3.png",
  },
];

type Position = { x: number; y: number };

type MetadataVisualConfig = {
  startFrame: number;
  animationWindow: number;
  anchorPath: { start: Position; end: Position };
  cardPath: { start: Position; end: Position };
};

type ResponsiveMetadataConfig = {
  mobile?: Partial<MetadataVisualConfig>;
  tablet?: Partial<MetadataVisualConfig>;
  desktop: MetadataVisualConfig;
};

const METADATA_VISUALS: Record<string, ResponsiveMetadataConfig> = {
  SYSTEMATIC: {
    desktop: {
      startFrame: 40,
      animationWindow: 40,
      anchorPath: { start: { x: 0.5, y: 1 }, end: { x: 0.43, y: 0.65 } },
      cardPath: { start: { x: 0.72, y: 0.45 }, end: { x: 0.8, y: 0.22 } },
    },
    mobile: {
      anchorPath: { start: { x: 0.5, y: 1 }, end: { x: 0.43, y: 0.55 } },
      cardPath: { start: { x: 0.5, y: 0.8 }, end: { x: 0.5, y: 0.25 } },
    },
  },
  CREATIVE: {
    desktop: {
      startFrame: 123,
      animationWindow: 40,
      anchorPath: { start: { x: 0.3, y: 1 }, end: { x: 0.3, y: 0.2 } },
      cardPath: { start: { x: 0.2, y: 0.9 }, end: { x: 0.1, y: 0.7 } },
    },
    mobile: {
      anchorPath: { start: { x: 0.3, y: 1 }, end: { x: 0.3, y: 0.3 } },
      cardPath: { start: { x: 0.5, y: 0.9 }, end: { x: 0.5, y: 0.55 } },
    },
  },
  INTERACTIVE: {
    desktop: {
      startFrame: 213,
      animationWindow: 40,
      anchorPath: { start: { x: 0.6, y: 0.9 }, end: { x: 0.6, y: 0.62 } },
      cardPath: { start: { x: 0.9, y: 0.9 }, end: { x: 0.9, y: 0.5 } },
    },
    mobile: {
      anchorPath: { start: { x: 0.6, y: 0.9 }, end: { x: 0.6, y: 0.7 } },
      cardPath: { start: { x: 0.5, y: 0.9 }, end: { x: 0.5, y: 0.85 } },
    },
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t;

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">("desktop");
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint("mobile");
      } else if (width < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);
  return breakpoint;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(m.matches);
    set();
    m.addEventListener?.("change", set);
    return () => m.removeEventListener?.("change", set);
  }, []);
  return reduced;
}

// ----------------------------------------------------------------------
// CUSTOM HOOK: useImageSequence (Blob + LRU Cache)
// ----------------------------------------------------------------------

function useImageSequence(frameCount: number) {
  const [loaded, setLoaded] = useState(false);
  const blobsRef = useRef<string[]>([]); // ObjectURLs
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map()); // Cache
  const loadProgressRef = useRef(0);

  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      // 1. Fetch all blobs
      const promises = Array.from({ length: frameCount }, async (_, i) => {
        const id = (i + 1).toString().padStart(4, "0");
        const url = `/no bg webp sequence/no bg${id}.webp`;
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          if (!active) return;
          // Create object URL immediately so we can use it
          blobsRef.current[i] = URL.createObjectURL(blob);
          loadProgressRef.current = (i + 1) / frameCount;
        } catch (e) {
          console.error(`Failed to load frame ${i}`, e);
        }
      });

      await Promise.all(promises);
      if (active) setLoaded(true);
    };

    loadImages();

    return () => {
      active = false;
      // Cleanup ObjectURLs
      blobsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [frameCount]);

  const getFrame = (index: number) => {
    if (!blobsRef.current[index]) return null;

    // Simple cache strategy for now:
    // If we have an image object, return it.
    // Otherwise create one.
    // In a real LRU we would limit size, but browser cache handles blobs well.
    // We mainly need the Image object to draw to canvas.
    
    let img = imagesRef.current.get(index);
    if (!img) {
      img = new Image();
      img.src = blobsRef.current[index];
      imagesRef.current.set(index, img);
      
      // Basic cleanup if map gets too big (simple LRU approximation)
      if (imagesRef.current.size > 50) {
        // Delete the oldest entry (first key)
        const firstKey = imagesRef.current.keys().next().value;
        if (firstKey !== undefined) imagesRef.current.delete(firstKey);
      }
    }
    return img;
  };

  return { loaded, getFrame, progress: loadProgressRef.current };
}

export default function WhatArkDoes() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressListenersRef = useRef(new Set<(value: number) => void>());
  
  const { loaded, getFrame } = useImageSequence(FRAME_COUNT);

  // Calculate header height for padding
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.getBoundingClientRect().height);
      }
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight, { passive: true });
    // Small delay to ensure layout is done
    const timeoutId = setTimeout(updateHeaderHeight, 100);
    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      clearTimeout(timeoutId);
    };
  }, []);

  const subscribeToProgress = useCallback(
    (listener: (value: number) => void) => {
      progressListenersRef.current.add(listener);
      return () => {
        progressListenersRef.current.delete(listener);
      };
    },
    []
  );

  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Map progress to frame index
    const frameIndex = Math.floor(progress * (FRAME_COUNT - 1));
    const img = getFrame(frameIndex);

    if (img && img.complete && img.naturalWidth > 0) {
       // Canvas sizing logic (contain)
       const canvasWidth = canvas.width;
       const canvasHeight = canvas.height;
       const imgRatio = img.naturalWidth / img.naturalHeight;
       const canvasRatio = canvasWidth / canvasHeight;

       let drawWidth, drawHeight, offsetX, offsetY;

       if (canvasRatio > imgRatio) {
         drawHeight = canvasHeight;
         drawWidth = drawHeight * imgRatio;
         offsetX = (canvasWidth - drawWidth) / 2;
         offsetY = 0;
       } else {
         drawWidth = canvasWidth;
         drawHeight = drawWidth / imgRatio;
         offsetX = 0;
         offsetY = (canvasHeight - drawHeight) / 2;
       }

       ctx.clearRect(0, 0, canvasWidth, canvasHeight);
       ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, [loaded, getFrame]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
         const parent = canvasRef.current.parentElement;
         if (parent) {
            const dpr = Math.min(window.devicePixelRatio, 2); // Cap DPR at 2 for performance
            canvasRef.current.width = parent.clientWidth * dpr;
            canvasRef.current.height = parent.clientHeight * dpr;
            // Force redraw of current frame?
            // (Simpler to just let the loop handle it or wait for next scroll)
         }
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const reduced = usePrefersReducedMotion();

  // Scroll Animation Logic
  useEffect(() => {
    const boundsRef = { start: 0, end: 0 };
    const targetProgressRef = { current: 0 };
    const currentProgressRef = { current: 0 };
    const rafIdRef = { current: 0 };

    const applyProgress = (progress: number) => {
      drawFrame(progress);
      // Notify listeners (overlay)
      progressListenersRef.current.forEach((listener) => listener(progress));
    };

    const animationLoop = () => {
      // Base ease (lower is smoother but laggier, higher is tighter)
      let ease = reduced ? 1 : 0.05; 
      
      const diff = targetProgressRef.current - currentProgressRef.current;
      const absDiff = Math.abs(diff);

      if (!reduced) {
         // Dynamic Velocity Adjustment
         // If we are far behind (>10% of total scroll), snap faster
         if (absDiff > 0.1) {
            ease = 0.5; // Very Fast catchup (was 0.2)
         } else if (absDiff > 0.05) {
            ease = 0.25; // Fast catchup (was 0.1)
         }

         // Apply eased movement
         if (absDiff > 0.0001) {
            currentProgressRef.current += diff * ease;
            applyProgress(currentProgressRef.current);
            rafIdRef.current = requestAnimationFrame(animationLoop);
         } else {
            // Snap to target if very close and stop loop
            if (currentProgressRef.current !== targetProgressRef.current) {
               currentProgressRef.current = targetProgressRef.current;
               applyProgress(currentProgressRef.current);
            }
            rafIdRef.current = 0;
         }
      } else {
         // Instant update for reduced motion
         if (currentProgressRef.current !== targetProgressRef.current) {
            currentProgressRef.current = targetProgressRef.current;
            applyProgress(currentProgressRef.current);
         }
         rafIdRef.current = 0;
      }
    };

    const startAnimation = () => {
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(animationLoop);
      }
    };

    const updateTargetFromScroll = () => {
      const { start, end } = boundsRef;
      // Safety check
      if (end <= start) {
        targetProgressRef.current = 0;
      } else {
        const raw = (window.scrollY - start) / (end - start);
        targetProgressRef.current = Math.max(0, Math.min(1, raw));
      }

      if (reduced) {
        currentProgressRef.current = targetProgressRef.current;
        applyProgress(currentProgressRef.current);
      } else {
        startAnimation();
      }
    };

    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate absolute position
      const start = window.scrollY + rect.top;
      // Scroll distance is container height minus viewport height
      const end = start + rect.height - window.innerHeight;
      boundsRef.start = start;
      boundsRef.end = end;
      updateTargetFromScroll();
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateTargetFromScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateTargetFromScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [reduced, drawFrame]);

  return (
    <section
      ref={containerRef}
      id="what-the-ark-canvas"
      className="w-full relative"
      style={{
        height: "300vh", // Tall container for scroll space
        backgroundColor: "hsl(var(--color-bg-canvas))"
      }}
    >
      <div
        className="sticky top-0 w-full h-screen flex flex-col overflow-hidden"
        style={{
          paddingTop: headerHeight > 0 ? `${headerHeight + 16}px` : "4rem",
        }}
      >
        {/* Heading - large, fluid, full width */}
        <div className="wtark-heading w-full flex-shrink-0" style={{ marginBottom: "16px" }}>
          <div className="w-full px-6 mt-4">
            <img
              src="/What the ark.svg"
              alt="What the ark"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Copy row - two columns on tablet and desktop */}
        <div className="wtark-copy mb-8 md:mb-16 px-6 flex-shrink-0">
          <div className="hidden md:flex md:justify-between md:gap-8">
            <p className="wtark-copy-text wtark-copy-left">
              .ARK IS A DIGITAL STUDIO BUILT AROUND ONE EXTENSION, RUN BY A SINGLE DESIGNER.
            </p>
            <p className="wtark-copy-text wtark-copy-right">
              WE CRAFT CLEAR INTERFACES AND CINEMATIC WEB EXPERIENCES WITH PRECISION AND EXPERIMENTATION.
            </p>
          </div>

          {/* Mobile: stacked with better spacing */}
          <div className="md:hidden flex flex-col gap-6">
            <p className="wtark-copy-text wtark-copy-mobile">
              .ARK IS A DIGITAL STUDIO BUILT AROUND ONE EXTENSION, RUN BY A SINGLE DESIGNER.
            </p>
            <p className="wtark-copy-text wtark-copy-mobile">
              WE CRAFT CLEAR INTERFACES AND CINEMATIC WEB EXPERIENCES WITH PRECISION AND EXPERIMENTATION.
            </p>
          </div>
        </div>

        {/* Video Stage */}
        <div className="flex-1 w-full relative flex items-end justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-end justify-center" style={{ backgroundColor: "white" }}>
            
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ display: 'block' }}
            />
            
            {!loaded && (
               <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <span className="text-sm font-mono opacity-50">LOADING ASSETS...</span>
               </div>
            )}

            <OptimizedMetadataOverlay
              cards={cards}
              reduced={reduced}
              subscribeToProgress={subscribeToProgress}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// OPTIMIZED OVERLAY COMPONENTS
// ----------------------------------------------------------------------

interface OptimizedMetadataOverlayProps {
  cards: CardData[];
  reduced: boolean;
  subscribeToProgress: (listener: (value: number) => void) => () => void;
}

function OptimizedMetadataOverlay({
  cards,
  reduced,
  subscribeToProgress,
}: OptimizedMetadataOverlayProps) {
  const breakpoint = useBreakpoint();
  
  // Store refs to all dynamic DOM elements
  const nodeRefs = useRef<Map<string, {
    container: HTMLDivElement;
    card: HTMLDivElement;
    line: SVGLineElement;
    anchor: SVGCircleElement;
  }>>(new Map());

  // Store current breakpoint in ref to access it in the subscription closure without re-binding
  const breakpointRef = useRef(breakpoint);
  useEffect(() => { breakpointRef.current = breakpoint; }, [breakpoint]);

  useEffect(() => {
    // This function runs on every animation frame (60fps)
    // It must NOT trigger React state updates.
    return subscribeToProgress((progress) => {
      const currentBreakpoint = breakpointRef.current;

      cards.forEach((card) => {
        const refs = nodeRefs.current.get(card.label);
        if (!refs) return;

        const fullConfig = METADATA_VISUALS[card.label];
        if (!fullConfig) return;

        let config = fullConfig.desktop;
        if (currentBreakpoint === "mobile" && fullConfig.mobile) {
          config = { ...config, ...fullConfig.mobile };
        } else if (currentBreakpoint === "tablet" && fullConfig.tablet) {
          config = { ...config, ...fullConfig.tablet };
        }

        const startProgress = config.startFrame / (FRAME_COUNT - 1);
        const animationWindow =
          config.animationWindow > 0 ? config.animationWindow / (FRAME_COUNT - 1) : 0.01;
        
        const t = progress <= startProgress
            ? 0
            : clamp((progress - startProgress) / animationWindow, 0, 1);
        
        const visible = progress >= startProgress;

        // 1. Update Visibility
        refs.container.style.opacity = visible ? "1" : "0";
        if (!visible) return; // Skip calculation if hidden

        // 2. Calculate positions
        let cardX = lerp(config.cardPath.start.x, config.cardPath.end.x, t);
        let cardY = lerp(config.cardPath.start.y, config.cardPath.end.y, t);

        let anchorX = lerp(config.anchorPath.start.x, config.anchorPath.end.x, t);
        let anchorY = lerp(config.anchorPath.start.y, config.anchorPath.end.y, t);
        
        // Clamp
        cardX = Math.max(0.05, Math.min(0.95, cardX));
        cardY = Math.max(0.1, Math.min(0.9, cardY));

        const cardPctX = (cardX * 100).toFixed(2) + "%";
        const cardPctY = (cardY * 100).toFixed(2) + "%";
        const anchorPctX = (anchorX * 100).toFixed(2) + "%";
        const anchorPctY = (anchorY * 100).toFixed(2) + "%";

        // 3. Update DOM directly (Imperative Animation)
        
        // Update Card Position
        refs.card.style.left = cardPctX;
        refs.card.style.top = cardPctY;

        // Update Line and Anchor
        if (refs.line) {
          refs.line.setAttribute("x1", anchorPctX);
          refs.line.setAttribute("y1", anchorPctY);
          refs.line.setAttribute("x2", cardPctX);
          refs.line.setAttribute("y2", cardPctY);
        }
        if (refs.anchor) {
          refs.anchor.setAttribute("cx", anchorPctX);
          refs.anchor.setAttribute("cy", anchorPctY);
        }
      });
    });
  }, [subscribeToProgress, cards]); // removed breakpoint dependency to avoid re-subscribing

  return (
    <>
      {cards.map((card) => (
        <OptimizedMetadataNode
          key={card.label}
          data={card}
          reduced={reduced}
          registerRef={(refs) => {
             if (refs) {
                nodeRefs.current.set(card.label, refs);
             } else {
                nodeRefs.current.delete(card.label);
             }
          }}
        />
      ))}
    </>
  );
}

// Single Node Component (Optimized for Ref access)
function OptimizedMetadataNode({ 
  data, 
  reduced, 
  registerRef 
}: { 
  data: CardData; 
  reduced: boolean; 
  registerRef: (refs: any) => void 
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const anchorRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (containerRef.current && cardRef.current && lineRef.current && anchorRef.current) {
        registerRef({
            container: containerRef.current,
            card: cardRef.current,
            line: lineRef.current,
            anchor: anchorRef.current
        });
    }
  }, [registerRef]);

  const lineColor = "rgba(0, 0, 0, 0.45)";

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <line
          ref={lineRef}
          x1="0" y1="0" x2="0" y2="0"
          stroke={lineColor}
          strokeWidth="1"
        />
        <circle
          ref={anchorRef}
          cx="0" cy="0" r="3"
          fill={lineColor}
        />
      </svg>
      <div
        ref={cardRef}
        className="absolute pointer-events-auto"
        style={{
          transform: "translate(-50%, -50%)",
          transition: reduced ? "none" : "transform 0.2s ease",
          willChange: "left, top" // Hint browser
        }}
      >
        <div
          className="rounded-lg overflow-hidden p-2 sm:p-3 w-36 sm:w-48 md:w-56 bg-white/85 backdrop-blur-sm"
          style={{ border: `1px solid ${lineColor}` }}
        >
          <div className="relative h-20 sm:h-24 w-full rounded-md overflow-hidden mb-3 bg-gray-100 border border-black/5">
            <img
              src={data.imageSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "scale(1.2)" }}
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>

          <div className="font-mono text-[10px] md:text-xs leading-tight text-black space-y-1">
            <div className="font-medium opacity-100 mb-2 tracking-wide">{data.label}</div>
            <div className="flex justify-between opacity-60">
              <span>MODE</span>
              <span>{data.mode.split(": ")[1] || "N/A"}</span>
            </div>
            <div className="flex justify-between opacity-60">
              <span>STATUS</span>
              <span>{data.status.split(": ")[1] || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
