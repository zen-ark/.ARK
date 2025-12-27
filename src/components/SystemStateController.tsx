import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";

// --- Configuration ---
const VALUES_CONTENT = [
  {
    title: "DIRECT LINK",
    description: "Work directly with the operator. No account managers, no middle layers—just clear communication and fast decisions.",
    tags: ["LOW_LATENCY", "P2P_CONNECTION", "NO_MIDDLEWARE"],
    nodePos: { top: "30%", left: "60%" } // Simulated 3D node position
  },
  {
    title: "ULTRA-FOCUSED",
    description: "Only 1–2 projects at a time. High signal, no noise. Every project gets the full attention it deserves.",
    tags: ["HIGH_SIGNAL", "DEEP_WORK_PROTOCOL", "BANDWIDTH_OPTIMIZED"],
    nodePos: { top: "50%", left: "65%" }
  },
  {
    title: "CRAFT-LEVEL EXECUTION",
    description: "Every pixel, transition, and system is personally built by hand. No templates, no shortcuts—just deliberate craft.",
    tags: ["PIXEL_PRECISION", "CUSTOM_KERNAL", "HAND_COMPILED"],
    nodePos: { top: "70%", left: "55%" }
  },
];

const MODULES_CONTENT = [
  { title: "INTERFACE DESIGN", status: "VERIFIED" },
  { title: "CREATIVE DIRECTION", status: "INSTALLING" },
  { title: "DESIGN SYSTEMS", status: "QUEUED" },
  { title: "MOTION & INTERACTIVE", status: "QUEUED" },
  { title: "TECHNICAL INTEGRATION", status: "QUEUED" },
];

// --- Helper Components ---

const ScrambleText = ({ text, isActive, className }: { text: string, isActive: boolean, className?: string }) => {
  const [display, setDisplay] = useState(text);
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
  useEffect(() => {
    if (!isActive) {
        setDisplay(text); // Reset or keep static when inactive
        return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(prev => 
        text.split("").map((letter, index) => {
          if (index < iterations) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3; // Controls speed
    }, 30);

    return () => clearInterval(interval);
  }, [isActive, text]);

  return <span className={className}>{display}</span>;
};

const MaskedReveal = ({ 
  children, 
  delay = 0, 
  isActive 
}: { 
  children: React.ReactNode, 
  delay?: number, 
  isActive: boolean 
}) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isActive ? "0%" : "100%" }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1], // Premium Snap Easing
          delay 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ParallaxParticles = ({ scrollYProgress }: { scrollYProgress: any }) => {
    // Generate static random positions for particles to avoid hydration mismatch
    const particles = useRef([...Array(20)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 5 + 3
    }))).current;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/20 rounded-full"
                    style={{
                        top: p.top,
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        y: useTransform(scrollYProgress, [0, 1], [0, (i % 2 === 0 ? -100 : 100) * (Math.random() + 0.5)]) // Parallax
                    }}
                    animate={{ opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
};


const ConnectionLines = ({ activeIndex, progress }: { activeIndex: number, progress: any }) => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            {VALUES_CONTENT.map((item, i) => {
                const isActive = activeIndex === i;
                if (!isActive) return null;
                
                return (
                    <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                        {/* Define connection points - assuming text is roughly left-center */}
                        {/* We use a path that draws from near the text title to the 'node' */}
                        <motion.line 
                            x1="30%" y1="50%" // Approx text location
                            x2={item.nodePos.left} y2={item.nodePos.top}
                            stroke="white" 
                            strokeWidth="0.5" 
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <motion.circle 
                            cx={item.nodePos.left} cy={item.nodePos.top} r="3" 
                            fill="white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        />
                        <motion.circle 
                            cx={item.nodePos.left} cy={item.nodePos.top} r="12" 
                            stroke="white" strokeWidth="0.5" fill="none"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.2 }}
                            transition={{ delay: 0.2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        />
                    </motion.g>
                );
            })}
        </svg>
    );
};


// --- Custom Components ---

