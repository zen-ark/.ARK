import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
}

// --- Configuration ---
const VALUES_CONTENT = [
  {
    title: "DIRECT LINK",
    description: [
        "Work directly with the operator.",
        "No account managers, no middle layers.",
        "Just clear communication and fast decisions."
    ],
    tags: ["LOW_LATENCY", "P2P_CONNECTION", "NO_MIDDLEWARE"],
  },
  {
    title: "ULTRA-FOCUSED",
    description: [
        "Only 1–2 projects at a time.",
        "High signal, no noise.",
        "Every project gets the full attention it deserves."
    ],
    tags: ["HIGH_SIGNAL", "DEEP_WORK_PROTOCOL", "BANDWIDTH_OPTIMIZED"],
  },
  {
    title: "CRAFT-LEVEL EXECUTION",
    description: [
        "Every pixel, transition, and system",
        "is personally built by hand.",
        "No templates, no shortcuts—just deliberate craft."
    ],
    tags: ["PIXEL_PRECISION", "CUSTOM_KERNAL", "HAND_COMPILED"],
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
        setDisplay(text);
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
      iterations += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isActive, text]);

  return <span className={className}>{display}</span>;
};

// Manual GSAP Masked Reveal (No SplitText)
const GSAPMaskedReveal = ({ 
    children, 
    isActive, 
    className 
}: { 
    children: React.ReactNode, 
    isActive: boolean,
    className?: string 
}) => {
    const container = useRef<HTMLDivElement>(null);
    
    useGSAP(() => {
        if (!container.current) return;
        
        const lines = container.current.querySelectorAll('.reveal-text');
        
        if (isActive) {
            gsap.fromTo(lines, 
                { y: "100%" },
                { 
                    y: "0%", 
                    duration: 0.8, 
                    stagger: 0.1, 
                    ease: "power2.out",
                    overwrite: "auto"
                }
            );
        } else {
            // FIX: Don't hide completely on inactive to prevent flickering during fast scroll
            // Just let them stay visible or animate out slowly if needed. 
            // For this design (sequential reading), keeping them visible until the next one triggers or the section exits is safer.
            // But the design asks for "one at a time" focus.
            // We will make the "out" animation faster and ensuring it doesn't break new entrances.
            gsap.to(lines, { y: "100%", duration: 0.2, overwrite: "auto" });
        }
    }, { scope: container, dependencies: [isActive] });

    return (
        <div ref={container} className={className}>
            {children}
        </div>
    );
};

// Component to wrap individual lines for the reveal effect
const RevealLine = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`overflow-hidden ${className}`}>
        <div className="reveal-text translate-y-full">
            {children}
        </div>
    </div>
);


const ParallaxParticles = () => {
    // Basic static particles or randomized, but no scroll hook dependency for simplicity in GSAP structure
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
             {/* Particles can be static or animated via CSS if not hooked to scroll directly */}
        </div>
    );
};


// --- Custom Components ---

// Single Grid Component using mix-blend-mode: difference for auto-inversion
const UnifiedGrid = () => (
  <div 
    className="absolute inset-0 pointer-events-none z-30 mix-blend-difference"
    style={{
        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
    }}
  >
    <div 
        className="absolute inset-0"
        style={{
            backgroundSize: '100px 100px',
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            maskImage: 'radial-gradient(circle at center, white 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, white 60%, transparent 100%)'
        }}
    />
  </div>
);

