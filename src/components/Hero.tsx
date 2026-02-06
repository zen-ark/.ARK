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

import { useEffect, useRef, useState } from "react";

interface HeroProps {
  videoSource: string;
  secondaryVideoSource?: string;
  title: string;
  subtitle: string;
}

export default function Hero({ videoSource, secondaryVideoSource, title, subtitle }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const [showSecondaryVideo, setShowSecondaryVideo] = useState(false);
  const secondaryVideoRef = useRef<HTMLVideoElement>(null);
  const primaryVideoRef = useRef<HTMLVideoElement>(null);

  // Cache dimensions to avoid layout thrashing during scroll
  const metricsRef = useRef({
    sectionTop: 0,
    sectionHeight: 0,
    viewportHeight: 0
  });

  const getVideoType = (src: string) => {
    if (src.toLowerCase().endsWith('.webm')) return 'video/webm';
    return 'video/mp4';
  };

  useEffect(() => {
    const section = sectionRef.current;
    const heroCard = heroCardRef.current;
    
    if (!section || !heroCard) return;

    let rafId: number;
    let ticking = false;

    const measure = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      metricsRef.current = {
        // Absolute top position relative to document
        sectionTop: rect.top + scrollTop,
        sectionHeight: rect.height,
        viewportHeight: window.innerHeight
      };
    };

    const updateHeroTransform = () => {
      if (!heroCardRef.current) return;

      const { sectionTop, sectionHeight, viewportHeight } = metricsRef.current;
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;

      // Calculate progress using cached dimensions
      const scrollStart = sectionTop;
      const scrollDistance = sectionHeight - viewportHeight;
      
      // Calculate how far we've scrolled past the start
      const scrolled = currentScrollY - scrollStart;
      
      let progress = 0;
      if (scrollDistance > 0) {
        progress = scrolled / scrollDistance;
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
      const heroCard = heroCardRef.current;
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
        heroCard.style.width = "calc(100vw - 24px)"; // Mobile: smaller margins
        heroCard.style.height = "calc(100vh - 24px)";
        heroCard.style.clipPath = "inset(0 round 16px)"; // Mobile: smaller radius
        
        // Desktop override via media query or check width
        if (window.innerWidth >= 768) {
             heroCard.style.width = "calc(100vw - calc(var(--space-4) * 2))";
             heroCard.style.height = "calc(100vh - calc(var(--space-4) * 2))";
             heroCard.style.clipPath = "inset(0 round var(--space-8))";
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateHeroTransform);
        ticking = true;
      }
    };

    // Initial measurement
    measure();
    // Initial calculation
    updateHeroTransform();

    // Listen to scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("resize", updateHeroTransform, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("resize", updateHeroTransform);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handlePrimaryVideoEnded = () => {
    if (secondaryVideoSource) {
      setShowSecondaryVideo(true);
      if (secondaryVideoRef.current) {
        secondaryVideoRef.current.currentTime = 0;
        secondaryVideoRef.current.play().catch(() => {
          // Handle potential play errors (e.g., if autoplay policy interferes)
        });
      }
    }
  };

  const handleSecondaryVideoEnded = () => {
    setShowSecondaryVideo(false);
    if (primaryVideoRef.current) {
      primaryVideoRef.current.currentTime = 0;
      primaryVideoRef.current.play().catch(() => {
        // Handle potential play errors
      });
    }
  };

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
          data-theme="dark"
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
          {/* Background Video 1 (Primary) */}
          <video
            ref={primaryVideoRef}
            autoPlay
            loop={!secondaryVideoSource}
            muted
            playsInline
            onEnded={handlePrimaryVideoEnded}
            className={`absolute inset-0 w-full h-full object-cover bg-black transition-opacity duration-300 ${showSecondaryVideo ? 'opacity-0' : 'opacity-100'}`}
            aria-hidden="true"
          >
            <source src={videoSource} type={getVideoType(videoSource)} />
          </video>

          {/* Background Video 2 (Secondary/Loop) */}
          {secondaryVideoSource && (
            <video
              ref={secondaryVideoRef}
              loop={false}
              muted
              playsInline
              onEnded={handleSecondaryVideoEnded}
              className={`absolute inset-0 w-full h-full object-cover bg-black transition-opacity duration-300 ${showSecondaryVideo ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden="true"
            >
              <source src={secondaryVideoSource} type={getVideoType(secondaryVideoSource)} />
            </video>
          )}

          {/* Text Content - Editorial Layout */}
          <div 
            className="text-left relative z-10"
            style={{
              marginLeft: 'clamp(1rem, 3vw, 2.5rem)', // Reduced min margin for mobile
              marginBottom: 'clamp(1rem, 3vw, 2.5rem)', // Reduced min margin for mobile
              opacity: 0,
              transform: 'translateY(12px)',
              animation: 'heroTextFadeIn 0.6s ease-out 0.3s forwards',
            }}
          >
            <h1
              id="hero-title"
              className="font-normal leading-[1.15] tracking-[-0.01em] mb-[clamp(1.25rem, 3vw, 2.5rem)] text-left"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 4rem)', // Adjusted for better mobile scaling
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
                fontSize: 'clamp(0.9rem, 1.4vw, 1.35rem)', // Slightly smaller min size
                color: 'rgba(255, 255, 255, 0.82)',
                fontWeight: 400,
                lineHeight: 1.45,
                letterSpacing: '-0.015em',
                maxWidth: '90%', // Ensure it doesn't hit the edge on small screens
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
