import React, { useRef, useState, useEffect } from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';

interface EqualizerScrollProps {
  scrollYProgress: any; // MotionValue<number>
  projects: Array<{ id: number; title: string; category: string; year: string; src: string }>;
  activeProject: number;
  cutoutHeight?: number;
}

// Matches ProjectsV6 transition for sync
const ARK_LAYOUT_TRANSITION = { type: "spring", stiffness: 180, damping: 45 } as const;

// Sub-component to handle the individual tick rendering
const EqualizerTick = ({ tickIndex, totalTicks, smoothProgress, totalSegments, milestoneIndex, isMobile }: {
  tickIndex: number;
  totalTicks: number;
  smoothProgress: any;
  totalSegments: number;
  milestoneIndex: number;
  isMobile: boolean;
}) => {
  const isMilestone = milestoneIndex !== -1;
          
  // Calculate distance from current scroll position (the "wave")
  const currentTickPosition = useTransform(smoothProgress, (latest: any) => {
    // latest is 0 to 1 (normalized progress)
    return latest * (totalTicks - 1);
  });
  
  const distanceFromWave = useTransform(currentTickPosition, (currentPos) => {
    return Math.abs(tickIndex - currentPos);
  });
  
  // Calculate bar width using Gaussian distribution (responsive)
  const barWidth = useTransform(distanceFromWave, (distance) => {
    const milestoneWidth = isMobile ? 20 : 40;
    const baseWidth = isMobile ? 6 : 12;
    const maxWidth = isMobile ? 20 : 40;
    
    if (isMilestone) {
      return milestoneWidth;
    }
    
    const sigma = 4;
    const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
    
    return baseWidth + (maxWidth - baseWidth) * gaussian;
  });
  
  // Calculate opacity/color intensity
  const opacity = useTransform(distanceFromWave, (distance) => {
    if (isMilestone) {
      const sigma = 4;
      const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
      return 0.6 + 0.4 * gaussian;
    }
    
    const sigma = 4;
    const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
    
    const baseOpacity = 0.2;
    const maxOpacity = 1;
    
    return baseOpacity + (maxOpacity - baseOpacity) * gaussian;
  });
  
  return (
    <motion.div
      className="relative flex items-center"
      style={{
        height: '1px',
      }}
    >
      <motion.div
        style={{
          width: barWidth,
          height: '1px',
          backgroundColor: '#000',
          opacity: opacity,
        }}
        className="bg-black"
      />
      
      {isMilestone && (
        <motion.div
          style={{
            opacity: useTransform(distanceFromWave, (distance) => {
              const sigma = 5;
              const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
              return 0.7 + 0.3 * gaussian;
            }),
          }}
          className="ml-2 md:ml-3 flex items-baseline gap-0.5 md:gap-1"
        >
          <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-wider text-gray-400">
            project
          </span>
          <span className="font-mono text-[10px] md:text-[12px] uppercase tracking-wider text-black font-medium">
            {String(milestoneIndex + 1).padStart(2, '0')}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function EqualizerScroll({ scrollYProgress, projects, activeProject, cutoutHeight = 0 }: EqualizerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
  }, [cutoutHeight]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dynamic Calculation of Ticks
  const availableHeight = Math.max(0, containerHeight);
  const totalTicks = Math.floor(availableHeight / 3);

  // Use scrollYProgress to drive the wave continuously
  // Map scroll (0 to 1) directly to the normalized range (0 to 1)
  const animatedProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 200 });

  // Pass this animated value to ticks
  // We don't use totalSegments scaling anymore, we use 0-1 range directly logic inside ticks
  // But to keep tick logic similar, we can map 0-1 to 0-(totalTicks-1) inside the tick component


  // Calculate milestone positions (where projects start)
  const milestonePositions = projects.map((_, index) => {
    if (totalTicks <= 1) return 0;

    // User requested first project at start (0)
    if (index === 0) return 0;
    
    // For all other projects, place milestones at the transition threshold
    // Switch to project i happens at i / projects.length (linear mapping)
    // In ProjectsV6: const rawIndex = latest * projects.length;
    // So transition from 0 to 1 happens at latest = 1 / N = 0.2
    // Transition from 1 to 2 happens at latest = 2 / N = 0.4
    // etc.
    const threshold = index / projects.length;
    return Math.round(threshold * (totalTicks - 1));
  });

  return (
    <motion.div 
      ref={containerRef}
      className="absolute left-2 bottom-0 w-[60px] md:w-[120px] flex flex-col items-start justify-end z-30"
      initial={false}
      animate={{
        height: cutoutHeight ? `calc(100% - ${cutoutHeight}px)` : '75vh'
      }}
      transition={ARK_LAYOUT_TRANSITION}
      style={{ 
        marginBottom: '0px' 
      }}
    >
      <div className="relative h-full w-full flex flex-col items-start justify-end gap-[2px] pb-0">
        {Array.from({ length: totalTicks }).map((_, tickIndex) => {
          const milestoneIndex = milestonePositions.findIndex((milestone) => {
            return tickIndex === milestone;
          });
          
          return (
            <EqualizerTick 
              key={tickIndex}
              tickIndex={tickIndex}
              totalTicks={totalTicks}
              smoothProgress={animatedProgress}
              totalSegments={0} // Unused now
              milestoneIndex={milestoneIndex}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