const CornerUI = ({ colorRef, rightOpacityRef }: { colorRef: React.MutableRefObject<string>, rightOpacityRef: React.MutableRefObject<number> }) => {
    const titleRef = useRef<HTMLDivElement>(null);
    const coordsRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // Expose control to GSAP via refs and class names if needed, or just let parent animate
    // For now, we use a simple ref-based update or just pass props. 
    // Since we are moving to "One Timeline", we can animate these DOM nodes directly by ID or Class.

    return (
        <div className="absolute inset-0 pointer-events-none z-50 mix-blend-difference">
            <div className="absolute bottom-8 left-12 md:left-24">
                <h3 id="hud-title" className="font-mono text-xs font-bold tracking-widest mb-2 text-white">THE .ARK MODEL</h3>
                <div id="hud-coords" className="font-mono text-xs tracking-widest opacity-60 text-white">47.3769° N, 8.5417° E</div>
            </div>

            <div id="hud-right" className="absolute bottom-8 right-12 md:right-24 flex flex-col items-end gap-3 text-white">
                <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span id="hud-status" className="font-mono text-xs tracking-widest opacity-80">V.2.04 [STABLE]</span>
                </div>
                <div className="w-24 h-0.5 bg-white/10 rounded-full overflow-hidden mt-1">
                    <div id="hud-progress" className="h-full bg-emerald-500 w-0" />
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

export default function SystemStateController() {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);
  const phase2ContainerRef = useRef<HTMLDivElement>(null);
  const phase1ContainerRef = useRef<HTMLDivElement>(null);

  // States for masked reveals and content logic
  const [phase1Index, setPhase1Index] = useState(0);
  const [phase2Index, setPhase2Index] = useState(0);
  const [activePhase, setActivePhase] = useState<0 | 1 | 2>(0); 
  const [contentVisible, setContentVisible] = useState(false);
  const [lastItemVerified, setLastItemVerified] = useState(false);

  // Auto-verify last item logic
  useEffect(() => {
    if (phase2Index === 4 && activePhase === 2) {
        const timer = setTimeout(() => {
            setLastItemVerified(true);
        }, 2000); 
        return () => clearTimeout(timer);
    } else if (phase2Index < 4) {
        setLastItemVerified(false);
    }
  }, [phase2Index, activePhase]);

  // Master GSAP Timeline
  useGSAP(() => {
    if (!containerRef.current) return;

    // Timeline Configuration
    // Total Durations:
    // Start: 0.5
    // Zoom: 2.0
    // Phase 1: 3.0
    // Wipe: 1.5
    // Dwell: 1.0 (New: Pins 'INTERFACE DESIGN')
    // Phase 2 Scroll: 4.0
    // TOTAL: 12.0
    const TOTAL_DURATION = 12.0;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=6000", // Increased slightly for the extra dwell time
        pin: true,
        scrub: 1, // Smooth scrub
        snap: {
            // Functional snap logic to auto-complete the transition
            snapTo: (value) => {
                const wipeStart = 5.4 / TOTAL_DURATION; // Trigger slightly before actual wipe start (90% of last item)
                const wipeEnd = 7.0 / TOTAL_DURATION;
                
                // If user is inside the wipe/transition zone, snap to the end of it (Start of Phase 2 Dwell)
                // This handles forward scroll: user hits transition -> auto scroll to end
                if (value > wipeStart && value < wipeEnd) {
                    return wipeEnd;
                }
                // Handle reverse scroll: if user is scrolling up from Phase 2 into wipe, snap back to Phase 1 end?
                // Or just standard snapping?
                // The request says "same in reverse".
                // If value is decreasing and enters the wipe zone from below...
                // This logic is simple: if in zone, snap to end. 
                // To support bidirectional snapping, we check proximity.
                
                // Bidirectional Snap Logic:
                const midPoint = (wipeStart + wipeEnd) / 2;
                if (value > wipeStart && value < wipeEnd) {
                    if (value > midPoint) return wipeEnd; // Closer to end -> finish wipe
                    return wipeStart; // Closer to start -> go back to black
                }

                return value; // Otherwise, standard scroll
            },
            duration: { min: 0.8, max: 1.2 }, // Controlled snap duration
            delay: 0, // Instant trigger
            ease: "power2.inOut"
        },
        onUpdate: (self) => {
             // Map progress 0-1 to timeline time
             // Total duration: 0.5 (start) + 2 (zoom) + 3 (p1) + 1.5 (wipe) + 4 (p2) = 11.0
             const p = self.progress * 11.0;

             // Phase Switch Logic
             // Phase 1 ends when Wipe starts (5.5)
             if (p < 2.45) { // Zooming
                 if (activePhase !== 0) setActivePhase(0);
                 if (contentVisible) setContentVisible(false);
             } 
             else if (p >= 2.45 && p < 5.5) { // Phase 1 Active
                 if (activePhase !== 1) setActivePhase(1);
                 
                 // FIX: Ensure content remains visible if we are in this phase
                 if (!contentVisible) setContentVisible(true);
                 
                 // Phase 1 Index Logic
                 // Duration 3 units (2.5 -> 5.5)
                 const p1Prog = (p - 2.5) / 3;
                 if (p1Prog < 0.33) setPhase1Index(0);
                 else if (p1Prog < 0.66) setPhase1Index(1);
                 else setPhase1Index(2);
             } 
             else if (p >= 5.5) { // Phase 2 Active (Starts at Wipe)
                 if (activePhase !== 2) setActivePhase(2);
                 
                 // FIX: Keep content visible
                 if (!contentVisible) setContentVisible(true);
                 
                 // Phase 2 Index Logic
                 // Scroll interaction starts after Wipe (7.0) and lasts 4 units (7.0 -> 11.0)
                 // During Wipe (5.5 -> 7.0), index stays at 0
                 const p2Prog = Math.max(0, (p - 7.0) / 4);
                 const idx = Math.floor(p2Prog * 5);
                 setPhase2Index(Math.min(4, idx));
                 
                 // HUD Progress
                 gsap.set("#hud-progress", { width: `${Math.min(100, p2Prog * 100)}%` });
             }
        }
      }
    });

    // --- TIMELINE STEPS ---
    
    // 1. Pause / Lock (0.5s equivalent)
    tl.addLabel("start")
      .to({}, { duration: 0.5 }); 

    // 2. Zoom Sequence (2s)
    tl.addLabel("zoomStart")
      .to("#ark-model-svg", { 
          scale: 150, 
          transformOrigin: "27.72% 90.55%", 
          ease: "power2.inOut", 
          duration: 2 
      }, "zoomStart")
      .to("#ark-model-svg path:not(#ark-dot)", { opacity: 0, duration: 0.5 }, "zoomStart+=0.5")
      
      // Fix: Target the FULL SCREEN overlay, not the one inside the max-w container
      .to("#full-screen-zoom-overlay", { opacity: 1, duration: 0.2 }, "zoomStart+=1.8")
      
      // 3. Immediate Reveal Trigger (Synced perfectly with zoom end)
      .to(zoomLayerRef.current, { opacity: 0, duration: 0.1 }, "zoomStart+=1.95")
      .call(() => { setContentVisible(true); setActivePhase(1); }, [], "zoomStart+=1.95"); 
      // Note: React state update might be slightly delayed, but opacity fade of zoom layer reveals the content behind.
      // Content is effectively "there" waiting.

    // 4. Phase 1 Scroll (Just waiting for scroll scrubbing to drive state changes)
    tl.addLabel("phase1Start", "zoomStart+=2");
    tl.to({}, { duration: 3 }); // Dwell time for 3 items (1s each approx)

    // 5. Phase 2 Wipe & Granular Exit (1.5s)
    tl.addLabel("wipeStart");
    
    // Wipe: White background moves up
    tl.to(phase2ContainerRef.current, { 
        clipPath: "inset(0% 0 0 0)", 
        duration: 1.5, 
        ease: "power2.inOut" 
    }, "wipeStart");

    // HUD Color Transition
    // Removed #hud-title and #hud-coords from color flip so they use mix-blend-difference to invert naturally
    tl.to(["#hud-status"], { color: "#000000", duration: 0.5 }, "wipeStart+=0.2");
    tl.to("#hud-right", { opacity: 0, duration: 0.5 }, "wipeStart"); // Hide status? Or flip color? User said "Remove purple stuff" so hiding works, or color flip. 
    // Re-reading: "Flip their color to black... Bottom-Right: SYSTEM STATUS..." 
    // User logic in previous code was opacity -> 0 for right side. Keeping that.

    // GRANULAR EXIT of Phase 1 Last Item ("CRAFT-LEVEL EXECUTION")
    // Target specific IDs we will assign in render
    tl.to("#p1-exit-tags", { y: -50, opacity: 0, duration: 0.8, ease: "power2.in" }, "wipeStart")
      .to("#p1-exit-body", { y: -100, opacity: 0, duration: 0.8, ease: "power2.in" }, "wipeStart+=0.1")
      .to("#p1-exit-header", { y: -150, opacity: 0, duration: 0.8, ease: "power2.in" }, "wipeStart+=0.2");


    // 6. Dwell Period (1.0s) - Locks on INTERFACE DESIGN
    tl.to({}, { duration: 1.0 });

    // 7. Phase 2 Scroll
    tl.addLabel("phase2Start");
    tl.to({}, { duration: 4 }); // Dwell time for modules

  }, { scope: containerRef });


  return (
    <section 
      ref={containerRef} 
      data-theme={activePhase === 2 ? "light" : "dark"}
      className="relative w-full h-screen bg-[#0A0A0A] overflow-hidden" 
    >
        {/* --- LAYERS (Stacked Absolute) --- */}

        {/* 1. Unified Grid */}
        <UnifiedGrid />

        {/* 2. Phase 1 Layer (Black BG + Values Content) */}
        <div 
            ref={phase1ContainerRef}
            className="absolute inset-0 z-10 bg-[#0A0A0A] flex items-center justify-center pointer-events-none"
        >
             {/* Particles (Static/Simple) */}
             <div className="absolute inset-0 opacity-20">
                 {/* Simple dots for texture if needed, keeping clean for now as requested "Same as before" but code simplified */}
             </div>
             
             {/* Phase 1 Content Container */}
             <div className="relative w-full h-full flex flex-col justify-center max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                {VALUES_CONTENT.map((item, index) => {
                    // Logic: Driven by state from GSAP updates
                    const isLastItem = index === 2; 
                    // Fix: Keep last item active during Phase 2 so timeline handles the exit/enter via wrapper opacity,
                    // avoiding the masked reveal re-triggering when scrolling back up.
                    const isActive = (index === phase1Index && activePhase === 1) || (isLastItem && activePhase === 2);

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: isActive ? 1 : 0,
                                filter: isActive ? "blur(0px)" : "blur(10px)",
                                scale: isActive ? 1 : 0.98
                            }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-12 lg:px-24"
                        >
                            <div className="max-w-4xl w-full pt-32 relative">
                                <GSAPMaskedReveal isActive={isActive}>
                                    {/* Header */}
                                    <div id={isLastItem ? "p1-exit-header" : undefined} className="mb-8 relative">
                                        <RevealLine>
                                            <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-7xl tracking-tight text-white mix-blend-normal uppercase leading-[0.9]">
                                                {item.title}
                                            </h2>
                                        </RevealLine>
                                    </div>
                                    
                                    {/* Body */}
                                    <div id={isLastItem ? "p1-exit-body" : undefined} className="mb-12 space-y-1">
                                        {item.description.map((line, i) => (
                                            <RevealLine key={i}>
                                                <p className="font-sans text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed">
                                                    {line}
                                                </p>
                                            </RevealLine>
                                        ))}
                                    </div>

                                    {/* Tags */}
                                    <div id={isLastItem ? "p1-exit-tags" : undefined} className="flex flex-wrap gap-4 items-center">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: isActive ? "60px" : 0 }}
                                            className="h-px bg-white/20 hidden md:block"
                                        />
                                        {item.tags.map((tag, i) => (
                                            <RevealLine key={tag} className="inline-block">
                                                <span className="inline-block px-3 py-1.5 border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-400 tracking-widest uppercase backdrop-blur-sm">
                                                    [{tag}]
                                                </span>
                                            </RevealLine>
                                        ))}
                                    </div>
                                </GSAPMaskedReveal>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>

        {/* 3. Phase 2 Layer (White BG + Modules Content) */}
        {/* Initial ClipPath hides it completely at the bottom */}
        <div 
            ref={phase2ContainerRef}
            className="absolute inset-0 z-20 bg-white flex items-center justify-center"
            style={{ clipPath: "inset(100% 0 0 0)" }} 
        >
             <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col justify-center h-full">
                <div className="space-y-8">
                    {MODULES_CONTENT.map((module, i) => {
                        const isLast = i === 4;
                        const isCurrent = (i === phase2Index && activePhase === 2) && !(isLast && lastItemVerified);
                        const isFirstItem = i === 0;
                        const shouldShowFirst = activePhase === 2; // Simple trigger for first item

                        return (
                            <div 
                                key={i}
                                className="flex items-center justify-between pb-4 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            >
                                <div className="flex items-center gap-6">
                                    <span className={`font-mono text-xs w-8 transition-colors duration-800 ${isCurrent ? 'text-black' : 'text-[#E5E5E5]'}`}>0{i + 1}</span>
                                    <div className="flex items-center gap-4 relative">
                                        <AnimatePresence>
                                            {isCurrent && (
                                                <>
                                                    <motion.div 
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: -16 }}
                                                        exit={{ opacity: 0, x: 10 }}
                                                        className="absolute -left-2 top-0 bottom-0 w-[2px] bg-black"
                                                    />
                                                    <motion.div 
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 16 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        className="absolute -right-2 top-0 bottom-0 w-[2px] bg-black"
                                                    />
                                                </>
                                            )}
                                        </AnimatePresence>

                                        {isFirstItem ? (
                                            <GSAPMaskedReveal isActive={shouldShowFirst}>
                                                <RevealLine>
                                                    <h3 className={`font-sans font-bold text-3xl md:text-5xl tracking-tight uppercase transition-colors duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCurrent ? 'text-black' : 'text-[#E5E5E5]'}`}>
                                                        {module.title}
                                                    </h3>
                                                </RevealLine>
                                            </GSAPMaskedReveal>
                                        ) : (
                                            <h3 className={`font-sans font-bold text-3xl md:text-5xl tracking-tight uppercase transition-colors duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCurrent ? 'text-black' : 'text-[#E5E5E5]'}`}>
                                                {module.title}
                                            </h3>
                                        )}
                                    </div>
                                </div>
                                <div className={`font-mono text-xs tracking-widest min-w-[140px] text-right transition-colors duration-800 ${isCurrent ? 'text-black' : (i < phase2Index || (isLast && lastItemVerified) ? 'text-[#3BD58B]' : 'text-[#E5E5E5]')}`}>
                                    {isCurrent ? 
                                        <span>[ <ScrambleText text="INSTALLING..." isActive={true} /> ]</span> : 
                                        (i < phase2Index || (isLast && lastItemVerified)) ? `[ VERIFIED ]` : `[ QUEUED ]`
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* 4. Zoom Layer (SVG) - Topmost initial layer (fades out) */}
        <div 
            ref={zoomLayerRef}
            className="absolute inset-0 z-40 flex items-center justify-center bg-white pointer-events-none"
        >
             {/* New Full Screen Overlay to prevent "box" artifact */}
             <div id="full-screen-zoom-overlay" className="absolute inset-0 bg-[#0A0A0A] opacity-0 z-50" />

             {/* Match the size of the original Hero component SVG */}
             <div className="w-full px-6 mt-4 z-40">
                <svg 
                    id="ark-model-svg"
                    width="100%" 
                    viewBox="0 0 1479 127" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto origin-center"
                >
                     <g id="ark-text">
                        <path d="M38.9193 123.926V13.9971H0.000316483V2.7311H89.4458V13.9971H50.5268V123.926H38.9193ZM114.121 123.926V2.7311H125.728V61.2803L120.266 57.0129H195.714L190.252 61.2803V2.7311H201.859V123.926H190.252V63.8408L195.714 68.2789H120.266L125.728 63.8408V123.926H114.121ZM242.924 123.926V2.7311H317.519V13.9971H254.532V57.6957H315.47V68.791H254.532V112.66H318.884V123.926H242.924ZM402.658 123.926V107.369H418.874V123.926H402.658ZM442.179 123.926L486.389 2.7311H501.752L545.792 123.926H533.16L520.187 87.5677H467.783L454.81 123.926H442.179ZM471.709 76.3017H516.261L494.071 13.1436L471.709 76.3017ZM574.437 123.926V2.7311H618.818C627.467 2.7311 634.807 4.21048 640.838 7.16923C646.984 10.0142 651.706 14.1109 655.006 19.4594C658.306 24.808 659.957 31.2376 659.957 38.7483C659.957 44.3244 658.648 49.2746 656.03 53.5989C653.527 57.9233 650.17 61.3941 645.959 64.0115C641.749 66.6288 637.197 68.1082 632.304 68.4496L631.45 66.9133C639.416 66.9133 645.561 68.7341 649.885 72.3756C654.324 75.9034 656.884 81.4795 657.567 89.104L660.639 123.926H648.861L645.959 90.1282C645.504 84.5521 643.513 80.4553 639.985 77.838C636.457 75.1068 630.767 73.7412 622.915 73.7412H586.045V123.926H574.437ZM586.045 62.4752H620.696C629.003 62.4752 635.547 60.4268 640.326 56.3301C645.22 52.1196 647.666 46.202 647.666 38.5776C647.666 30.6117 645.22 24.5235 640.326 20.3129C635.433 16.1024 628.207 13.9971 618.648 13.9971H586.045V62.4752ZM697.073 123.926V2.7311H708.68V67.5961L768.083 2.7311H782.763L734.626 55.3059L786.177 123.926H772.179L726.945 63.8408L708.68 83.6417V123.926H697.073ZM871.497 123.926V2.7311H888.226L929.705 111.295L971.185 2.7311H987.913V123.926H976.306V22.7027L937.216 123.926H922.194L883.105 22.7027V123.926H871.497Z" fill="black"/>
                        <path id="ark-dot" d="M402.658 123.926V107.369H418.874V123.926H402.658Z" fill="black"/>
                        <path d="M1075.9 126.657C1064.64 126.657 1054.91 124.154 1046.71 119.147C1038.63 114.026 1032.43 106.743 1028.11 97.2975C1023.78 87.8522 1021.62 76.5862 1021.62 63.4994C1021.62 50.4126 1023.78 39.1465 1028.11 29.7013C1032.43 20.1422 1038.63 12.8022 1046.71 7.68132C1054.91 2.5604 1064.64 -5.79634e-05 1075.9 -5.79634e-05C1087.28 -5.79634e-05 1097.01 2.5604 1105.09 7.68132C1113.17 12.8022 1119.37 20.1422 1123.7 29.7013C1128.14 39.1465 1130.35 50.4126 1130.35 63.4994C1130.35 76.5862 1128.14 87.8522 1123.7 97.2975C1119.37 106.743 1113.17 114.026 1105.09 119.147C1097.01 124.154 1087.28 126.657 1075.9 126.657ZM1075.9 115.221C1084.78 115.221 1092.35 113.172 1098.6 109.076C1104.86 104.979 1109.7 99.0613 1113.11 91.3231C1116.53 83.5848 1118.24 74.3102 1118.24 63.4994C1118.24 52.6885 1116.53 43.414 1113.11 35.6757C1109.7 27.8236 1104.86 21.8492 1098.6 17.7525C1092.35 13.5419 1084.78 11.4367 1075.9 11.4367C1067.14 11.4367 1059.57 13.5419 1053.2 17.7525C1046.94 21.8492 1042.1 27.8236 1038.69 35.6757C1035.39 43.414 1033.74 52.6885 1033.74 63.4994C1033.74 74.3102 1035.39 83.5848 1038.69 91.3231C1042.1 99.0613 1046.94 104.979 1053.2 109.076C1059.57 113.172 1067.14 115.221 1075.9 115.221ZM1164.11 123.926V2.7311H1200.64C1219.07 2.7311 1233.24 8.02272 1243.14 18.606C1253.16 29.0754 1258.16 44.0399 1258.16 63.4994C1258.16 82.8451 1253.27 97.7527 1243.48 108.222C1233.7 118.692 1219.76 123.926 1201.66 123.926H1164.11ZM1175.72 112.66H1200.64C1215.55 112.66 1226.81 108.507 1234.44 100.199C1242.18 91.8921 1246.04 79.6587 1246.04 63.4994C1246.04 47.1124 1242.18 34.7653 1234.44 26.458C1226.81 18.1508 1215.55 13.9971 1200.64 13.9971H1175.72V112.66ZM1291.91 123.926V2.7311H1366.51V13.9971H1303.52V57.6957H1364.46V68.791H1303.52V112.66H1367.87V123.926H1291.91ZM1405.05 123.926V2.7311H1416.65V118.123L1411.36 112.66H1478.79V123.926H1405.05Z" fill="black"/>
                    </g>
                </svg>
             </div>
        </div>

        {/* 7. Persistent UI (HUD) - Topmost Layer */}
        <CornerUI colorRef={useRef("#fff")} rightOpacityRef={useRef(1)} />

    </section>
  );
}