const ScannerGrid = ({ scanProgress }: { scanProgress: any }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
            className="absolute top-0 left-0 right-0 bg-[#0A0A0A] origin-top"
            style={{ 
                height: useTransform(scanProgress, [0, 1], ["0%", "100%"]) 
            }}
        />

        <motion.div 
            className="absolute top-0 left-0 right-0 overflow-hidden"
            style={{ 
                height: useTransform(scanProgress, [0, 1], ["0%", "100%"]) 
            }}
        >
            <div className="absolute inset-0 w-full h-full flex justify-between px-12 md:px-24 pointer-events-none opacity-10">
                 {[...Array(5)].map((_, i) => (
                    <motion.div 
                        key={i} 
                        className="w-px h-full bg-white relative"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    >
                        <motion.div 
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-emerald-400 blur-[2px]"
                            style={{ 
                                height: "40px", 
                                top: useTransform(scanProgress, [0, 1], ["-40px", "100%"]), 
                                opacity: useTransform(scanProgress, [0, 0.95, 1], [1, 1, 0])
                            }}
                        />
                    </motion.div>
                 ))}
            </div>
            
            <div className="absolute top-32 left-0 right-0 h-px bg-white/10" />
            <div className="absolute bottom-32 left-0 right-0 h-px bg-white/10" />
        </motion.div>

        <motion.div 
            className="absolute left-0 right-0 z-20 border-b border-emerald-500/80 shadow-[0_0_20px_2px_rgba(16,185,129,0.4)]"
            style={{ 
                top: useTransform(scanProgress, [0, 1], ["0%", "100%"]),
                opacity: useTransform(scanProgress, [0, 0.95, 1], [1, 1, 0])
            }}
        >
             <div className="absolute right-12 bottom-2 font-mono text-[10px] text-emerald-500 tracking-widest bg-[#0A0A0A]/80 px-2 py-1 backdrop-blur-sm">
                [ INITIALIZING_SYSTEM_CORE... ]
             </div>
        </motion.div>
    </div>
  );
};

const BlueprintGrid = ({ opacity }: { opacity: any }) => (
  <motion.div 
    className="absolute inset-0 pointer-events-none z-0" 
    style={{ opacity }}
  >
    {/* Expansive Light Grey Grid with Radial Mask */}
    <div className="absolute inset-0" 
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
        backgroundSize: '150px 150px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
      }}
    />
    
    {/* Radial Spotlight Effect - Subtle */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_80%)] mix-blend-overlay opacity-50" />
    
    {/* Vignette for depth */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)] opacity-60" />

    <div className="absolute inset-0 border-[20px] border-white/80 pointer-events-none" />
  </motion.div>
);

const CornerUI = ({ color, progress, rightOpacity }: { color: any, progress: any, rightOpacity: any }) => (
  <div className="absolute inset-0 pointer-events-none z-50 mix-blend-difference">
    {/* Bottom Left - Title */}
    <div className="absolute bottom-8 left-12 md:left-24">
        <motion.h3 style={{ color }} className="font-mono text-xs font-bold tracking-widest mb-2">
            THE .ARK MODEL
        </motion.h3>
        <motion.div style={{ color }} className="font-mono text-xs tracking-widest opacity-60">
          47.3769° N, 8.5417° E
        </motion.div>
    </div>

    {/* Bottom Right - System Status & Progress */}
    <motion.div 
        style={{ opacity: rightOpacity }}
        className="absolute bottom-8 right-12 md:right-24 flex flex-col items-end gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <motion.span style={{ color }} className="font-mono text-xs tracking-widest opacity-80">
          V.2.04 [STABLE]
        </motion.span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-24 h-0.5 bg-black/10 rounded-full overflow-hidden mt-1">
        <motion.div 
            className="h-full bg-emerald-500"
            style={{ width: useTransform(progress, [0.55, 1], ["0%", "100%"]) }}
        />
      </div>
    </motion.div>
  </div>
);

// --- Main Component ---

