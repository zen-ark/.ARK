"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import MetadataNode from "./MetadataNode";

interface CardData {
  label: string;
  mode: string;
  status: string;
  imageSrc: string;
}

const FRAME_COUNT = 272;
const getFrameSrc = (index: number) =>
  `/no bg png sequence/no bg${String(index + 1).padStart(4, "0")}.png`;

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
      cardPath: { start: { x: 0.72, y: 0.45 }, end: { x: 0.8, y: 0.12 } },
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
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

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
      img.decode()
        .then(() => createImageBitmap(img))
        .then((bitmap) => {
          frameCacheRef.current[index] = bitmap;
          frameLoadingRef.current[index] = false;
          if (currentFrameIndexRef.current === index) {
            drawFrame(index);
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
      if (index === currentFrameIndexRef.current) return;
      currentFrameIndexRef.current = index;
      const frame = frameCacheRef.current[index];
      if (frame) {
        drawFrame(index);
      } else {
        ensureFrame(index);
      }
      ensureFrame(index + 1);
      ensureFrame(index + 2);
      ensureFrame(index - 1);
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
      if (currentFrameIndexRef.current >= 0 && frameCacheRef.current[currentFrameIndexRef.current]) {
        drawFrame(currentFrameIndexRef.current);
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
      progressListenersRef.current.forEach((listener) => listener(progress));
    };

    const animationLoop = () => {
      const ease = reduced ? 1 : 0.05;
      const diff = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * ease;
        applyFrame(currentProgressRef.current);
        rafIdRef.current = requestAnimationFrame(animationLoop);
      } else if (Math.abs(diff) > 0) {
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

  // Removed separate video control effect as it's integrated into the loop

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

          {/* Copy row - two columns on desktop */}
          <div className="wtark-copy mb-8 lg:mb-16 px-6 flex-shrink-0">
            <div className="hidden lg:flex lg:justify-between lg:gap-8">
              <p className="wtark-copy-text wtark-copy-left">
                .ARK IS A DIGITAL STUDIO BUILT AROUND ONE EXTENSION, RUN BY A SINGLE DESIGNER.
              </p>
              <p className="wtark-copy-text wtark-copy-right">
                WE CRAFT CLEAR INTERFACES AND CINEMATIC WEB EXPERIENCES WITH PRECISION AND EXPERIMENTATION.
              </p>
            </div>
            
            {/* Mobile: stacked */}
            <div className="lg:hidden flex flex-col gap-4">
              <p className="wtark-copy-text" style={{ textAlign: "left" }}>
                {`.ARK IS A DIGITAL STUDIO BUILT AROUND ONE EXTENSION, RUN BY A SINGLE DESIGNER.`}
              </p>
              <p className="wtark-copy-text" style={{ textAlign: "left" }}>
                {`WE CRAFT CLEAR INTERFACES AND CINEMATIC WEB EXPERIENCES WITH PRECISION AND EXPERIMENTATION.`}
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

              {/* Metadata Overlay - Floating Node */}
              <MetadataOverlayWrapper
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

interface MetadataOverlayWrapperProps {
  cards: CardData[];
  reduced: boolean;
  subscribeToProgress: (listener: (value: number) => void) => () => void;
}

function MetadataOverlayWrapper({
  cards,
  reduced,
  subscribeToProgress,
}: MetadataOverlayWrapperProps) {
  const [progress, setProgress] = useState(0);
  const breakpoint = useBreakpoint();

  useEffect(() => subscribeToProgress(setProgress), [subscribeToProgress]);

  return (
    <>
      {cards.map((card) => {
        const fullConfig = METADATA_VISUALS[card.label];
        if (!fullConfig) return null;

        // Fallback to desktop config if specific breakpoint config is missing,
        // or merge partial config with desktop defaults if needed.
        // For simplicity here: take mobile/tablet if available, else desktop.
        // A deeper merge could be done if we want partial overrides.
        let config = fullConfig.desktop;
        if (breakpoint === "mobile" && fullConfig.mobile) {
          config = { ...config, ...fullConfig.mobile };
        } else if (breakpoint === "tablet" && fullConfig.tablet) {
          config = { ...config, ...fullConfig.tablet };
        }

        const startProgress = config.startFrame / (FRAME_COUNT - 1);
        const animationWindow =
          config.animationWindow > 0 ? config.animationWindow / (FRAME_COUNT - 1) : 0.01;
        const t =
          progress <= startProgress
            ? 0
            : clamp((progress - startProgress) / animationWindow, 0, 1);
        const visible = progress >= startProgress;
        const anchorPosition = {
          x: lerp(config.anchorPath.start.x, config.anchorPath.end.x, t),
          y: lerp(config.anchorPath.start.y, config.anchorPath.end.y, t),
        };
        
        // Constrain card position within safe viewport bounds (approx. 5% padding)
        let cardX = lerp(config.cardPath.start.x, config.cardPath.end.x, t);
        let cardY = lerp(config.cardPath.start.y, config.cardPath.end.y, t);
        
        // Simple clamping to prevent overflow (0.05 - 0.95)
        // This is a rough safeguard; specific breakpoint configs in METADATA_VISUALS are better.
        cardX = Math.max(0.05, Math.min(0.95, cardX));
        cardY = Math.max(0.1, Math.min(0.9, cardY));

        const cardPosition = { x: cardX, y: cardY };

        return (
          <MetadataNode
            key={card.label}
            label={card.label}
            mode={card.mode}
            status={card.status}
            imageSrc={card.imageSrc}
            visible={visible}
            reduced={reduced}
            anchor={anchorPosition}
            card={cardPosition}
          />
        );
      })}
    </>
  );
}

