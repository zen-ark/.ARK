import React, { useRef, useState, useEffect } from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';

interface EqualizerScrollProps {
  scrollYProgress: any; // MotionValue<number>
  projects: Array<{ id: number; title: string; category: string; year: string; src: string }>;
  activeProject: number;
  cutoutHeight?: number;
}

// Matches ProjectsV6 transition for sync
const ARK_LAYOUT_TRANSITION = { type: "spring", stiffness: 180, damping: 45 };

// Sub-component to handle the individual tick rendering
const EqualizerTick = ({ tickIndex, totalTicks, smoothProgress, totalSegments, milestoneIndex }: {
  tickIndex: number;
  totalTicks: number;
  smoothProgress: any;
  totalSegments: number;
  milestoneIndex: number;
}) => {
  const isMilestone = milestoneIndex !== -1;
          
  // Calculate distance from current scroll position (the "wave")
  const currentTickPosition = useTransform(smoothProgress, (latest: any) => {
    return (latest / totalSegments) * (totalTicks - 1);
  });
  
  const distanceFromWave = useTransform(currentTickPosition, (currentPos) => {
    return Math.abs(tickIndex - currentPos);
  });
  
  // Calculate bar width using Gaussian distribution
  const barWidth = useTransform(distanceFromWave, (distance) => {
    if (isMilestone) {
      return 40;
    }
    
    const sigma = 4;
    const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
    
    const baseWidth = 12;
    const maxWidth = 40;
    
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
          className="ml-3 flex items-baseline gap-1"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
            project
          </span>
          <span className="font-mono text-[12px] uppercase tracking-wider text-black font-medium">
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

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
  }, [cutoutHeight]);

  // Dynamic Calculation of Ticks
  const availableHeight = Math.max(0, containerHeight);
  const totalTicks = Math.floor(availableHeight / 3);

  const totalSegments = projects.length + 0.5;
  const projectProgress = useTransform(scrollYProgress, [0, 1], [0, totalSegments]);
  
  const springConfig = { damping: 40, stiffness: 400 };
  const smoothProgress = useSpring(projectProgress, springConfig);

  const milestonePositions = projects.map((_, index) => {
    if (totalTicks <= 1) return 0;
    if (index === 0) return 0;
    if (index === projects.length - 1) return totalTicks - 1;
    return Math.round((index / (projects.length - 1)) * (totalTicks - 1));
  });

  return (
    <motion.div 
      ref={containerRef}
      className="absolute left-4 bottom-0 w-[120px] flex flex-col items-start justify-end z-30"
      initial={false}
      animate={{
        height: cutoutHeight ? `calc(100% - ${cutoutHeight}px)` : '75vh'
      }}
      transition={ARK_LAYOUT_TRANSITION}
      style={{ 
        marginBottom: '40px' 
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
              smoothProgress={smoothProgress}
              totalSegments={totalSegments}
              milestoneIndex={milestoneIndex}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
