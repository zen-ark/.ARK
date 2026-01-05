import React, { useRef, useState } from 'react';
import { motion, useScroll, AnimatePresence, useMotionValueEvent, useMotionValue, useSpring } from 'framer-motion';
import EqualizerScroll from './EqualizerScroll';

// --- Mock Data (Synced with ProjectsV2) ---
const projects = [
  {
    id: 1, // 'zen'
    title: 'ZEN.INTELLIGENCE',
    category: 'AI / STRATEGY',
    year: '2025',
    src: '/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13046.jpg',
  },
  {
    id: 2, // 'swiss'
    title: 'SWISS FINTECH',
    category: 'FINANCE / WEB',
    year: '2025',
    src: '/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13037.jpg',
  },
  {
    id: 3, // 'ark'
    title: '.ARK SYSTEM',
    category: 'INTERNAL / TOOLS',
    year: '2024',
    src: '/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13046.jpg',
  },
  {
    id: 4, // 'inv'
    title: 'INVERSA',
    category: 'ECOMMERCE',
    year: '2024',
    src: '/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13037.jpg',
  },
  {
    id: 5, // 'mod'
    title: 'MODULAR UI',
    category: 'DESIGN SYSTEM',
    year: '2023',
    src: '/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13046.jpg',
  },
  {
    id: 6, // 'exp'
    title: 'EXPERIMENTS',
    category: 'R&D',
    year: '2023',
    src: '/images/DTS_MIDNIGHT_AGENDA_Shauna_Summers_Photos_ID13037.jpg',
  },
];

const CornerSvg = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path d="M24 0H0V24C0 10.7452 10.7452 0 24 0Z" fill="white" />
  </svg>
);

// --- Constants ---
const ARK_EASE = [0.16, 1, 0.3, 1]; // "OS-calm" easeOut
const ARK_DURATION = 0.55; 
const ARK_TRANSITION = { duration: ARK_DURATION, ease: ARK_EASE };
// Even slower layout transition to prevent truncation - prevents box from shrinking faster than text exit
const ARK_LAYOUT_TRANSITION = { type: "spring", stiffness: 180, damping: 45 };

// Animation variants for text elements
const titleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { ...ARK_TRANSITION, delay: 0.4 } 
  },
  exit: { 
    opacity: 0, 
    y: -12,
    transition: { duration: 0.45, ease: ARK_EASE } // Speed up exit slightly so text clears faster
  }
};

const infoVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { ...ARK_TRANSITION, delay: 0.5 } 
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.45, ease: ARK_EASE } // Speed up exit to match title
  }
};

