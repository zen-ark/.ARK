import React from 'react';
import { motion } from 'framer-motion';

const Node = ({ label, icon, delay }: { label: string, icon: React.ReactNode, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="flex flex-col items-center gap-3 relative z-10"
  >
    <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center shadow-2xl">
      {icon}
    </div>
    <span className="font-mono text-xs text-white/50 uppercase tracking-wider bg-black/50 px-2 py-1 rounded border border-white/5">{label}</span>
  </motion.div>
);

const Connection = ({ delay }: { delay: number }) => (
  <motion.div 
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent w-full md:w-24 relative top-[-14px] hidden md:block"
  />
);

const ConnectionMobile = ({ delay }: { delay: number }) => (
  <motion.div 
    initial={{ scaleY: 0, opacity: 0 }}
    whileInView={{ scaleY: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="w-px h-8 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent md:hidden relative"
  />
);

export default function CodeFlowDiagram() {
  return (
    <div className="w-full bg-black/40 rounded-2xl border border-white/10 p-8 md:p-12 my-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        
        {/* PDF Input */}
        <Node 
          label="PDF Source" 
          delay={0}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/80">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
        />

        <Connection delay={0.2} />
        <ConnectionMobile delay={0.2} />

        {/* Vector DB */}
        <Node 
          label="Vector DB" 
          delay={0.4}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          }
        />

        <Connection delay={0.6} />
        <ConnectionMobile delay={0.6} />

        {/* Secure API */}
        <Node 
          label="Secure API" 
          delay={0.8}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/80">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />

        <Connection delay={1.0} />
        <ConnectionMobile delay={1.0} />

        {/* Frontend */}
        <Node 
          label="UI Client" 
          delay={1.2}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/80">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          }
        />

      </div>
      
      <div className="mt-8 pt-8 border-t border-white/5 text-center">
        <p className="font-mono text-xs text-white/40">
          <span className="text-emerald-500">{`>`}</span> DATA_TRANSFORMATION_PIPELINE v1.0
        </p>
      </div>
    </div>
  );
}
