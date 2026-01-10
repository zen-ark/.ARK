"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const WORD = "PROJECTS";
const LETTER_STAGGER = 0.025; // Overlap for staggered entry

// Helper to create a bounce transform
// Since useTransform is linear between points, we simulate a bounce with keyframes.
// map range [0, 1] to a bouncy curve
const useBounce = (value: MotionValue<number>, inputRange: number[], outputRange: number[]) => {
  return useTransform(value, inputRange, outputRange);
};

export default function ProjectsTitle() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 1. The Void (0.0 - 0.15) - Empty space handling is implicit by start delay
  
  // 2. Kinetic Entry & Weight Shed (0.15 - 0.5)
  // 3. Impact & Bounce (0.5 - 0.6)
  // 4. Solidification (0.6 - 0.7)
  // 5. Compression (0.75 - 0.9)
  
  const lineOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  const lineScaleX = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  
  return (
    <section 
      ref={containerRef} 
      className="relative h-[300vh] w-full bg-white"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Text Container */}
        <div className="relative flex items-center justify-center">
          {WORD.split("").map((letter, i) => {
            // Staggered start times
            const start = 0.15 + (i * LETTER_STAGGER); 
            const mid = 0.45; // Arrival at wall
            const end = 0.55; // End of bounce/settle
            const solidifyEnd = 0.7; // Weight match
            const compressStart = 0.75;
            const compressEnd = 0.9;

            // X Position
            // Start far right (100vw), move to 0 (center/left align)
            // We simulate "hitting a wall" on the left. 
            // Let's assume the "wall" is the final position.
            // Bounce: go past 0 slightly (-x), then back to 0.
            
            const xInput = [0, start, mid, mid + 0.02, mid + 0.05, mid + 0.1];
            // We need to calculate start position based on viewport logic or fixed percentage
            // Using 100vw might be too much if we want them to be seen traveling. 
            // Let's use % of container width or viewport width.
            const xOutput = ["100vw", "100vw", "0px", "-2vw", "0.5vw", "0px"]; 
            
            const x = useTransform(scrollYProgress, xInput, xOutput);

            // Weight
            // Start: 900 (Black)
            // Mid (Travel): thinning -> 100 (Thin)
            // End (Solidify): -> 400 (Regular/Bold match)
            const wInput = [start, mid, solidifyEnd];
            const wOutput = [900, 100, 400]; // Variable font weights
            
            const fontWeight = useTransform(scrollYProgress, wInput, wOutput);

            // Compression (Y Scale / Position)
            // Flatten to center
            const sInput = [compressStart, compressEnd];
            const scaleY = useTransform(scrollYProgress, sInput, [1, 0]);
            const y = useTransform(scrollYProgress, sInput, ["0%", "0%"]); // Center alignment stays

            return (
              <motion.span
                key={i}
                className="inline-block text-[15vw] leading-none select-none text-black"
                style={{
                  x,
                  fontWeight,
                  scaleY,
                  y,
                  fontVariationSettings: "'wght' var(--font-weight)",
                  // We map the numeric weight to CSS var for cleaner interpolation if needed, 
                  // but framer motion handles direct fontWeight number interpolation usually.
                }}
              >
                {letter}
              </motion.span>
            );
          })}

          {/* The Line - Appears as text compresses */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-black top-1/2 -translate-y-1/2"
            style={{
              opacity: lineOpacity,
              scaleX: lineScaleX,
              transformOrigin: "center"
            }}
          />
        </div>

      </div>
    </section>
  );
}
