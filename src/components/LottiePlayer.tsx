import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface LottiePlayerProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottiePlayer({
  src,
  className,
  loop = true,
  autoplay = true,
}: LottiePlayerProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimation = async () => {
      try {
        const response = await fetch(encodeURI(src));
        if (!response.ok) {
          throw new Error(`Failed to fetch Lottie JSON: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setAnimationData(data);
      } catch (err: any) {
        console.error("Error loading Lottie animation:", err);
        setError(err.message);
      }
    };

    fetchAnimation();
  }, [src]);

  if (error) {
    return <div className="flex items-center justify-center w-full h-full bg-red-100 text-red-500 text-xs p-2">Error loading animation</div>;
  }

  if (!animationData) return <div className="w-full h-full bg-gray-100 animate-pulse" />;

  return (
    <div className={`w-full h-full ${className || ''}`}>
        <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
        />
    </div>
  );
}