export default function ProjectsV6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Custom Cursor Logic
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorRotate = useMotionValue(0);

  // Smooth springs - tuned for "OS-calm" (no overshoot)
  const springConfig = { damping: 40, stiffness: 400 }; 
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const cursorRotateSpring = useSpring(cursorRotate, { damping: 30, stiffness: 300 });

  const prevPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    
    // Calculate delta
    const deltaX = clientX - prevPos.current.x;
    const deltaY = clientY - prevPos.current.y;
    
    // Only rotate if movement is significant
    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
      // Calculate angle in degrees
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      // Get current rotation value
      const currentRotation = cursorRotate.get();
      
      // Normalize angle to find shortest path
      let adjustedAngle = angle;
      const diff = angle - currentRotation;
      if (diff > 180) adjustedAngle -= 360;
      if (diff < -180) adjustedAngle += 360;
      
      cursorRotate.set(adjustedAngle);
    }

    cursorX.set(clientX);
    cursorY.set(clientY);
    prevPos.current = { x: clientX, y: clientY };
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Standard Linear Mapping:
    // Map the scroll distance (0-1) evenly across all projects.
    // If you want the last project to stay longer, increase the section height 
    // or add bottom padding/margin to the container.
    
    const rawIndex = latest * projects.length;
    let newIndex = Math.floor(rawIndex);
    
    // Clamp to valid range
    newIndex = Math.min(Math.max(newIndex, 0), projects.length - 1);

    if (newIndex !== activeProject) {
      setActiveProject(newIndex);
    }
  });

  const project = projects[activeProject];

  return (
    // Height = 600vh (standard) - The logic handles the buffer internally
    <section ref={containerRef} className="relative h-[600vh] w-full bg-white pt-[10vh] pb-[10vh]">
      {/* Sticky Viewport - 85vh height */}
      <div className="sticky top-[10vh] flex h-[85vh] w-full items-start justify-center px-8 md:px-12 max-w-[1800px] mx-auto z-[5]">
        
        {/* Scroll Indicator (Swiss Ruler) */}
        <EqualizerScroll 
          scrollYProgress={scrollYProgress} 
          projects={projects}
          activeProject={activeProject}
        />
        
        {/* Background Image Container */}
        <div 
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative flex-1 h-full w-full overflow-hidden rounded-tr-[24px] rounded-bl-[24px] bg-gray-200 cursor-none ml-[140px]"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={`img-${project.id}`}
              className="absolute inset-0 h-full w-full"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-25%", opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{ zIndex: activeProject }} 
            >
              <a href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}`} className="block w-full h-full">
                <img 
                  src={project.src} 
                  alt={project.title} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Top-Left Title Box */}
          <motion.div 
             layout 
             transition={ARK_LAYOUT_TRANSITION}
             className="absolute left-0 top-0 z-20 bg-white pr-12 pb-8 pt-10 pl-6 rounded-br-[24px] max-w-[75vw] md:max-w-[80vw]"
             style={{ borderRadius: "0 0 24px 0" }} 
          >
              {/* Inner text wrapper - removed overflow-hidden to prevent truncation during exit */}
              <div>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.h3
                    key={`title-${project.id}`}
                    layout="position" 
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="font-sans font-semibold text-[clamp(32px,8vw,48px)] md:text-[clamp(48px,5vw,72px)] uppercase leading-[0.95] tracking-tight text-[#0A0A0A] text-left whitespace-nowrap truncate block"
                    style={{ willChange: "transform, opacity", letterSpacing: "-0.03em" }}
                  >
                    {project.title}
                  </motion.h3>
                </AnimatePresence>
              </div>

              <div className="absolute -right-6 top-0 h-6 w-6">
                  <CornerSvg />
              </div>
              <div className="absolute -bottom-6 left-0 h-6 w-6">
                  <CornerSvg />
              </div>
          </motion.div>

          {/* Bottom-Right Info Box */}
          <motion.div 
             layout
             transition={ARK_LAYOUT_TRANSITION}
             className="absolute bottom-0 right-0 z-20 bg-white pl-12 pt-8 pb-6 pr-8 rounded-tl-[24px]"
             style={{ borderRadius: "24px 0 0 0" }} 
          >
              <div>
                 <AnimatePresence mode="popLayout" initial={false}>
                   <motion.div
                     key={`info-${project.id}`}
                     layout="position"
                     variants={infoVariants}
                     initial="hidden"
                     animate="visible"
                     exit="exit"
                     className="flex flex-col gap-1 items-end whitespace-nowrap min-w-[140px]"
                     style={{ willChange: "transform, opacity" }}
                   >
                     <span className="font-mono text-[11px] uppercase tracking-wider text-black/50">STATUS: DEPLOYED</span>
                     <span className="font-mono text-[11px] uppercase tracking-wider text-black/50">TYPE: {project.category.toUpperCase()}</span>
                     <span className="font-mono text-[14px] font-bold text-black mt-1">{project.year}</span>
                   </motion.div>
                 </AnimatePresence>
              </div>

              <div className="absolute right-0 -top-6 h-6 w-6 rotate-180">
                <CornerSvg />
              </div>
              <div className="absolute -left-6 bottom-0 h-6 w-6 rotate-180">
                <CornerSvg />
              </div>
          </motion.div>
        </div>

      </div>
      {/* Custom Cursor Element */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              rotate: cursorRotateSpring,
              top: 0, 
              left: 0,
              position: 'fixed',
              pointerEvents: 'none',
              zIndex: 9999,
              mixBlendMode: 'difference'
            }}
            className="flex -translate-x-[90%] -translate-y-1/2 items-center justify-center origin-center"
          >
             <img src="/arrow.svg" alt="" className="h-24 w-24" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
