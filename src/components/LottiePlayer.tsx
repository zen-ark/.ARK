import React, { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";

interface LottiePlayerProps {
  src: string;
  className?: string;
  loop?: boolean;
  backgroundColor?: string;
  isFirst?: boolean;
  autoplay?: boolean;
}

// Global cache outside component
const lottieCache = new Map<string, any>();

export default function LottiePlayer({
  src,
  className,
  loop = true,
  backgroundColor,
  isFirst = false,
  autoplay = false,
}: LottiePlayerProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load Animation Data
  useEffect(() => {
    const fetchAnimation = async () => {
      // Check cache first
      if (lottieCache.has(src)) {
          let data = lottieCache.get(src);
           // Clone to avoid mutation issues if we patch colors
          if (backgroundColor) {
             // Deep clone needed if we modify layers
             data = JSON.parse(JSON.stringify(data));
             if (data.layers) {
                data.layers = data.layers.map((layer: any) => {
                  if (layer.ty === 1 && layer.sw === data.w && layer.sh === data.h) {
                    return { ...layer, sc: backgroundColor };
                  }
                  return layer;
                });
             }
          }
          setAnimationData(data);
          return;
      }

      try {
        const response = await fetch(encodeURI(src).replace(/%2520/g, "%20"));
        if (!response.ok) {
          throw new Error(`Failed to fetch Lottie JSON: ${response.status} ${response.statusText}`);
        }
        let data = await response.json();
        
        // Store original in cache
        lottieCache.set(src, JSON.parse(JSON.stringify(data)));

        // Patch background color if requested
        if (backgroundColor && data.layers) {
           // We modified 'data' directly above for cache, so cloning is safe/needed
           // Actually, let's keep cache pure and modify a copy
           // Since we cached a clone above, 'data' is still the fetch result.
           // Let's reset: 
        }
        
        // Re-logic for cleanliness:
        // 1. Fetch
        // 2. Cache pure data
        // 3. Clone for usage
        // 4. Modify clone if needed
        
      } catch (err: any) {
        console.error("Error loading Lottie animation:", err);
        setError(err.message);
      }
    };
    
    // Correct Implementation
    const loadAndCache = async () => {
         try {
             let data;
             if (lottieCache.has(src)) {
                 data = JSON.parse(JSON.stringify(lottieCache.get(src)));
             } else {
                 const response = await fetch(encodeURI(src).replace(/%2520/g, "%20"));
                 if (!response.ok) throw new Error("Failed to fetch");
                 const jsonData = await response.json();
                 lottieCache.set(src, jsonData);
                 data = JSON.parse(JSON.stringify(jsonData));
             }

             if (backgroundColor && data.layers) {
                data.layers = data.layers.map((layer: any) => {
                    if (layer.ty === 1 && layer.sw === data.w && layer.sh === data.h) {
                        return { ...layer, sc: backgroundColor };
                    }
                    return layer;
                });
             }
             
             setAnimationData(data);

         } catch (e: any) {
             setError(e.message);
         }
    };

    loadAndCache();
  }, [src, backgroundColor]);

  // LOTTIE CONTROL
  useEffect(() => {
    if (!lottieRef.current || !animationData) return;
    
    if (autoplay || isHovered) {
      lottieRef.current.play();
    } else {
      lottieRef.current.pause();
      // Optional: reset to frame 0
      // lottieRef.current.goToAndStop(0, true); 
    }
  }, [isHovered, animationData, autoplay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (error) {
    return <div className="flex items-center justify-center w-full h-full bg-red-100 text-red-500 text-xs p-2">Error</div>;
  }

  if (!animationData) return <div className="w-full h-full bg-gray-100/10 animate-pulse" />;

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className || ''} transition-all duration-300 ease-out`}
      style={{
        opacity: 1, // Always fully visible
        filter: 'grayscale(0%)' // No grayscale
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={loop}
          autoplay={false} // Controlled via useEffect
          style={{ width: "100%", height: "100%" }}
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
            renderer: "canvas",
          }}
        />
    </div>
  );
}