export default function SystemStateController() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [phase1Index, setPhase1Index] = useState(0);
  const [phase2Index, setPhase2Index] = useState(0);
  const [activePhase, setActivePhase] = useState<1 | 2>(1);

  // --- Animation Transforms ---

  // 1. Scanner Entry (Slower speed)
  const scannerProgress = useTransform(scrollYProgress, [0, 0.2], [0, 1]); 
  
  // 2. Phase 1 Content Visibility
  const phase1ContentStart = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const phase1Opacity = useTransform(scrollYProgress, [0.2, 0.25, 0.45, 0.5], [0, 1, 1, 0]);

  // 3. White Transition (Soft Gradient Wash)
  const whiteCurtainY = useTransform(scrollYProgress, [0.5, 0.65], ["100%", "0%"]);
  
  // 4. Phase 2 Content Visibility
  const phase2Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);

  // 5. HUD Color Flip
  const hudColor = useTransform(scrollYProgress, [0.55, 0.6], ["#FFFFFF", "#000000"]);
  
  // 6. HUD Right Visibility
  const hudRightOpacity = useTransform(scrollYProgress, [0.5, 0.55], [1, 0]);


  // --- Logic Mapping ---
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Determine active phase
    if (latest < 0.55) {
        setActivePhase(1);
        // Phase 1: 0.2 to 0.5
        const p1 = Math.max(0, Math.min(1, (latest - 0.2) / 0.3));
        if (p1 < 0.33) setPhase1Index(0);
        else if (p1 < 0.66) setPhase1Index(1);
        else setPhase1Index(2);
    } else {
        setActivePhase(2);
        // Phase 2: 0.65 to 1.0 (Modules)
        const p2 = Math.max(0, Math.min(1, (latest - 0.65) / 0.35));
        const idx = Math.floor(p2 * 5); // 5 items
        setPhase2Index(Math.min(4, Math.max(0, idx)));
    }
  });

  return (
    <section 
      ref={containerRef} 
      className="relative h-[800vh] w-full bg-white" 
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-white">
        
        {/* --- LAYERS --- */}

        {/* Layer 1: Scanner Grid (Black Background Base) */}
        <div className="absolute inset-0 z-0">
            <ScannerGrid scanProgress={scannerProgress} />
            <ParallaxParticles scrollYProgress={scrollYProgress} />
            {activePhase === 1 && <ConnectionLines activeIndex={phase1Index} progress={scrollYProgress} />}
        </div>

        {/* Layer 2: White Wash (Transition to Phase 2) */}
        <motion.div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ y: whiteCurtainY }}
        >
            {/* Solid White Body */}
            <div className="w-full h-full bg-white relative">
                 <BlueprintGrid opacity={1} />
            </div>
        </motion.div>

        {/* --- CONTENT LAYERS --- */}

        {/* Phase 1: The .ARK Model (Black) */}
        <motion.div 
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: phase1Opacity }}
        >
            <div className="relative z-10 w-full h-full flex flex-col justify-center max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                {VALUES_CONTENT.map((item, index) => {
                    const isActive = index === phase1Index && activePhase === 1;
                    return (
                        <motion.div
                            key={index}
                            initial={false}
                            animate={{ 
                                opacity: isActive ? 1 : 0,
                                filter: isActive ? "blur(0px)" : "blur(10px)",
                                scale: isActive ? 1 : 0.98
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-12 lg:px-24"
                        >
                            <div className="max-w-4xl w-full pt-32 relative">
                                <div className="mb-8 relative">
                                    <MaskedReveal isActive={isActive} delay={0.1}>
                                        <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-7xl tracking-tight text-white mix-blend-normal uppercase leading-[0.9]">
                                            {item.title}
                                        </h2>
                                    </MaskedReveal>
                                </div>
                                <div className="mb-12 space-y-1">
                                    {item.description.split('. ').map((sentence, i) => (
                                        <MaskedReveal key={i} isActive={isActive} delay={0.3 + (i * 0.1)}>
                                            <p className="font-sans text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed">
                                                {sentence.trim()}{i < item.description.split('. ').length - 1 ? '.' : ''}
                                            </p>
                                        </MaskedReveal>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: isActive ? "60px" : 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="h-px bg-white/20 hidden md:block"
                                    />
                                    {item.tags.map((tag, i) => (
                                        <MaskedReveal key={tag} isActive={isActive} delay={0.5 + (i * 0.1)}>
                                            <span className="inline-block px-3 py-1.5 border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-400 tracking-widest uppercase backdrop-blur-sm">
                                                [{tag}]
                                            </span>
                                        </MaskedReveal>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>

        {/* Phase 2: Module Installation (White/Blueprint - Fixed List) */}
        <motion.div 
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ opacity: phase2Opacity }}
        >
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col justify-center h-full">
                <div className="space-y-8">
                    {MODULES_CONTENT.map((module, i) => {
                        const isCurrent = i === phase2Index && activePhase === 2;
                        
                        return (
                            <div 
                                key={i}
                                className="flex items-center justify-between border-b border-black/5 pb-4 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                style={{
                                    // Removed opacity transition here to use classes below
                                }}
                            >
                                <div className="flex items-center gap-6">
                                    <span className={`font-mono text-xs w-8 transition-colors duration-800 ${isCurrent ? 'text-black' : 'text-[#E5E5E5]'}`}>0{i + 1}</span>
                                    <div className="flex items-center gap-4 relative">
                                        {/* Crosshair Brackets */}
                                        <AnimatePresence>
                                            {isCurrent && (
                                                <>
                                                    <motion.div 
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: -16 }}
                                                        exit={{ opacity: 0, x: 10 }}
                                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                        className="absolute -left-2 top-0 bottom-0 w-[2px] bg-black"
                                                    />
                                                    <motion.div 
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 16 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                        className="absolute -right-2 top-0 bottom-0 w-[2px] bg-black"
                                                    />
                                                </>
                                            )}
                                        </AnimatePresence>

                                        <h3 className={`font-sans font-bold text-3xl md:text-5xl tracking-tight uppercase transition-colors duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCurrent ? 'text-black' : 'text-[#E5E5E5]'}`}>
                                            {module.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className={`font-mono text-xs tracking-widest min-w-[140px] text-right transition-colors duration-800 ${isCurrent ? 'text-black' : 'text-[#E5E5E5]'}`}>
                                    {isCurrent ? 
                                        <span>[ <ScrambleText text="INSTALLING..." isActive={true} /> ]</span> : 
                                        i < phase2Index ? `[ VERIFIED ]` : `[ QUEUED ]`
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>

        {/* Persistent UI (HUD) */}
        <CornerUI color={hudColor} progress={scrollYProgress} rightOpacity={hudRightOpacity} />

      </div>
    </section>
  );
}
