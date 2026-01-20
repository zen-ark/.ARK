import React, { useState } from "react";
import { motion } from "framer-motion";

// --- Types ---

type RegistryItemType = "node" | "log";

interface RegistryItem {
  id: string;
  type: RegistryItemType;
  // Node specific
  logo?: string;
  sector?: string;
  protocol?: string;
  hexId?: string;
  // Log specific
  content?: string;
  author?: string;
  // Grid
  colSpan?: number; // default 1
}

// --- Data ---

const ITEMS: RegistryItem[] = [
  {
    id: "node-1",
    type: "node",
    logo: "/logos/react.svg",
    sector: "FRONTEND_OPS",
    protocol: "P-772",
    hexId: "0x44_RCT",
    colSpan: 1,
  },
  {
    id: "log-1",
    type: "log",
    content: "ARK optimized our core infrastructure. Deployment efficiency increased by 40%.",
    author: "LOG_USER: [Redacted]",
    colSpan: 2,
  },
  {
    id: "node-2",
    type: "node",
    logo: "/logos/astro.svg",
    sector: "STATIC_GEN",
    protocol: "P-891",
    hexId: "0x9A_STR",
    colSpan: 1,
  },
  {
    id: "node-3",
    type: "node",
    logo: "/logos/tailwind.svg",
    sector: "STYLE_SYS",
    protocol: "P-112",
    hexId: "0xB2_TLW",
    colSpan: 1,
  },
  {
    id: "node-4",
    type: "node",
    logo: "/logos/blender.svg",
    sector: "3D_ASSET",
    protocol: "P-445",
    hexId: "0x1C_BLD",
    colSpan: 1,
  },
  {
    id: "log-2",
    type: "log",
    content: "Complete overhaul of our design system. Scalability issues resolved.",
    author: "ID: J_VALENTINE // CTO",
    colSpan: 2,
  },
   {
    id: "node-5",
    type: "node",
    logo: "/logos/after-effects.svg",
    sector: "MOTION_GFX",
    protocol: "P-339",
    hexId: "0x7F_AFX",
    colSpan: 1,
  },
  {
    id: "node-6",
    type: "node",
    logo: "/logos/react.svg", 
    sector: "NEURAL_NET",
    protocol: "P-991",
    hexId: "0xE5_NRL",
    colSpan: 1,
  },
];

// --- Components ---

const GridNode = ({ item, index }: { item: RegistryItem; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Ambient pulse for random nodes
  const isPulsing = item.id === "node-1" || item.id === "node-4";

  return (
    <motion.div
      className={`relative h-56 md:h-64 border border-white/10 bg-bg-surface overflow-hidden group rounded-[6px]
        ${item.colSpan === 2 ? "md:col-span-2" : "col-span-1"}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }
      }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
          borderColor: isHovered ? "var(--color-border-focus)" : "var(--color-border-default)"
      }}
      transition={{ duration: 0.3 }}
    >
        {/* Content Container */}
        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-20">
            {/* Top Row */}
            <div className="flex justify-between items-start font-mono text-[10px] text-text-subtle/40 tracking-wider">
                <div className="uppercase opacity-50">
                    {item.hexId}
                </div>
                <div className="flex items-center gap-2">
                    {item.id === "node-1" && (
                        <span className="text-[9px] text-brand-secondary">ONLINE</span>
                    )}
                    <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-brand-secondary/80"
                        animate={isPulsing ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.2 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Center: Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.img 
                    src={item.logo} 
                    alt={item.sector}
                    className="w-12 h-12 md:w-16 md:h-16 max-h-16 grayscale opacity-60"
                    animate={{  
                        opacity: isHovered ? 1 : 0.6,
                        filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
                        scale: isHovered ? 1.05 : 1
                    }}
                    transition={{ duration: 0.4 }}
                />
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-end font-mono text-[10px] text-text-subtle/40 tracking-wider uppercase mt-auto">
                 <div>{item.sector?.replace(/_/g, " ")}</div>
                 <div>{item.protocol}</div>
            </div>
        </div>
    </motion.div>
  );
};

const GridLog = ({ item, index }: { item: RegistryItem; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`relative h-auto min-h-[220px] md:h-64 border border-white/10 bg-bg-surface p-6 md:p-8 flex flex-col justify-center overflow-hidden rounded-[6px]
                ${item.colSpan === 2 ? "md:col-span-2" : "col-span-1"}
            `}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }
            }}
            viewport={{ once: true, margin: "-50px" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
                backgroundColor: isHovered ? "hsl(var(--color-bg-muted))" : "hsl(var(--color-bg-surface))",
                borderColor: isHovered ? "var(--color-border-focus)" : "var(--color-border-default)"
            }}
            transition={{ duration: 0.4 }}
        >
             <div className="font-mono text-xs text-brand-secondary mb-4 tracking-wider uppercase opacity-80">
                Project_Debrief
             </div>
             <p className="font-sans text-lg md:text-2xl text-text-primary leading-tight mb-6 font-light">
                "{item.content}"
             </p>
             <div className="font-mono text-[10px] text-text-subtle tracking-widest uppercase border-t border-border-default pt-4 w-full opacity-60">
                {item.author}
             </div>
        </motion.div>
    );
};

export default function NetworkRegistry() {
  return (
    <section className="w-full bg-bg-surface py-16 md:py-24 px-4 md:px-8 relative z-10 border-t border-border-default">
      <div className="max-w-[1800px] mx-auto">
        <motion.div  
            className="mb-12 flex items-baseline gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
             <h2 className="text-sm font-mono text-brand-secondary uppercase tracking-widest">
                // Network Registry
             </h2>
             <div className="h-px bg-border-default flex-1" />
             <span className="text-xs font-mono text-text-subtle">VALIDATED NODES: {ITEMS.filter(i => i.type === 'node').length}</span>
        </motion.div>

        {/* The Grid itself has a background color to show through the gaps, creating borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ITEMS.map((item, index) => (
            item.type === "node" ? (
                <GridNode key={item.id} item={item} index={index} />
            ) : (
                <GridLog key={item.id} item={item} index={index} />
            )
          ))}
        </div>
        
        <div className="mt-8 flex justify-between font-mono text-[10px] text-text-subtle/30 uppercase px-1">
            <span>System Status: Optimal</span>
            <span>Encryption: SHA-256</span>
        </div>
      </div>
    </section>
  );
}
