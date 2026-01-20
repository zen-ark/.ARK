import React, { useRef, useState, useEffect } from 'react';
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
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { ...ARK_TRANSITION, delay: 0.4 } 
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.45, ease: ARK_EASE } 
  }
};

const infoVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { ...ARK_TRANSITION, delay: 0.5 } 
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.45, ease: ARK_EASE } 
  }
};

export default function ProjectsV6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleBoxRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for up (prev), 1 for down (next)
  const [isHovering, setIsHovering] = useState(false);
  const [titleBoxHeight, setTitleBoxHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (titleBoxRef.current) {
        setTitleBoxHeight(titleBoxRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [activeProject]); // Update when project changes (title might change height)

  // Custom Cursor Logic
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorRelativeX = useMotionValue(0);
  const cursorRelativeY = useMotionValue(0);

  // Smooth springs - tuned for "OS-calm" (no overshoot)
  const springConfig = { damping: 40, stiffness: 400 }; 
  const cursorXSpring = useSpring(cursorRelativeX, springConfig); // Use relative for crosshair
  const cursorYSpring = useSpring(cursorRelativeY, springConfig); // Use relative for crosshair

  const prevPos = useRef({ x: 0, y: 0 });

  // Hide default cursor when hovering
  useEffect(() => {
    if (isHovering) {
      document.body.style.cursor = 'none';
      return () => {
        document.body.style.cursor = '';
      };
    }
  }, [isHovering]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    
    // Calculate relative coordinates
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;
      cursorRelativeX.set(relativeX);
      cursorRelativeY.set(relativeY);
    }

    cursorX.set(clientX);
    cursorY.set(clientY);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Standard Linear Mapping (Equal Duration):
    // Map the scroll distance (0-1) evenly across all projects.
    // Each project gets exactly 1/N of the scroll height.
    const rawIndex = latest * projects.length;
    let newIndex = Math.floor(rawIndex);
    
    // Clamp to valid range
    newIndex = Math.min(Math.max(newIndex, 0), projects.length - 1);

    if (newIndex !== activeProject) {
      const newDirection = newIndex > activeProject ? 1 : -1;
      setDirection(newDirection);
      setActiveProject(newIndex);
    }
  });

  // Image animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
      zIndex: 1
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 2 // Ensure active is on top during transition if needed, though container is absolute
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 1,
      zIndex: 0
    })
  };

  const project = projects[activeProject];

  // Safety check
  if (!project) {
    return null;
  }

  return (
    // Height = 600vh (standard) - The logic handles the buffer internally
    <section ref={containerRef} className="relative h-[600vh] w-full bg-white pt-[10vh] pb-[10vh]">
      {/* Sticky Viewport - 85vh height */}
      <div className="sticky top-[10vh] flex h-[85vh] w-full items-start justify-center px-4 z-[5]">
        
        {/* Scroll Indicator (Swiss Ruler) */}
        {scrollYProgress && (
          <EqualizerScroll 
            scrollYProgress={scrollYProgress} 
            projects={projects}
            activeProject={activeProject}
            cutoutHeight={titleBoxHeight}
          />
        )}
        
        {/* Background Image Container */}
        <div 
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative flex-1 h-full w-full overflow-hidden rounded-tr-[16px] rounded-bl-[16px] md:rounded-tr-[24px] md:rounded-bl-[24px] bg-gray-200 cursor-none ml-[70px] md:ml-[152px]"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`img-${project.id}`}
              className="absolute inset-0 h-full w-full"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ 
                x: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }, // Use same timing for both
                opacity: { duration: 0.65 } // Keep opacity steady (it's 1 in all states)
              }}
            >
              <a 
                href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}`} 
                className="block w-full h-full cursor-none"
                style={{ cursor: 'none' }}
              >
                <img 
                  src={project.src} 
                  alt={project.title} 
                  className="h-full w-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Top-Left Title Box */}
          <motion.div 
             ref={titleBoxRef}
             layout 
             transition={ARK_LAYOUT_TRANSITION}
             className="absolute left-0 top-0 z-20 bg-white pr-6 pb-6 pt-8 pl-4 md:pr-12 md:pb-8 md:pt-10 md:pl-6 rounded-br-[16px] md:rounded-br-[24px] max-w-[85vw] md:max-w-[80vw]"
             style={{ borderRadius: "0 0 16px 0" }} 
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
             className="absolute bottom-0 right-[-1px] z-20 bg-white pl-8 pt-6 pb-4 pr-6 md:pl-12 md:pt-8 md:pb-6 md:pr-8 rounded-tl-[16px] md:rounded-tl-[24px]"
             style={{ borderRadius: "16px 0 0 0" }} 
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

          {/* Custom Crosshair Cursor - Scoped to Image */}
          <AnimatePresence>
            {isHovering && (
              <>
                {/* Vertical Line */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    x: cursorXSpring,
                    top: 0,
                    bottom: 0,
                    width: '0.5px',
                    position: 'absolute',
                    pointerEvents: 'none',
                    zIndex: 10, // Above image (max z-6) but below text boxes (z-20)
                    mixBlendMode: 'difference',
                    backgroundColor: 'white'
                  }}
                />
                {/* Horizontal Line */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    y: cursorYSpring,
                    left: 0,
                    right: 0,
                    height: '0.5px',
                    position: 'absolute',
                    pointerEvents: 'none',
                    zIndex: 10,
                    mixBlendMode: 'difference',
                    backgroundColor: 'white'
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
