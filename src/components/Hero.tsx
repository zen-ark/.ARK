/**
 * Hero Component with Three-State Scroll Animation
 * 
 * SCROLL MODEL:
 * - `progress`: A normalized value (0-1) computed from scroll position
 *   - progress = 0: top of hero section touches top of viewport
 *   - progress = 1: bottom of hero section leaves bottom of viewport
 * 
 * THREE MODES (derived from progress, no state):
 *   1. FULLSCREEN (progress < 0.15):
 *      - Hero fills viewport, no border radius, no padding, no white frame
 *   2. LOCKED (0.15 <= progress < 0.55):
 *      - Hero shrinks to card layout with rounded corners and white border
 *      - Sticky positioned, appears pinned while page scrolls
 *   3. RELEASED (progress >= 0.55):
 *      - Maintains card appearance but scrolls away naturally
 * 
 * DOM STRUCTURE:
 *   - sectionRef: The scroll "stage" (min-h-[180vh]), provides scroll distance
 *   - Sticky wrapper: Always viewport-height, handles sticky positioning
 *   - heroCardRef: The visual element that transforms between states
 */

import { useEffect, useRef } from "react";

interface HeroProps {
  videoSource: string;
  title: string;
  subtitle: string;
}

export default function Hero({ videoSource, title, subtitle }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);

  // Inject keyframe animation for editorial fade-in
  useEffect(() => {
    const styleId = 'hero-text-animation';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes heroTextFadeIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const heroCard = heroCardRef.current;
    
    if (!section || !heroCard) return;

    let rafId: number;
    let ticking = false;

    const updateHeroTransform = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Calculate progress: 0 when section top hits viewport top,
      // 1 when section bottom leaves viewport bottom
      const scrollStart = sectionTop;
      const scrollEnd = sectionTop + sectionHeight - viewportHeight;
      const scrollDistance = sectionHeight - viewportHeight;
      
      let progress = 0;
      if (scrollDistance > 0) {
        progress = -scrollStart / scrollDistance;
      }
      
      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));

      // Derive mode from progress (no state, just computed)
      let mode: "fullscreen" | "locked" | "released";
      if (progress < 0.15) {
        mode = "fullscreen";
      } else if (progress < 0.55) {
        mode = "locked";
      } else {
        mode = "released";
      }

      // Apply visual transformations based on mode
      if (mode === "fullscreen") {
        // Full viewport: force full width/height and remove all decorative styling
        heroCard.style.width = "100vw";
        heroCard.style.height = "100vh";
        heroCard.style.margin = "0";
        heroCard.style.borderRadius = "0";
        heroCard.style.borderWidth = "0";
        heroCard.style.clipPath = "inset(0)";
      } else {
        // Locked/Released: almost fullscreen with visible frame
        // Force dimensions to be almost full viewport (accounting for margin + border)
        heroCard.style.width = "calc(100vw - calc(var(--space-4) * 2))";
        heroCard.style.height = "calc(100vh - calc(var(--space-4) * 2))";
        heroCard.style.margin = "";
        heroCard.style.borderRadius = "";
        heroCard.style.borderWidth = "";
        heroCard.style.clipPath = "inset(0 round var(--space-8))";
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateHeroTransform);
        ticking = true;
      }
    };

    // Initial calculation
    updateHeroTransform();

    // Listen to scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateHeroTransform, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateHeroTransform);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[180vh]"
      aria-label="Hero section"
    >
      {/* Sticky wrapper: purely structural, no visual styles */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {/* Hero card: uses original design classes, inline styles override for fullscreen only */}
        <header
          ref={heroCardRef}
          id="hero"
          className="w-screen h-[calc(100vh-var(--space-8))] flex items-end justify-start relative overflow-hidden rounded-[var(--space-8)] border-[var(--space-4)] border-[hsl(var(--color-bg-canvas))] m-[var(--space-4)] transition-all duration-500 ease-out motion-reduce:duration-200"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            isolation: 'isolate',
            clipPath: 'inset(0 round var(--space-8))',
          }}
          aria-labelledby="hero-title"
        >
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover bg-black"
            aria-hidden="true"
          >
            <source src={videoSource} type="video/mp4" />
          </video>

          {/* Text Content - Editorial Layout */}
          <div 
            className="text-left relative z-10"
            style={{
              marginLeft: 'clamp(1.5rem, 3vw, 2.5rem)',
              marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
              opacity: 0,
              transform: 'translateY(12px)',
              animation: 'heroTextFadeIn 0.6s ease-out 0.3s forwards',
            }}
          >
            <h1
              id="hero-title"
              className="font-normal leading-[1.15] tracking-[-0.01em] mb-[clamp(1.75rem, 3vw, 2.5rem)] text-left"
              style={{
                fontSize: 'clamp(2rem, 3vw, 4rem)',
                color: 'rgba(255, 255, 255, 1)',
                fontWeight: 400,
                background: 'transparent',
                textAlign: 'left',
              }}
            >
              {title.split('. ').map((line, i, arr) => (
                <span key={i}>
                  {line}{i < arr.length - 1 ? '.' : ''}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p 
              className="font-normal text-left"
              style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.35rem)',
                color: 'rgba(255, 255, 255, 0.82)',
                fontWeight: 400,
                lineHeight: 1.45,
                letterSpacing: '-0.015em',
                maxWidth: '52ch',
                textAlign: 'left',
              }}
            >
              {subtitle}
            </p>
          </div>
        </header>
      </div>
    </section>
  );
}
