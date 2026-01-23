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
      try {
        const response = await fetch(encodeURI(src));
        if (!response.ok) {
          throw new Error(`Failed to fetch Lottie JSON: ${response.status} ${response.statusText}`);
        }
        let data = await response.json();
        
        // Patch background color if requested
        if (backgroundColor && data.layers) {
           data = { ...data };
           data.layers = data.layers.map((layer: any) => {
             if (layer.ty === 1 && layer.sw === data.w && layer.sh === data.h) {
               return { ...layer, sc: backgroundColor };
             }
             return layer;
           });
        }
        
        setAnimationData(data);
      } catch (err: any) {
        console.error("Error loading Lottie animation:", err);
        setError(err.message);
      }
    };

    fetchAnimation();
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
          }}
        />
    </div>
  );
}
