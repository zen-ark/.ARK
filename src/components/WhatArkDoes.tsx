"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Removed import MetadataNode to inline optimized version
// import MetadataNode from "./MetadataNode";

interface CardData {
  label: string;
  mode: string;
  status: string;
  imageSrc: string;
}

const FRAME_COUNT = 272;
const getFrameSrc = (index: number) =>
  `/no bg webp sequence/no bg${String(index + 1).padStart(4, "0")}.webp`;

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

export default function WhatArkDoes() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCacheRef = useRef<(ImageBitmap | null)[]>(Array(FRAME_COUNT).fill(null));
  const frameLoadingRef = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const currentFrameIndexRef = useRef<number>(-1);
  const progressListenersRef = useRef(new Set<(value: number) => void>());

  const subscribeToProgress = useCallback(
    (listener: (value: number) => void) => {
      progressListenersRef.current.add(listener);
      return () => {
        progressListenersRef.current.delete(listener);
      };
    },
    []
  );

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const bitmap = frameCacheRef.current[index];
    if (!canvas || !bitmap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width * dpr;
    const height = rect.height * dpr;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frameAspect = bitmap.width / bitmap.height;
    const canvasAspect = canvas.width / canvas.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    if (frameAspect > canvasAspect) {
      drawHeight = canvas.width / frameAspect;
    } else {
      drawWidth = canvas.height * frameAspect;
    }
    const dx = (canvas.width - drawWidth) / 2;
    const dy = canvas.height - drawHeight;
    ctx.drawImage(bitmap, dx, dy, drawWidth, drawHeight);
  }, []);

  const ensureFrame = useCallback(
    (index: number) => {
      if (index < 0 || index >= FRAME_COUNT) return;
      if (frameCacheRef.current[index] || frameLoadingRef.current[index]) return;
      frameLoadingRef.current[index] = true;

      const img = new Image();
      img.src = getFrameSrc(index);

      // Calculate target dimensions - cap at 1080p width to save memory
      const MAX_WIDTH = 2560;

      img.decode()
        .then(() => createImageBitmap(img, { resizeWidth: MAX_WIDTH }))
        .then((bitmap) => {
          frameCacheRef.current[index] = bitmap;
          frameLoadingRef.current[index] = false;
          // If this is a frame we might need (close to current), redraw
          const currentIndex = currentFrameIndexRef.current;
          if (Math.abs(currentIndex - index) < 5) {
             // Redraw closest available frame
             // This might trigger a redraw if we are waiting on the current frame
             if (currentIndex === index || frameCacheRef.current[currentIndex] === null) {
                // If we are currently trying to show 'index', or if the current target 'currentIndex' 
                // is missing but 'index' just loaded and is close, we might want to update.
                // But generally, we only redraw if it's the specific target or we need a fallback.
                // Let the animation loop handle it via renderFrame usually, 
                // but if animation stopped, we might need to force a paint.
             }
          }
        })
        .catch(() => {
          frameLoadingRef.current[index] = false;
        });
    },
    [drawFrame]
  );

  const renderFrame = useCallback(
    (progress: number) => {
      const index = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(progress * (FRAME_COUNT - 1)))
      );
      
      currentFrameIndexRef.current = index;
      
      // FALLBACK STRATEGY:
      // If the exact frame is missing, find the closest available one to show.
      // This prevents the "stopping" effect where the canvas freezes.
      let frameToDrawIndex = index;
      if (!frameCacheRef.current[index]) {
         // Search outwards for closest cached frame
         let dist = 1;
         let found = -1;
         // Search up to 20 frames away
         while (dist < 20) {
           if (index - dist >= 0 && frameCacheRef.current[index - dist]) {
             found = index - dist;
             break;
           }
           if (index + dist < FRAME_COUNT && frameCacheRef.current[index + dist]) {
             found = index + dist;
             break;
           }
           dist++;
         }
         if (found !== -1) {
            frameToDrawIndex = found;
         }
         // If nothing found, we just keep whatever is on canvas (which is effectively the last drawn frame)
      }

      const frame = frameCacheRef.current[frameToDrawIndex];
      if (frame) {
        drawFrame(frameToDrawIndex);
      } else {
        ensureFrame(index); // Ensure the target frame is loading
      }

      // Preload logic with Velocity Lookahead
      // If we jumped far, we might want to prioritize differently.
      // For now, simple window:
      const BUFFER = 2; // Immediate neighbors
      for (let i = 1; i <= BUFFER; i++) {
        ensureFrame(index + i);
        ensureFrame(index - i);
      }
      
      // Lookahead: If we are scrolling down (implied by sequence), load ahead more
      // Since we don't track velocity explicitly here easily without state, 
      // we can just bias the lookahead slightly forward as users mostly scroll down.
      ensureFrame(index + 3);
      ensureFrame(index + 4);
      ensureFrame(index + 5);

      // Clean up distant frames
      // Increased buffer size to 60 to allow for faster scrolling without constant re-decoding
      const CACHE_BUFFER = 60;
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (Math.abs(i - index) > CACHE_BUFFER) {
          if (frameCacheRef.current[i]) {
            frameCacheRef.current[i]?.close();
            frameCacheRef.current[i] = null;
            frameLoadingRef.current[i] = false;
          }
        }
      }
    },
    [drawFrame, ensureFrame]
  );

  useEffect(() => {
    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      const parent = canvasRef.current.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = rect.height * dpr;
      canvasRef.current.style.width = `${rect.width}px`;
      canvasRef.current.style.height = `${rect.height}px`;
      
      // Redraw current if valid
      const idx = currentFrameIndexRef.current;
      if (idx >= 0 && frameCacheRef.current[idx]) {
        drawFrame(idx);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [drawFrame]);

  useEffect(() => {
    ensureFrame(0);
    ensureFrame(1);
    ensureFrame(2);
  }, [ensureFrame]);

  const reduced = usePrefersReducedMotion();

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
    const timeoutId = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      clearTimeout(timeoutId);
    };
  }, []);

  // Rebuilt scroll logic with precomputed bounds and momentum interpolation
  useEffect(() => {
    const boundsRef = { start: 0, end: 0 };
    const targetProgressRef = { current: 0 };
    const currentProgressRef = { current: 0 };
    const rafIdRef = { current: 0 };

    const applyFrame = (progress: number) => {
      renderFrame(progress);
      // Notify listeners (like our optimized overlay)
      progressListenersRef.current.forEach((listener) => listener(progress));
    };

    const animationLoop = () => {
      const ease = reduced ? 1 : 0.05;
      let diff = targetProgressRef.current - currentProgressRef.current;
      
      // Clamp speed to prevent skipping too many frames
      // 0.005 roughly corresponds to ~1.3 frames per tick at 60fps
      const MAX_SPEED = 0.005; 
      if (!reduced) {
        diff = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, diff));
      }

      if (Math.abs(diff) > 0.00001) {
        currentProgressRef.current += diff * (reduced ? 1 : 0.8); // slight ease on top of clamp
        // If we clamped, we might be drifting from target, so we just add the clamped diff
        // But if we are close (diff small), the ease logic above (original code used ease) 
        // essentially does the same. 
        // Let's rewrite slightly for clarity:
        
        // Apply velocity
        // If the gap is huge (fast scroll), we just move at MAX_SPEED.
        // If the gap is small, we ease into it.
        if (Math.abs(targetProgressRef.current - currentProgressRef.current) > MAX_SPEED) {
            // Far away: Move constant speed
            currentProgressRef.current += diff; 
        } else {
            // Close: Ease
            currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * ease;
        }

        applyFrame(currentProgressRef.current);
        rafIdRef.current = requestAnimationFrame(animationLoop);
      } else if (Math.abs(targetProgressRef.current - currentProgressRef.current) > 0) {
        currentProgressRef.current = targetProgressRef.current;
        applyFrame(currentProgressRef.current);
        rafIdRef.current = 0;
      } else {
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
      if (end <= start) {
        targetProgressRef.current = 0;
      } else {
        const raw = (window.scrollY - start) / (end - start);
        targetProgressRef.current = Math.max(0, Math.min(1, raw));
      }

      if (reduced) {
        currentProgressRef.current = targetProgressRef.current;
        applyFrame(currentProgressRef.current);
      } else {
        startAnimation();
      }
    };

    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const start = window.scrollY + rect.top;
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
  }, [reduced, renderFrame]);

  return (
    <section
      ref={containerRef}
      id="what-the-ark"
      className="w-full relative"
      style={{
        height: "300vh", // Tall container for scroll space
        backgroundColor: "hsl(var(--color-bg-canvas))"
      }}
    >
      {/* Sticky Wrapper */}
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

        {/* Canvas Stage - displays frame sequence */}
        <div className="flex-1 w-full relative flex items-end justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-end justify-center" style={{ backgroundColor: "white" }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{
                display: "block",
                pointerEvents: "none",
              }}
            />

            {/* Metadata Overlay - Floating Node - Optimized Version */}
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
    line: SVGLineElement;
    anchorDot: SVGCircleElement;
    cardDot: SVGCircleElement;
    card: HTMLDivElement;
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
        const anchorX = lerp(config.anchorPath.start.x, config.anchorPath.end.x, t);
        const anchorY = lerp(config.anchorPath.start.y, config.anchorPath.end.y, t);
        
        let cardX = lerp(config.cardPath.start.x, config.cardPath.end.x, t);
        let cardY = lerp(config.cardPath.start.y, config.cardPath.end.y, t);
        
        // Clamp
        cardX = Math.max(0.05, Math.min(0.95, cardX));
        cardY = Math.max(0.1, Math.min(0.9, cardY));

        const anchorPctX = (anchorX * 100).toFixed(2) + "%";
        const anchorPctY = (anchorY * 100).toFixed(2) + "%";
        const cardPctX = (cardX * 100).toFixed(2) + "%";
        const cardPctY = (cardY * 100).toFixed(2) + "%";

        // 3. Update DOM directly (Imperative Animation)
        
        // Update Line
        refs.line.setAttribute("x1", anchorPctX);
        refs.line.setAttribute("y1", anchorPctY);
        refs.line.setAttribute("x2", cardPctX);
        refs.line.setAttribute("y2", cardPctY);

        // Update Dots
        refs.anchorDot.setAttribute("cx", anchorPctX);
        refs.anchorDot.setAttribute("cy", anchorPctY);
        refs.cardDot.setAttribute("cx", cardPctX);
        refs.cardDot.setAttribute("cy", cardPctY);

        // Update Card Position
        // Using left/top + transform translate(-50%, -50%) matches original CSS logic
        refs.card.style.left = cardPctX;
        refs.card.style.top = cardPctY;
        // Optimization: Could use transform translate(vw, vh) to avoid 'left/top' layout thrashing, 
        // but % based layout is tricky with transforms alone without window resize observer. 
        // Given we bypassed React, this should be fast enough.
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
  const lineRef = useRef<SVGLineElement>(null);
  const anchorDotRef = useRef<SVGCircleElement>(null);
  const cardDotRef = useRef<SVGCircleElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && lineRef.current && anchorDotRef.current && cardDotRef.current && cardRef.current) {
        registerRef({
            container: containerRef.current,
            line: lineRef.current,
            anchorDot: anchorDotRef.current,
            cardDot: cardDotRef.current,
            card: cardRef.current
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
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <line
          ref={lineRef}
          stroke={lineColor}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <circle ref={anchorDotRef} r="2" fill={lineColor} />
        <circle ref={cardDotRef} r="2" fill={lineColor} />
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
          className="rounded-lg overflow-hidden p-2 sm:p-3 w-40 sm:w-48 md:w-56 bg-white/85 backdrop-blur-sm"
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
