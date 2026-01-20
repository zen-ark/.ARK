import { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface PortfolioAnimationProps {
  children: React.ReactNode;
}

export default function PortfolioAnimation({ children }: PortfolioAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Wait for hydration/mounting
  useEffect(() => {
    setIsReady(true);
  }, []);

  useGSAP(
    () => {
      if (!isReady) return;

      const logo = document.querySelector(".shain-logo-wrapper");
      const letters = document.querySelectorAll(".shain-logo .letter");
      const intro = document.querySelector(".portfolio-intro-content");
      const grid = document.querySelector(".projects-grid-content");

      if (!logo || !intro || !grid) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
         // Set everything to visible immediately without animation
         gsap.set(logo, { opacity: 1 });
         gsap.set(letters, { y: 0, opacity: 1 });
         gsap.set(intro, { y: 0, opacity: 1 });
         gsap.set(document.querySelectorAll(".project-item"), { y: 0, opacity: 1 });
         return;
      }

      // 1. Initial Load Animation
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
      });

      // Initially hide elements
      // Note: grid container itself is not hidden, but its children (projects) will be
      gsap.set(intro, { opacity: 0, y: 30 });
      
      const projectItems = Array.from(document.querySelectorAll(".project-item"));
      const firstTwo = projectItems.slice(0, 2);
      const remaining = projectItems.slice(2);

      gsap.set(projectItems, { opacity: 0, y: 50 });
      
      // Setup logo letters animation
      // Increase vertical movement (y: 120) and stagger
      gsap.set(logo, { opacity: 1 });
      gsap.set(letters, { y: 120, opacity: 0 });

      tl.to(letters, {
        y: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.08,
      })
        .to(
          intro,
          {
            y: 0,
            opacity: 1,
            duration: 1,
          },
          "-=0.8"
        )
        .add(() => {
          // 1. First two projects: Animate once and stay
          if (firstTwo.length > 0) {
            ScrollTrigger.batch(firstTwo, {
              onEnter: (batch) => {
                gsap.to(batch, {
                  opacity: 1,
                  y: 0,
                  duration: 1,
                  stagger: 0.15,
                  ease: "power3.inOut",
                  overwrite: true,
                });
              },
              start: "top 95%",
              once: true,
            });
          }

          // 2. Remaining projects: Animate in on scroll, reset on scroll up
          if (remaining.length > 0) {
            ScrollTrigger.batch(remaining, {
              onEnter: (batch) => {
                gsap.to(batch, {
                  opacity: 1,
                  y: 0,
                  duration: 1,
                  stagger: 0.15,
                  ease: "power3.inOut",
                  overwrite: true,
                });
              },
              onLeaveBack: (batch) => {
                // Reset when scrolling back up (element leaves bottom of viewport)
                gsap.set(batch, {
                  opacity: 0,
                  y: 50,
                  overwrite: true,
                });
              },
              start: "top 90%", // Slightly earlier to ensure they are visible when expected
              // markers: true, // For debugging if needed
            });
          }
        }, "-=0.4");

      // 2. Scroll Animation (Parallax/Sticky effect)
      // Use matchMedia to only apply parallax on desktop/tablet > 768px
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            // Parallax effect for logo
            // Move logo down at a slower rate than scroll (0.5 speed)
            gsap.set(logo, { 
              y: self.scroll() * 0.5 
            });
          }
        });
      });

      // Cleanup
      return () => mm.revert();

    },
    { scope: containerRef, dependencies: [isReady] }
  );

  return (
    <div ref={containerRef} className="portfolio-anim-wrapper">
      {children}
    </div>
  );
}
