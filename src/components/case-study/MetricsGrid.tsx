import React from 'react'
import RevealOnScroll from '../RevealOnScroll'

interface MetricItemProps {
  value: string
  label: string
  description: string
  delay?: number
}

const MetricItem = ({ value, label, description, delay = 0 }: MetricItemProps) => (
  <RevealOnScroll delay={delay} className="flex flex-col items-start p-8 bg-white/5 border border-white/10 rounded-2xl h-full">
    <span className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">
      {value}
    </span>
    <h4 className="text-lg font-mono uppercase tracking-wider text-white/60 mb-2">
      {label}
    </h4>
    <p className="text-base text-white/80 leading-relaxed">
      {description}
    </p>
  </RevealOnScroll>
)

export default function MetricsGrid({ className }: { className?: string }) {
  return (
    <section className={`w-full max-w-7xl mx-auto px-4 md:px-6 ${className ? className : "py-12 md:py-24"}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricItem 
          value="25h" 
          label="Turnaround" 
          description="From project takeover to final handoff, delivering a complete redesign under tight constraints."
          delay={0}
        />
        <MetricItem 
          value="05" 
          label="Branches" 
          description="Unified distinct business units under one cohesive digital design system."
          delay={0.1}
        />
        <MetricItem 
          value="100%" 
          label="Dev-Ready" 
          description="Full component library and documentation delivered for immediate implementation."
          delay={0.2}
        />
      </div>
    </section>
  )
}
