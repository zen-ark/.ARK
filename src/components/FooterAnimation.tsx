import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface FooterAnimationProps {
  children: React.ReactNode;
}

export default function FooterAnimation({ children }: FooterAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useGSAP(
    () => {
      if (!isReady) return;

      const letters = containerRef.current?.querySelectorAll(".shain-logo .letter");
      if (!letters || letters.length === 0) return;

      // Initial State: Hidden and offset
      gsap.set(letters, { y: 120, opacity: 0 });

      // Get footer height from CSS variable or fallback
      const getStartOffset = () => {
        if (typeof window === "undefined") return 300;
        const footerHeightStr = document.documentElement.style.getPropertyValue("--footer-height");
        const footerHeight = parseFloat(footerHeightStr) || 300;
        // Start animation when footer is 30% revealed
        return footerHeight * 0.3;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          // "bottom bottom" is the very end of scroll.
          // We want to trigger when we are close to the end.
          // "bottom-=offset bottom"
          start: () => `bottom-${getStartOffset()}px bottom`, 
          toggleActions: "play reverse play reverse", // Play when enter, reverse when leave back
        }
      });

      tl.to(letters, {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.1,
        ease: "power3.out"
      });

    },
    { scope: containerRef, dependencies: [isReady] }
  );

  return (
    <div ref={containerRef} className="footer-anim-wrapper w-full">
      {children}
    </div>
  );
}
