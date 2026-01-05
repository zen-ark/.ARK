import React from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';

interface EqualizerScrollProps {
  scrollYProgress: any; // MotionValue<number>
  projects: Array<{ id: number; title: string; category: string; year: string; src: string }>;
  activeProject: number;
}

export default function EqualizerScroll({ scrollYProgress, projects, activeProject }: EqualizerScrollProps) {
  // Calculate progress per project - matches ProjectsV6 logic
  const totalSegments = projects.length + 0.5;
  const projectProgress = useTransform(scrollYProgress, [0, 1], [0, totalSegments]);
  
  // Spring for smooth animation
  const springConfig = { damping: 40, stiffness: 400 };
  const smoothProgress = useSpring(projectProgress, springConfig);

  // Total number of ticks for the ruler (dense texture)
  // Doubled to 200 ticks for finer detail
  const totalTicks = 200;
  
  // Calculate milestone positions (where projects start)
  // Each project gets an equal segment of the total ticks
  const milestonePositions = projects.map((_, index) => {
    // Distribute milestones evenly: first at 0, last at totalTicks-1
    if (index === 0) return 0;
    if (index === projects.length - 1) return totalTicks - 1;
    return Math.round((index / (projects.length - 1)) * (totalTicks - 1));
  });

  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60vh] w-[120px] flex flex-col items-start justify-center z-30">
      <div className="relative h-full flex flex-col items-start gap-[2px] py-4">
        {Array.from({ length: totalTicks }).map((_, tickIndex) => {
          // Check if this is a milestone (project marker)
          const milestoneIndex = milestonePositions.findIndex((milestone) => {
            return tickIndex === milestone;
          });
          const isMilestone = milestoneIndex !== -1;
          
          // Calculate distance from current scroll position (the "wave")
          // Convert scroll progress to tick position
          const currentTickPosition = useTransform(smoothProgress, (latest) => {
            // latest is 0 to totalSegments, convert to 0 to totalTicks-1
            return (latest / totalSegments) * (totalTicks - 1);
          });
          
          const distanceFromWave = useTransform(currentTickPosition, (currentPos) => {
            return Math.abs(tickIndex - currentPos);
          });
          
          // Calculate bar width using Gaussian distribution
          const barWidth = useTransform(distanceFromWave, (distance) => {
            if (isMilestone) {
              // Milestones are always long (permanent markers) - 40px
              return 40;
            }
            
            // Gaussian distribution for the wave - tighter wave
            const sigma = 4; // Controls wave width (spread) - reduced for tighter wave
            const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
            
            // Base width for inactive ticks (light gray lines)
            const baseWidth = 12;
            // Max width for active wave (black lines)
            const maxWidth = 40;
            
            return baseWidth + (maxWidth - baseWidth) * gaussian;
          });
          
          // Calculate opacity/color intensity
          const opacity = useTransform(distanceFromWave, (distance) => {
            if (isMilestone) {
              // Milestones are always visible, but can be part of wave
              const sigma = 4; // Tighter wave
              const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
              // Milestones are always at least 0.6 opacity, can go to 1.0 when in wave
              return 0.6 + 0.4 * gaussian;
            }
            
            // Gaussian for opacity - tighter wave
            const sigma = 4; // Reduced for tighter wave
            const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
            
            // Base opacity for inactive (very light gray)
            const baseOpacity = 0.2;
            // Max opacity for active (pure black)
            const maxOpacity = 1;
            
            return baseOpacity + (maxOpacity - baseOpacity) * gaussian;
          });
          
          return (
            <motion.div
              key={tickIndex}
              className="relative flex items-center"
              style={{
                height: '1px',
              }}
            >
              {/* The tick/bar */}
              <motion.div
                style={{
                  width: barWidth,
                  height: '1px',
                  backgroundColor: '#000',
                  opacity: opacity,
                }}
                className="bg-black"
              />
              
              {/* Project label at milestones */}
              {isMilestone && (
                <motion.div
                  style={{
                    opacity: useTransform(distanceFromWave, (distance) => {
                      // Labels fade slightly when wave passes but stay visible
                      const sigma = 5; // Tighter wave
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
        })}
      </div>
    </div>
  );
}
